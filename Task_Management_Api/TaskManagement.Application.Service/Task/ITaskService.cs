using TaskManagement.Domain.Entities.API.Request.Task;
using TaskManagement.Domain.Entities.API.Response;
using TaskManagement.Domain.Entities.Entities;

namespace TaskManagement.Application.Service.Task
{
    public interface ITaskService
    {
        Task<List<TaskDTO>> GetAllTasks(int userId);
        Task<TaskDTO> GetTaskById(int taskId);
        Task<TaskDTO> CreateTask(TaskDTO task);
        Task<TaskDTO> UpdateTask(TaskDTO task);
        Task<bool> DeleteTask(int taskId);

    }
}
