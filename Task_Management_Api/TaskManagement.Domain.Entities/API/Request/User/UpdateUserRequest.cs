namespace TaskManagement.Domain.Entities.API.Request.User
{
    public class UpdateUserRequest
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    }
}
