using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sumup.Core.Interfaces;
using System;
using System.Threading.Tasks;

namespace Sumup.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // JWT Kapı Güvenliği devrede!
    public class TestController : ControllerBase
    {
        private readonly IGoogleCalendarService _calendarService;
        private readonly IGoogleTaskService _taskService;
        private readonly IWeatherService _weatherService;

        public TestController(IGoogleCalendarService calendarService, IGoogleTaskService taskService, IWeatherService weatherService)
        {
            _calendarService = calendarService;
            _taskService = taskService;
            _weatherService = weatherService;
        }

        // TOPLAYICI AGGREGATOR ENDPOINTİ
        [HttpGet("daily-summary")]
        public async Task<IActionResult> GetDailySummary([FromQuery] string googleAccessToken, [FromQuery] string city = "Ankara")
        {
            if (string.IsNullOrEmpty(googleAccessToken))
                return BadRequest("Takvim ve Görevleri çekebilmek için Google Access Token gereklidir.");

            // 1. Hava Durumunu Çek
            var weatherInfo = await _weatherService.GetDailyWeatherAsync(city);


            // 2. Takvim Etkinliklerini Çek ve Metne Çevir
            var calendarList = await _calendarService.GetDailyEventsAsync(googleAccessToken, DateTime.UtcNow);
            var formattedEvents = calendarList.Count > 0
                ? string.Join("\n", calendarList) // Elemanları alt alta birleştir
                : "Yakın zamanda planlanmış etkinlik yok.";

            // 3. Görevleri Çek ve Metne Çevir
            var tasksList = await _taskService.GetDailyTasksAsync(googleAccessToken);
            var formattedTasks = tasksList.Count > 0
                ? string.Join("\n", tasksList) // Elemanları alt alta birleştir
                : "Önümüzdeki 3 gün içerisinde aktif görev bulunmuyor."; // Metni güncelledik

            // 4. YAPAY ZEKAYA GİDECEK OLAN O HARİKA METNİ (PROMPT) HAZIRLA
            var aiPromptText = $@"
Bugünün Tarihi: {DateTime.Now.ToString("dd MMMM yyyy dddd")}

Hava Durumu:
{weatherInfo}

Takvim Etkinlikleri (Bugün ve Yarın):
{formattedEvents}

Aktif Görevler (Gecikenler, Yaklaşanlar ve Genel):
{formattedTasks}

Sen profesyonel, enerjik ve motive edici bir kişisel asistan ve podcast sunucususun. 
Yukarıdaki bilgileri kullanarak bana sabah dinleyebileceğim, güne harika başlamamı sağlayacak kısa bir günlük özet podcast metni hazırla.

Lütfen şu detaylara dikkat et:
- Hava durumundaki hissedilen sıcaklık, rüzgar veya neme göre ufak, samimi bir tavsiye ver (örn: rüzgarlıysa kalın giyin vb.).
- Takvimdeki [Bugün] ve [Yarın] etiketlerine dikkat ederek zamanlamayı vurgula.
- Görevlerdeki son teslim tarihlerine bakarak acil olanları veya gecikmiş olanları tatlı bir dille hatırlat.
- Metin akıcı, konuşma dilinde (sanki radyoda konuşuyormuşsun gibi) olsun.";

            return Ok(new
            {
                Message = "Veriler başarıyla toplandı ve AI için metin hazırlandı!",
                AiPrompt = aiPromptText
            });
        }
    }
}