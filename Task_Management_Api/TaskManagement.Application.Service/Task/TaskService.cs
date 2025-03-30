using TaskManagement.Domain.Entities.API.Request.Task;
using TaskManagement.Domain.Entities.API.Response;
using TaskManagement.Domain.Entities.Entities;
using TaskManagement.Domain.Repositories.Task;
namespace TaskManagement.Application.Service.Task
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;

        public TaskService(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        public async Task<List<TaskDTO>> GetAllTasks(int userId)
        {
            return await _taskRepository.GetAllTasks(userId);
        }

        public async Task<TaskDTO> GetTaskById(int taskId)
        {
            return await _taskRepository.GetTaskById(taskId);
        }

        public async Task<TaskDTO> CreateTask(TaskDTO task)
        {
            return await _taskRepository.CreateTask(task);
        }

        public async Task<TaskDTO> UpdateTask(TaskDTO task)
        {
            return await _taskRepository.UpdateTask(task);
        }

        public async Task<bool> DeleteTask(int taskId)
        {
            return await _taskRepository.DeleteTask(taskId);
        }
    }
}
