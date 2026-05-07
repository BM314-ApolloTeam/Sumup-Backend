using Microsoft.AspNetCore.Mvc;
using Sumup.Core.Interfaces;
using System.Threading.Tasks;

namespace Sumup.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SummaryController : ControllerBase
    {
        private readonly IGoogleCalendarService _calendarService;
        private readonly IGoogleTaskService _taskService;
        private readonly IGeminiService _geminiService;
        private readonly IElevenLabsService _elevenLabsService;

        public SummaryController(
            IGoogleCalendarService calendarService,
            IGoogleTaskService taskService,
            IGeminiService geminiService,
            IElevenLabsService elevenLabsService)
        {
            _calendarService = calendarService;
            _taskService = taskService;
            _geminiService = geminiService;
            _elevenLabsService = elevenLabsService;
        }

        public class SummaryRequest
        {
            public string Token { get; set; } = string.Empty;
            public string Preferences { get; set; } = string.Empty;
            public string VoiceId { get; set; } = string.Empty;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateSummary([FromBody] SummaryRequest request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("Lütfen Google Access Token'ınızı girin.");
            }

            // Bugünün takvim etkinliklerini çek
            var events = await _calendarService.GetDailyEventsAsync(request.Token, System.DateTime.UtcNow);

            // Aktif görevleri çek
            var tasks = await _taskService.GetDailyTasksAsync(request.Token);

            // Gemini ile özeti oluştur
            var summary = await _geminiService.GenerateSummaryAsync(events, tasks, request.Preferences);

            string? audioBase64 = null;
            if (!string.IsNullOrEmpty(request.VoiceId))
            {
                try
                {
                    var audioBytes = await _elevenLabsService.GenerateSpeechAsync(summary, request.VoiceId);
                    audioBase64 = System.Convert.ToBase64String(audioBytes);
                }
                catch (System.Exception ex)
                {
                    // Hata durumunda sadece özet dönebiliriz veya hatayı ekleyebiliriz
                    return Ok(new
                    {
                        Message = "Özet oluşturuldu fakat seslendirme sırasında hata oluştu: " + ex.Message,
                        Summary = summary
                    });
                }
            }

            return Ok(new
            {
                Message = string.IsNullOrEmpty(audioBase64) ? "Özet başarıyla oluşturuldu!" : "Özet ve ses başarıyla oluşturuldu!",
                Summary = summary,
                AudioBase64 = audioBase64
            });
        }
    }
}
