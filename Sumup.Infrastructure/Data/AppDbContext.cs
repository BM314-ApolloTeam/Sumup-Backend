using Microsoft.EntityFrameworkCore;
using Sumup.Core.Entities; // Core katmanındaki sınıflarımızı tanıyabilmesi için
using System;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Sumup.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        // Constructor: API katmanından gönderilecek ayarları (connection string vb.) alır
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Veritabanında oluşacak tablolarımız
        public DbSet<User> Users { get; set; }
        public DbSet<Podcast> Podcasts { get; set; }

        // Tablo özellikleri ve ilişkiler (Fluent API) burada konfigüre edilebilir
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // İleride tablolarla ilgili özel kısıtlamalar (max uzunluk vb.) yazmak istersek burayı kullanacağız.
        }
    }
}
