using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sumup.Core.Interfaces
{
    public interface IGoogleCalendarService
    {
        // Belirli bir tarihteki etkinlikleri çeker
        Task<List<string>> GetDailyEventsAsync(string accessToken, DateTime targetDate);
    }
}
