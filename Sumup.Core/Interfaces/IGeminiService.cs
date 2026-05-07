using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sumup.Core.Interfaces
{
    public interface IGeminiService
    {
        Task<string> GenerateSummaryAsync(List<string> calendarEvents, List<string> tasks, string userPreferences, string weatherInfo);
    }
}
