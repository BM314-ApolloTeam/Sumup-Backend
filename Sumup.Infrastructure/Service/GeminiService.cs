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

        public async Task<string> GenerateSummaryAsync(List<string> calendarEvents, List<string> tasks, string userPreferences)
        {
            if (string.IsNullOrEmpty(_settings.ApiKey))
            {
                return "Gemini API Key is not configured.";
            }

            var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={_settings.ApiKey}";

            // Constructing the prompt based on the inputs
            var promptBuilder = new StringBuilder();
            promptBuilder.AppendLine("Lütfen aşağıdaki takvim etkinlikleri, görevler ve kişisel tercihleri kullanarak günün bir özetini ve planlamasını oluştur:");
            promptBuilder.AppendLine();

            promptBuilder.AppendLine("Kişisel Tercihler:");
            promptBuilder.AppendLine(string.IsNullOrWhiteSpace(userPreferences) ? "Belirtilmedi." : userPreferences);
            promptBuilder.AppendLine();

            promptBuilder.AppendLine("Takvim Etkinlikleri:");
            if (calendarEvents == null || !calendarEvents.Any())
            {
                promptBuilder.AppendLine("- Etkinlik bulunamadı.");
            }
            else
            {
                foreach (var ev in calendarEvents)
                {
                    promptBuilder.AppendLine($"- {ev}");
                }
            }
            promptBuilder.AppendLine();

            promptBuilder.AppendLine("Görevler:");
            if (tasks == null || !tasks.Any())
            {
                promptBuilder.AppendLine("- Görev bulunamadı.");
            }
            else
            {
                foreach (var task in tasks)
                {
                    promptBuilder.AppendLine($"- {task}");
                }
            }

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
