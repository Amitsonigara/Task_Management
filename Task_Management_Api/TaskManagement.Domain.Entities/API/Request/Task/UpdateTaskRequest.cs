using TaskManagement.Domain.Entities.Entities;

namespace TaskManagement.Domain.Entities.API.Request.Task
{
    public class UpdateTaskRequest
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public bool Completed { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public TaskDTO User { get; set; }
    }
}
