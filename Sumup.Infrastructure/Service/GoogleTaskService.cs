using Sumup.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Sumup.Infrastructure.Service
{
    public class GoogleTasksService : IGoogleTaskService
    {
        private readonly HttpClient _httpClient;

        public GoogleTasksService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<List<string>> GetDailyTasksAsync(string accessToken)
        {
            var allTasks = new List<string>();

            // Zaman sınırlarını belirliyoruz (Dün ve 3 gün sonrası - Yerel saat ile)
            var yesterday = DateTime.Now.Date.AddDays(-1);
            var threeDaysLater = DateTime.Now.Date.AddDays(3);

            // 1. AŞAMA: Kullanıcının tüm görev listelerini çek
            var listsRequest = new HttpRequestMessage(HttpMethod.Get, "https://tasks.googleapis.com/tasks/v1/users/@me/lists");
            listsRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var listsResponse = await _httpClient.SendAsync(listsRequest);
            if (!listsResponse.IsSuccessStatusCode) return allTasks;

            var listsContent = await listsResponse.Content.ReadAsStringAsync();
            using var listsJson = JsonDocument.Parse(listsContent);

            if (!listsJson.RootElement.TryGetProperty("items", out var listItems)) return allTasks;

            // 2. AŞAMA: Her bir listenin ID'sini al ve içindeki görevleri topla
            foreach (var list in listItems.EnumerateArray())
            {
                var listId = list.GetProperty("id").GetString();
                var listTitle = list.GetProperty("title").GetString(); // "Ödev", "Genel" vb.

                var tasksRequestUrl = $"https://tasks.googleapis.com/tasks/v1/lists/{listId}/tasks?showCompleted=false";
                var tasksRequest = new HttpRequestMessage(HttpMethod.Get, tasksRequestUrl);
                tasksRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var tasksResponse = await _httpClient.SendAsync(tasksRequest);
                if (tasksResponse.IsSuccessStatusCode)
                {
                    var tasksContent = await tasksResponse.Content.ReadAsStringAsync();
                    using var tasksJson = JsonDocument.Parse(tasksContent);

                    if (tasksJson.RootElement.TryGetProperty("items", out var taskItems))
                    {
                        foreach (var task in taskItems.EnumerateArray())
                        {
                            var taskTitle = task.GetProperty("title").GetString();
                            bool shouldAdd = false;
                            string dateInfo = ""; // AI için tarih bilgisi ekleyeceğiz

                            // Görevin bir teslim tarihi (due) var mı diye bakıyoruz
                            if (task.TryGetProperty("due", out var dueElement) && dueElement.ValueKind != JsonValueKind.Null)
                            {
                                // Google'dan gelen UTC tarihi yerel tarihe çeviriyoruz
                                var dueDate = dueElement.GetDateTime().ToLocalTime().Date;

                                // Eğer tarih dün ile önümüzdeki 3 gün arasındaysa KABUL ET
                                if (dueDate >= yesterday && dueDate <= threeDaysLater)
                                {
                                    shouldAdd = true;
                                    dateInfo = $" (Son Tarih: {dueDate:dd.MM.yyyy})";
                                }
                            }
                            else
                            {
                                // Tarih atanmamış (Genel vb.) görevleri de KABUL ET
                                shouldAdd = true;
                            }

                            // Eğer filtremizden geçtiyse listeye ekle
                            if (shouldAdd)
                            {
                                allTasks.Add($"[{listTitle}] {taskTitle}{dateInfo}");
                            }
                        }
                    }
                }
            }

            return allTasks;
        }
    }
}
