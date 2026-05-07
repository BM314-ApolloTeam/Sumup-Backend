using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sumup.Core.Interfaces
{
    public interface IWeatherService
    {
        // Örnek çıktı: "Ankara için hava durumu: 15°C, parçalı bulutlu"
        Task<string> GetDailyWeatherAsync(string city);
    }
}
