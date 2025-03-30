namespace TaskManagement.Shared
{
    public class User
    {
        public string Id { get; set; }  // Identity User ID
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public List<Task> Tasks { get; set; } = new List<Task>();

    }
}
