using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sumup.Infrastructure.Data;
using System;
using System.Threading.Tasks;

namespace Sumup.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public UserController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public class UpdateSettingsRequest
        {
            public Guid UserId { get; set; } // Şimdilik test kolaylığı için direkt ID alıyoruz. İleride JWT claim'den alınabilir.
            public string WakeUpTime { get; set; } = "07:00:00"; // "HH:mm:ss" formatında
            public string GoogleRefreshToken { get; set; } = string.Empty;
            public string Preferences { get; set; } = string.Empty;
            public string VoiceId { get; set; } = string.Empty;
            public string TimeZoneId { get; set; } = "Turkey Standard Time";
        }

        [HttpPost("settings")]
        public async Task<IActionResult> UpdateSettings([FromBody] UpdateSettingsRequest request)
        {
            var user = await _dbContext.Users.FindAsync(request.UserId);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            if (TimeSpan.TryParse(request.WakeUpTime, out var wakeUpTime))
            {
                user.WakeUpTime = wakeUpTime;
            }
            
            if (!string.IsNullOrEmpty(request.GoogleRefreshToken))
                user.GoogleRefreshToken = request.GoogleRefreshToken;
                
            user.Preferences = request.Preferences;
            user.VoiceId = request.VoiceId;
            user.TimeZoneId = request.TimeZoneId;

            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Ayarlar başarıyla güncellendi." });
        }

        [HttpPost("create-test-user")]
        public async Task<IActionResult> CreateTestUser()
        {
            var user = new Core.Entities.User
            {
                Id = Guid.NewGuid(),
                Username = "Test User",
                PasswordHash = "dummy_hash"
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Test kullanıcısı oluşturuldu", UserId = user.Id });
        }
    }
}
