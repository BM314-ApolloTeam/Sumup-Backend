using System;


namespace Sumup.Core.Entities
{
    public class User
    {
        public Guid Id { get; set; } // .NET dünyasında int yerine benzersiz Guid kullanmak best-practice'dir
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty; // Güvenlik için "Password" değil "PasswordHash"
        public TimeSpan WakeUpTime { get; set; } // Kullanıcının uyanma/podcast saati

        // Relational Properties (Kullanıcının birden fazla podcast'i olabilir)
        public ICollection<Podcast> Podcasts { get; set; } = new List<Podcast>();
    }
}
