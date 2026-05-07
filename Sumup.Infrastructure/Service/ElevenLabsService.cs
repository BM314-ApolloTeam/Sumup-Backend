using Microsoft.Extensions.Options;
using Sumup.Core.Configurations;
using Sumup.Core.Interfaces;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Sumup.Infrastructure.Service
{
    public class ElevenLabsService : IElevenLabsService
    {
        private readonly HttpClient _httpClient;
        private readonly ElevenLabsApiSettings _settings;

        public ElevenLabsService(HttpClient httpClient, IOptions<ElevenLabsApiSettings> options)
        {
            _httpClient = httpClient;
            _settings = options.Value;
        }

        public async Task<byte[]> GenerateSpeechAsync(string text, string voiceId)
        {
            if (string.IsNullOrEmpty(_settings.ApiKey))
            {
                throw new Exception("ElevenLabs API Key is not configured.");
            }

            if (string.IsNullOrEmpty(voiceId))
            {
                throw new ArgumentException("VoiceId is required.", nameof(voiceId));
            }

            var endpoint = $"https://api.elevenlabs.io/v1/text-to-speech/{voiceId}";

            var requestBody = new
            {
                text = text,
                model_id = "eleven_multilingual_v2",
                voice_settings = new
                {
                    stability = 0.5,
                    similarity_boost = 0.75
                }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
            request.Headers.Add("xi-api-key", _settings.ApiKey);
            request.Content = jsonContent;

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Error generating speech from ElevenLabs: {response.StatusCode} - {errorContent}");
            }

            // Read the audio file as a byte array
            return await response.Content.ReadAsByteArrayAsync();
        }
    }
}
