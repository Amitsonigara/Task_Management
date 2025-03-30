using Microsoft.EntityFrameworkCore;
using TaskManagement.Domain.Entities.Entities;
using TaskManagement.Shared.DBContext;

namespace TaskManagement.Domain.Repositories.Task
{
    public class TaskRepository : ITaskRepository
    {
        private readonly ApplicationDbContext _context;

        public TaskRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TaskDTO>> GetAllTasks(int userId)
        {
            return await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
        }

        public async Task<TaskDTO> GetTaskById(int taskId)
        {
            return await _context.Tasks.FirstOrDefaultAsync(t => t.Id == taskId);
        }

        public async Task<TaskDTO> CreateTask(TaskDTO task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<TaskDTO> UpdateTask(TaskDTO task)
        {
            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<bool> DeleteTask(int taskId)
        {
            var task = await GetTaskById(taskId);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
