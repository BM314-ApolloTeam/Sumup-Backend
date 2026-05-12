using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Sumup.Core.Entities;
using Sumup.Core.Interfaces;
using Sumup.Infrastructure.Data;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Sumup.Infrastructure.Services
{
    public class PodcastGeneratorWorker : BackgroundService
    {
        private readonly ILogger<PodcastGeneratorWorker> _logger;
        private readonly IServiceProvider _serviceProvider;

        public PodcastGeneratorWorker(ILogger<PodcastGeneratorWorker> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("PodcastGeneratorWorker started.");

            // Çalışma aralığı: 1 dakika
            using var timer = new PeriodicTimer(TimeSpan.FromMinutes(1));

            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                _logger.LogInformation("PodcastGeneratorWorker running at: {time}", DateTimeOffset.Now);
                try
                {
                    await ProcessUpcomingPodcastsAsync(stoppingToken);
                    await CleanupOldPodcastsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing PodcastGeneratorWorker.");
                }
            }
        }

        private async Task ProcessUpcomingPodcastsAsync(CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var googleAuth = scope.ServiceProvider.GetRequiredService<IGoogleAuthService>();
            var calendarService = scope.ServiceProvider.GetRequiredService<IGoogleCalendarService>();
            var taskService = scope.ServiceProvider.GetRequiredService<IGoogleTaskService>();
            var geminiService = scope.ServiceProvider.GetRequiredService<IGeminiService>();
            var elevenLabsService = scope.ServiceProvider.GetRequiredService<IElevenLabsService>();
            var weatherService = scope.ServiceProvider.GetRequiredService<IWeatherService>();

            var nowUtc = DateTime.UtcNow;
            
            // Veritabanındaki tüm kullanıcıları çekiyoruz
            var users = await dbContext.Users.ToListAsync(stoppingToken);

            foreach (var user in users)
            {
                // Kullanıcının timezone'una göre şu anki saati bulalım.
                // Basitlik adına sunucu saatini kullanabiliriz veya UTC üzerinden gidebiliriz.
                // Burada TimeSpan olan WakeUpTime'ı kontrol edeceğiz.
                // 15 dakika içinde uyanacak olanları bul.
                
                var userTimeNow = TimeZoneInfo.ConvertTimeFromUtc(nowUtc, TimeZoneInfo.FindSystemTimeZoneById(user.TimeZoneId ?? "UTC"));
                var timeUntilWakeUp = user.WakeUpTime - userTimeNow.TimeOfDay;

                // Eğer uyanma saatine 0-15 dakika kalmışsa (veya biraz geçmişse, yani az önce uyanma saati geldiyse)
                if (timeUntilWakeUp.TotalMinutes > -5 && timeUntilWakeUp.TotalMinutes <= 15)
                {
                    // Bugün için podcast üretilmiş mi?
                    var today = userTimeNow.Date;
                    var hasPodcastToday = await dbContext.Podcasts
                        .AnyAsync(p => p.UserId == user.Id && p.CreatedAt >= today.ToUniversalTime(), stoppingToken);

                    if (!hasPodcastToday)
                    {
                        _logger.LogInformation($"Starting podcast generation for user {user.Id}");

                        // 1. Yeni Token Al
                        var accessToken = await googleAuth.RefreshAccessTokenAsync(user.GoogleRefreshToken);
                        if (string.IsNullOrEmpty(accessToken))
                        {
                            _logger.LogWarning($"Failed to refresh token for user {user.Id}");
                            continue;
                        }

                        // 2. Takvim ve Görevleri Çek
                        var events = await calendarService.GetDailyEventsAsync(accessToken, nowUtc);
                        var tasks = await taskService.GetDailyTasksAsync(accessToken);
                        
                        // Hava Durumu Çek (Sabit Ankara için şimdilik)
                        string weatherInfo = string.Empty;
                        try
                        {
                            weatherInfo = await weatherService.GetDailyWeatherAsync("Ankara");
                        }
                        catch { /* Hava durumu çekilemezse yoksay */ }

                        // 3. Gemini ile Özet Üret
                        var summary = await geminiService.GenerateSummaryAsync(events, tasks, user.Preferences, weatherInfo);

                        // 4. ElevenLabs ile Ses Üret (Eğer VoiceId tanımlıysa)
                        string audioFilePath = string.Empty;
                        if (!string.IsNullOrEmpty(user.VoiceId))
                        {
                            try
                            {
                                var audioBytes = await elevenLabsService.GenerateSpeechAsync(summary, user.VoiceId);
                                
                                // Dosyayı kaydet
                                var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "podcasts");
                                if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);

                                var fileName = $"{user.Id}_{today:yyyyMMdd}.mp3";
                                audioFilePath = Path.Combine(directoryPath, fileName);
                                
                                await File.WriteAllBytesAsync(audioFilePath, audioBytes, stoppingToken);
                            }
                            catch (Exception ex)
                            {
                                _logger.LogError(ex, $"Failed to generate audio for user {user.Id}");
                            }
                        }

                        // 5. Veritabanına Kaydet
                        var podcast = new Podcast
                        {
                            Id = Guid.NewGuid(),
                            UserId = user.Id,
                            Summary = summary,
                            AudioFilePath = audioFilePath,
                            CreatedAt = nowUtc
                        };

                        dbContext.Podcasts.Add(podcast);
                        await dbContext.SaveChangesAsync(stoppingToken);

                        _logger.LogInformation($"Successfully generated podcast for user {user.Id}");
                    }
                }
            }
        }

        private async Task CleanupOldPodcastsAsync(CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var thresholdDate = DateTime.UtcNow.AddDays(-3);

            var oldPodcasts = await dbContext.Podcasts
                .Where(p => p.CreatedAt < thresholdDate)
                .ToListAsync(stoppingToken);

            foreach (var podcast in oldPodcasts)
            {
                if (!string.IsNullOrEmpty(podcast.AudioFilePath) && File.Exists(podcast.AudioFilePath))
                {
                    try
                    {
                        File.Delete(podcast.AudioFilePath);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Could not delete old file: {podcast.AudioFilePath}");
                    }
                }
                dbContext.Podcasts.Remove(podcast);
            }

            if (oldPodcasts.Any())
            {
                await dbContext.SaveChangesAsync(stoppingToken);
                _logger.LogInformation($"Cleaned up {oldPodcasts.Count} old podcasts.");
            }
        }
    }
}
