namespace TaskManagement.Domain.Entities.API.Response
{
    public class GetTaskByIdAsyncResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public bool Completed { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
    }
}
