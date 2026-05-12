using System.Threading.Tasks;

namespace Sumup.Core.Interfaces
{
    public interface IGoogleAuthService
    {
        Task<string?> RefreshAccessTokenAsync(string refreshToken);
    }
}
