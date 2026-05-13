using Microsoft.AspNetCore.Mvc;
using Sumup.Core.Interfaces;
using System;
using System.Linq;
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

        public TestController(
            IGoogleCalendarService calendarService,
            IGoogleTaskService taskService,
            IWeatherService weatherService
        )
        {
            _calendarService = calendarService;
            _taskService = taskService;
            _weatherService = weatherService;
        }

        [HttpGet("weather")]
        public async Task<IActionResult> GetWeather([FromQuery] string city = "Ankara")
        {
            try
            {
                var weatherInfo = await _weatherService.GetDailyWeatherAsync(city);

                return Ok(new
                {
                    success = true,
                    message = weatherInfo
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Weather service connection failed.",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("google-data")]
        public async Task<IActionResult> GetGoogleData()
        {
            try
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();

                if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Google access token is missing."
                    });
                }

                var googleAccessToken = authHeader.Replace("Bearer ", "");

                var calendarList = await _calendarService.GetDailyEventsAsync(
                    googleAccessToken,
                    DateTime.UtcNow
                );

                var tasksList = await _taskService.GetDailyTasksAsync(googleAccessToken);

                var formattedTasks = tasksList.Count > 0
                    ? string.Join("\n", tasksList)
                    : "No active tasks found.";

                var formattedEvents = calendarList.Count > 0
                    ? string.Join("\n", calendarList)
                    : "No calendar events found.";

                return Ok(new
                {
                    success = true,
                    message = $"Tasks:\n{formattedTasks}\n\nCalendar Events:\n{formattedEvents}",
                    calendarEvents = calendarList,
                    tasks = tasksList
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Google Calendar and Tasks connection failed.",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("daily-summary")]
        public async Task<IActionResult> GetDailySummary(
            [FromQuery] string googleAccessToken,
            [FromQuery] string city = "Ankara"
        )
        {
            try
            {
                if (string.IsNullOrEmpty(googleAccessToken))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Google access token is required to fetch Calendar and Tasks data."
                    });
                }

                var weatherInfo = await _weatherService.GetDailyWeatherAsync(city);

                var calendarList = await _calendarService.GetDailyEventsAsync(
                    googleAccessToken,
                    DateTime.UtcNow
                );

                var formattedEvents = calendarList.Count > 0
                    ? string.Join("\n", calendarList)
                    : "No scheduled events found recently.";

                var tasksList = await _taskService.GetDailyTasksAsync(googleAccessToken);

                var formattedTasks = tasksList.Count > 0
                    ? string.Join("\n", tasksList)
                    : "No active tasks found in the next 3 days.";

                var aiPromptText = $@"
Today's Date: {DateTime.Now:dd MMMM yyyy dddd}

Weather:
{weatherInfo}

Calendar Events Today and Tomorrow:
{formattedEvents}

Active Tasks:
{formattedTasks}

You are a professional, energetic, and motivating personal assistant and podcast host.
Use the information above to prepare a short daily summary podcast script that I can listen to in the morning.

Please pay attention to these details:
- Give a small friendly suggestion based on the feels-like temperature, wind, or humidity.
- Emphasize timing by checking today's and tomorrow's calendar events.
- Gently remind urgent or overdue tasks by looking at their due dates.
- Keep the text natural, fluent, and conversational.";

                return Ok(new
                {
                    success = true,
                    message = "Data collected successfully and AI prompt was prepared.",
                    aiPrompt = aiPromptText
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Daily summary could not be created.",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }
    }
}