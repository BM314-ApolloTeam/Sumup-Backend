using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Sumup.Core.Configurations;

namespace Sumup.API.Controllers
{
    [ApiController]
    [Route("api/google-auth")]
    public class GoogleAuthController : ControllerBase
    {
        private readonly GoogleApiSettings _settings;
        private readonly HttpClient _httpClient;

        private const string BackendCallbackUri =
            "https://helpful-radiation-creation.ngrok-free.dev/api/google-auth/callback";

        public GoogleAuthController(IOptions<GoogleApiSettings> options)
        {
            _settings = options.Value;
            _httpClient = new HttpClient();
        }

        [HttpGet("login")]
        public IActionResult Login([FromQuery] string appRedirectUri)
        {
            if (string.IsNullOrWhiteSpace(appRedirectUri))
            {
                return BadRequest("appRedirectUri is required.");
            }

            var encodedState = Uri.EscapeDataString(appRedirectUri);
            var encodedRedirectUri = Uri.EscapeDataString(BackendCallbackUri);

            var encodedScope = Uri.EscapeDataString(
                "openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/tasks.readonly"
            );

            var googleAuthUrl =
                "https://accounts.google.com/o/oauth2/v2/auth" +
                $"?client_id={_settings.ClientId}" +
                $"&redirect_uri={encodedRedirectUri}" +
                "&response_type=code" +
                $"&scope={encodedScope}" +
                "&access_type=offline" +
                "&prompt=consent" +
                $"&state={encodedState}";

            return Redirect(googleAuthUrl);
        }

        [HttpGet("callback")]
        public async Task<IActionResult> Callback(
            [FromQuery] string code,
            [FromQuery] string state
        )
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                return BadRequest("Authorization code is missing.");
            }

            if (string.IsNullOrWhiteSpace(state))
            {
                return BadRequest("Mobile redirect URI is missing.");
            }

            var values = new Dictionary<string, string>
            {
                { "code", code },
                { "client_id", _settings.ClientId },
                { "client_secret", _settings.ClientSecret },
                { "redirect_uri", BackendCallbackUri },
                { "grant_type", "authorization_code" }
            };

            var content = new FormUrlEncodedContent(values);

            var response = await _httpClient.PostAsync(
                "https://oauth2.googleapis.com/token",
                content
            );

            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return BadRequest(responseBody);
            }

            var tokenData = JsonSerializer.Deserialize<GoogleTokenResponse>(
                responseBody,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }
            );

            if (tokenData?.AccessToken == null)
            {
                return BadRequest("Google access token could not be received.");
            }

            var userInfoRequest = new HttpRequestMessage(
                HttpMethod.Get,
                "https://www.googleapis.com/oauth2/v2/userinfo"
            );

            userInfoRequest.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", tokenData.AccessToken);

            var userInfoResponse = await _httpClient.SendAsync(userInfoRequest);
            var userInfoBody = await userInfoResponse.Content.ReadAsStringAsync();

            if (!userInfoResponse.IsSuccessStatusCode)
            {
                return BadRequest(userInfoBody);
            }

            var googleUser = JsonSerializer.Deserialize<GoogleUserResponse>(
                userInfoBody,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }
            );

            var appRedirectUri = Uri.UnescapeDataString(state);

            var redirectUrl =
                $"{appRedirectUri}" +
                $"?email={Uri.EscapeDataString(googleUser?.Email ?? "")}" +
                $"&name={Uri.EscapeDataString(googleUser?.Name ?? "Google User")}" +
                $"&access_token={Uri.EscapeDataString(tokenData.AccessToken)}";

            return Redirect(redirectUrl);
        }
    }

    public class GoogleTokenResponse
    {
        [JsonPropertyName("access_token")]
        public string? AccessToken { get; set; }

        [JsonPropertyName("refresh_token")]
        public string? RefreshToken { get; set; }

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }

        [JsonPropertyName("token_type")]
        public string? TokenType { get; set; }

        [JsonPropertyName("scope")]
        public string? Scope { get; set; }
    }

    public class GoogleUserResponse
    {
        [JsonPropertyName("email")]
        public string? Email { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }
    }
}