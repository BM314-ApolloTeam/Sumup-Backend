
using Microsoft.EntityFrameworkCore;
using Sumup.Core.Configurations;
using Sumup.Core.Interfaces;
using Sumup.Infrastructure.Data;
using Sumup.Infrastructure.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System;
using Sumup.Infrastructure.Services;

namespace Sumup.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            // PostgreSQL ve EF Core Kaydı
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddHttpClient<IGoogleCalendarService, GoogleCalendarService>();
            builder.Services.AddHttpClient<IGoogleTaskService, GoogleTasksService>();
            builder.Services.AddHttpClient<IWeatherService, OpenWeatherMapService>();

            // Google API Ayarlarını Bind Etme
            builder.Services.Configure<GoogleApiSettings>(builder.Configuration.GetSection("GoogleApi"));
            builder.Services.Configure<GeminiApiSettings>(builder.Configuration.GetSection("GeminiApi"));
            builder.Services.Configure<ElevenLabsApiSettings>(builder.Configuration.GetSection("ElevenLabsApi"));

            builder.Services.AddHttpClient<IGeminiService, GeminiService>();
            builder.Services.AddHttpClient<IElevenLabsService, ElevenLabsService>();
            builder.Services.Configure<WeatherApiSettings>(builder.Configuration.GetSection("WeatherApi"));

            builder.Services.AddControllers();

            // 1. JWT Güvenlik Görevlisini Tanımlıyoruz
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("BURAYA_COK_GIZLI_VE_UZUN_BIR_SIFRE_YAZMALISIN_EN_AZ_32_KARAKTER")),
                        ValidateIssuer = false, // Şimdilik false (İleride domain adın olacak)
                        ValidateAudience = false, // Şimdilik false
                        ClockSkew = TimeSpan.Zero
                    };
                });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();

            // 2. Swagger'a JWT Kilit İkonunu ve Yeteneğini Ekliyoruz
            builder.Services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Lütfen JWT Token'ınızı aşağıya yapıştırın (Başına 'Bearer ' yazmanıza gerek yok)."
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // 2. Güvenlik Görevlilerini Kapıya Dikiyoruz (Sıralama ÇOK ÖNEMLİ!)
            app.UseAuthentication(); // "Sen kimsin?" diye sorar
            app.UseAuthorization();  // "Buraya girmeye yetkin var mı?" diye sorar

            app.MapControllers();

            app.Run();
        }
    }
}
