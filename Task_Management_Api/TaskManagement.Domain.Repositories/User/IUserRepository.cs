using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Entities.API.Request.User;
using TaskManagement.Domain.Entities.Entities;

namespace TaskManagement.Domain.Repositories.User
{
    public interface IUserRepository
    {
        Task<bool> RegisterUserAsync(UserDTO user);
        Task<(string Token, UserDTO User)> AuthenticateUserAsync(LoginRequest userDto);
        Task<UserDTO> GetUserByIdAsync(int userId);
        Task<bool> UpdateUserAsync(UserDTO user);


    }
}
