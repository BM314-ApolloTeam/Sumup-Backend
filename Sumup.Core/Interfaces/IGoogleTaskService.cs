using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sumup.Core.Interfaces
{
    public interface IGoogleTaskService
    {
        Task<List<string>> GetDailyTasksAsync(string accessToken);
    }
}
