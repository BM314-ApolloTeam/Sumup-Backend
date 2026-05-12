using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sumup.Infrastructure.Data;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Sumup.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PodcastController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public PodcastController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("today/{userId}")]
        public async Task<IActionResult> GetTodayPodcast(Guid userId)
        {
            var todayUtc = DateTime.UtcNow.Date;
            
            // Kullanıcının bugünkü podcast'ini bul
            var podcast = await _dbContext.Podcasts
                .Where(p => p.UserId == userId && p.CreatedAt >= todayUtc)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            if (podcast == null)
            {
                return NotFound(new { Message = "Bugün için henüz bir podcast üretilmemiş." });
            }

            if (string.IsNullOrEmpty(podcast.AudioFilePath) || !System.IO.File.Exists(podcast.AudioFilePath))
            {
                // Sesi üretilmemiş ama özeti var
                return Ok(new 
                { 
                    Message = "Podcast ses dosyası bulunamadı, ancak yazılı özet hazır.", 
                    Summary = podcast.Summary 
                });
            }

            // Ses dosyasını cihazdan (sunucudan) okuyup stream olarak dön
            var fileStream = new FileStream(podcast.AudioFilePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "audio/mpeg", Path.GetFileName(podcast.AudioFilePath));
        }
    }
}
