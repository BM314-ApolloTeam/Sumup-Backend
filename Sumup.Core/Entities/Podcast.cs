using System;


namespace Sumup.Core.Entities
{
    public class Podcast
    {
        public Guid Id { get; set; }
        public string Summary { get; set; } = string.Empty; // Gemini'dan dönecek metin
        public string AudioFilePath { get; set; } = string.Empty; // S3 veya lokaldeki .mp3 dosyasının yolu
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Ne zaman üretildi?

        // Foreign Key (Hangi kullanıcıya ait?)
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
