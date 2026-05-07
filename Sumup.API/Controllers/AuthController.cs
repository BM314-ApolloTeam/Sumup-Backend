using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Sumup.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // React'ten gelecek veri modeli
        public class GoogleLoginRequest
        {
            public string IdToken { get; set; }
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                // 1. Google'dan gelen ID Token'ın sahte olup olmadığını doğrula
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken);

                // Payload içinden kullanıcının email, isim, profil fotoğrafı gibi bilgilerini alabiliriz.
                // Örneğin: payload.Email, payload.Name

                // 2. Kendi Sumup JWT biletimizi üretiyoruz
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes("BURAYA_COK_GIZLI_VE_UZUN_BIR_SIFRE_YAZMALISIN_EN_AZ_32_KARAKTER"); // Program.cs'deki ile aynı olmalı

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.Email, payload.Email),
                        new Claim(ClaimTypes.NameIdentifier, payload.Subject), // Google User ID
                        new Claim(ClaimTypes.Name, payload.Name)
                    }),
                    Expires = DateTime.UtcNow.AddDays(7), // Bilet 7 gün geçerli
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var jwtString = tokenHandler.WriteToken(token);

                // 3. React'e bizim biletimizi ver
                return Ok(new { Token = jwtString, Email = payload.Email, Name = payload.Name });
            }
            catch (InvalidJwtException)
            {
                return Unauthorized("Geçersiz Google Token!");
            }
        }
    }
}
