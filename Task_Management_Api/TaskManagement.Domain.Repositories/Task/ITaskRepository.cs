using TaskManagement.Domain.Entities.API.Response;
using TaskManagement.Domain.Entities.Entities;
using System.Threading.Tasks;
namespace TaskManagement.Domain.Repositories.Task
{
    public interface ITaskRepository
    {

        Task<List<TaskDTO>> GetAllTasks(int userId);
        Task<TaskDTO> GetTaskById(int taskId);
        Task<TaskDTO> CreateTask(TaskDTO task);
        Task<TaskDTO> UpdateTask(TaskDTO task);
        Task<bool> DeleteTask(int taskId);

    }
}
