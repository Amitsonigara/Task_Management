﻿namespace TaskManagement.Domain.Entities.API.Request.User
{
    public class UpdatePasswordRequest
    {
        public int UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
