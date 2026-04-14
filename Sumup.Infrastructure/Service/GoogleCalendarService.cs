using Sumup.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Sumup.Infrastructure.Services
{
    public class GoogleCalendarService : IGoogleCalendarService
    {
        private readonly HttpClient _httpClient;

        // Dependency Injection ile HttpClient alıyoruz (Polly için bu yapı şarttır)
        public GoogleCalendarService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<List<string>> GetDailyEventsAsync(string accessToken, DateTime targetDate)
        {
            var allEvents = new List<string>();

            // Zaman sınırlarını belirliyoruz (Hedef günün başlangıcı ve bitişi)
            var timeMin = targetDate.ToString("yyyy-MM-ddT00:00:00Z");
            var timeMax = targetDate.ToString("yyyy-MM-ddT23:59:59Z");

            // 1. AŞAMA: Kullanıcının sahip olduğu tüm takvimleri listele
            var calendarListRequest = new HttpRequestMessage(HttpMethod.Get, "https://www.googleapis.com/calendar/v3/users/me/calendarList");
            calendarListRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var listResponse = await _httpClient.SendAsync(calendarListRequest);
            if (!listResponse.IsSuccessStatusCode) return allEvents;

            var listContent = await listResponse.Content.ReadAsStringAsync();
            using var listJson = JsonDocument.Parse(listContent);

            if (!listJson.RootElement.TryGetProperty("items", out var calendarItems)) return allEvents;

            // 2. AŞAMA: Her bir takvim ID'si için o günkü etkinlikleri çek
            foreach (var calendar in calendarItems.EnumerateArray())
            {
                var calendarId = calendar.GetProperty("id").GetString();
                var calendarTitle = calendar.GetProperty("summary").GetString(); // "Okul", "TÜRKSAT" vb.

                var eventsUrl = $"https://www.googleapis.com/calendar/v3/calendars/{Uri.EscapeDataString(calendarId)}/events?timeMin={timeMin}&timeMax={timeMax}&singleEvents=true&orderBy=startTime";

                var eventsRequest = new HttpRequestMessage(HttpMethod.Get, eventsUrl);
                eventsRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var eventsResponse = await _httpClient.SendAsync(eventsRequest);
                if (eventsResponse.IsSuccessStatusCode)
                {
                    var eventsContent = await eventsResponse.Content.ReadAsStringAsync();
                    using var eventsJson = JsonDocument.Parse(eventsContent);

                    if (eventsJson.RootElement.TryGetProperty("items", out var eventItems))
                    {
                        foreach (var ev in eventItems.EnumerateArray())
                        {
                            var summary = ev.TryGetProperty("summary", out var s) ? s.GetString() : "İsimsiz Etkinlik";

                            // Örnek: "[TÜRKSAT] Proje Toplantısı"
                            allEvents.Add($"[{calendarTitle}] {summary}");
                        }
                    }
                }
            }

            return allEvents;
        }
    }
}
