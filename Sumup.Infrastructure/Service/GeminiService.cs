using Microsoft.Extensions.Options;
using Sumup.Core.Configurations;
using Sumup.Core.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Sumup.Infrastructure.Service
{
    public class GeminiService : IGeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly GeminiApiSettings _settings;

        public GeminiService(HttpClient httpClient, IOptions<GeminiApiSettings> options)
        {
            _httpClient = httpClient;
            _settings = options.Value;
        }

        public async Task<string> GenerateSummaryAsync(List<string> calendarEvents, List<string> tasks, string userPreferences, string weatherInfo)
        {
            if (string.IsNullOrEmpty(_settings.ApiKey))
            {
                return "Gemini API Key is not configured.";
            }
            var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent?key={_settings.ApiKey}";

            var promptBuilder = new StringBuilder();
            promptBuilder.AppendLine("Sen profesyonel, enerjik ve motive edici bir kişisel asistan ve podcast sunucususun.");
            promptBuilder.AppendLine($"Bugünün Tarihi: {DateTime.Now.ToString("dd MMMM yyyy dddd")}");
            promptBuilder.AppendLine($"\n[HAVA DURUMU]:\n{weatherInfo}");

            promptBuilder.AppendLine("\n[TAKVİM ETKİNLİKLERİ]:");
            promptBuilder.AppendLine(calendarEvents.Any() ? string.Join("\n", calendarEvents) : "Yakın zamanda planlanmış etkinlik yok.");

            promptBuilder.AppendLine("\n[GÖREVLER]:");
            promptBuilder.AppendLine(tasks.Any() ? string.Join("\n", tasks) : "Aktif görev bulunmuyor.");

            promptBuilder.AppendLine($"\n[KULLANICI ÖZEL TERCİHLERİ]:\n{(string.IsNullOrWhiteSpace(userPreferences) ? "Yok" : userPreferences)}");

            promptBuilder.AppendLine("\nTALİMATLAR:");
            promptBuilder.AppendLine("- Bir radyo sunucusu gibi akıcı, samimi ve konuşma dilinde bir metin hazırla.");
            promptBuilder.AppendLine("- Hava durumuna göre (sıcaklık, rüzgar vb.) samimi bir tavsiyede bulun.");
            promptBuilder.AppendLine("- Takvimdeki [Bugün] ve [Yarın] etiketlerini kullanarak zaman vurgusu yap.");
            promptBuilder.AppendLine("- Önemli veya gecikmiş görevleri tatlı bir dille hatırlat.");


            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = promptBuilder.ToString() }
                        }
                    }
                }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(endpoint, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                return $"Error generating summary: {response.StatusCode} - {errorContent}";
            }

            var responseBody = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseBody);
            
            try
            {
                var generatedText = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                return generatedText ?? "No content generated.";
            }
            catch (System.Exception ex)
            {
                return $"Failed to parse Gemini response. Error: {ex.Message}";
            }
        }
    }
}
