using System.Threading.Tasks;

namespace Sumup.Core.Interfaces
{
    public interface IElevenLabsService
    {
        Task<byte[]> GenerateSpeechAsync(string text, string voiceId);
    }
}
