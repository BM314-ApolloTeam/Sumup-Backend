using Microsoft.Extensions.Options;
using Sumup.Core.Configurations;
using Sumup.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace Sumup.Infrastructure.Services
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly GoogleApiSettings _settings;

        public GoogleAuthService(HttpClient httpClient, IOptions<GoogleApiSettings> options)
        {
            _httpClient = httpClient;
            _settings = options.Value;
        }

        public async Task<string?> RefreshAccessTokenAsync(string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken)) return null;

            var request = new HttpRequestMessage(HttpMethod.Post, "https://oauth2.googleapis.com/token");
            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                {"client_id", _settings.ClientId},
                {"client_secret", _settings.ClientSecret},
                {"refresh_token", refreshToken},
                {"grant_type", "refresh_token"}
            });

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Google Auth Error: {content}");
                return null;
            }

            using var json = JsonDocument.Parse(content);
            if (json.RootElement.TryGetProperty("access_token", out var accessTokenProp))
            {
                return accessTokenProp.GetString();
            }

            Console.WriteLine($"Google Auth Error (No access token): {content}");
            return null;
        }
    }
}
