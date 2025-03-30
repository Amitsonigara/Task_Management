namespace TaskManagement.Domain.Entities.Entities
{
    public class TaskDTO
    {
        public int? Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public bool? Completed { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? UserId { get; set; }
    }
}
