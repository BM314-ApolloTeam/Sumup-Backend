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
            var root = jsonDoc.RootElement;

            // Temel Bilgiler
            var temp = Math.Round(root.GetProperty("main").GetProperty("temp").GetDouble());
            var feelsLike = Math.Round(root.GetProperty("main").GetProperty("feels_like").GetDouble());
            var humidity = root.GetProperty("main").GetProperty("humidity").GetInt32();
            var description = root.GetProperty("weather")[0].GetProperty("description").GetString();

            // Rüzgar Hızı (OpenWeatherMap saniyede metre 'm/s' döner, km/s'ye çevirmek için 3.6 ile çarpıyoruz)
            var windSpeedMs = root.GetProperty("wind").GetProperty("speed").GetDouble();
            var windSpeedKmH = Math.Round(windSpeedMs * 3.6);

            // AI'ın bayılacağı o zengin prompt metni!
            return $"{city} için hava durumu: {temp}°C (Hissedilen: {feelsLike}°C), {description}. Nem: %{humidity}, Rüzgar: {windSpeedKmH} km/s.";
        }
    }
}