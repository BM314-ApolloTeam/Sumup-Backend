
using Microsoft.EntityFrameworkCore;
using Sumup.Core.Configurations;
using Sumup.Core.Interfaces;
using Sumup.Infrastructure.Data;
using Sumup.Infrastructure.Service;
using Sumup.Infrastructure.Services;
using System;

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

            // Google API Ayarlarını Bind Etme
            builder.Services.Configure<GoogleApiSettings>(builder.Configuration.GetSection("GoogleApi"));

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
