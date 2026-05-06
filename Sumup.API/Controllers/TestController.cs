using Microsoft.AspNetCore.Mvc;
using Sumup.Core.Interfaces;
using System;
using System.Threading.Tasks;

namespace Sumup.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly IGoogleCalendarService _calendarService;
        private readonly IGoogleTaskService _taskService;
        private readonly IWeatherService _weatherService;

        // Dependency Injection ile her iki servisimizi de çağırıyoruz
        public TestController(IGoogleCalendarService calendarService, IGoogleTaskService taskService, IWeatherService weatherService)
        {
            _calendarService = calendarService;
            _taskService = taskService;
            _weatherService = weatherService;
        }

        [HttpGet("google-data")]
        public async Task<IActionResult> GetMyGoogleData([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token))
                return BadRequest("Lütfen Google Access Token'ınızı girin.");

            // Bugünün takvim etkinliklerini çek (Ankara saati ile uyumlu olması için UtcNow kullanabiliriz)
            var events = await _calendarService.GetDailyEventsAsync(token, DateTime.UtcNow);

            // Aktif görevleri çek
            var tasks = await _taskService.GetDailyTasksAsync(token);

            // İkisini birleştirip harika bir JSON döndürüyoruz
            return Ok(new
            {
                Message = "Google verileriniz başarıyla çekildi!",
                CalendarEvents = events,
                Tasks = tasks
            });
        }

        [HttpGet("weather")]
        public async Task<IActionResult> GetWeather([FromQuery] string city = "Ankara")
        {
            var weatherInfo = await _weatherService.GetDailyWeatherAsync(city);
            return Ok(new { Message = weatherInfo });
        }
    }
}
