using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Sumup.Core.Interfaces;
using Sumup.Core.Configurations;

namespace Sumup.Infrastructure.Service
{
    public class OpenWeatherMapService : IWeatherService

    {
        private readonly HttpClient _httpClient;
        private readonly WeatherApiSettings _settings;

        // IOptions üzerinden ayarları da Dependency Injection ile içeri alıyoruz
        public OpenWeatherMapService(HttpClient httpClient, IOptions<WeatherApiSettings> options)
        {
            _httpClient = httpClient;
            _settings = options.Value;
        }

        public async Task<string> GetDailyWeatherAsync(string city)
        {
            if (string.IsNullOrEmpty(_settings.ApiKey))
                return "Hava durumu servisi için API anahtarı eksik.";

            // units=metric (Derece cinsinden) ve lang=tr (Türkçe açıklama) parametrelerini ekliyoruz
            var requestUrl = $"{_settings.BaseUrl}?q={city}&appid={_settings.ApiKey}&units=metric&lang=tr";

            var response = await _httpClient.GetAsync(requestUrl);

            if (!response.IsSuccessStatusCode)
                return $"{city} için hava durumu bilgisine ulaşılamadı.";

            var content = await response.Content.ReadAsStringAsync();
            using var jsonDoc = JsonDocument.Parse(content);

            // JSON içinden sıcaklık ve durumu çekiyoruz
            var temp = Math.Round(jsonDoc.RootElement.GetProperty("main").GetProperty("temp").GetDouble());
            var description = jsonDoc.RootElement.GetProperty("weather")[0].GetProperty("description").GetString();

            return $"{city} için hava durumu: {temp}°C, {description}.";
        }
    }
}
