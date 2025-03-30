using TaskManagement.Domain.Entities.API.Request.User;
using TaskManagement.Domain.Entities.Entities;

namespace TaskManagement.Application.Service.User
{
    public interface IUserService
    {
        Task<string> RegisterUserAsync(RegisterUserRequest userDto);
        Task<(string Token, UserDTO User)> AuthenticateUserAsync(LoginRequest userDto);

        Task<string> UpdateUserProfileAsync(UpdateUserRequest updateUserRequest);
        Task<string> UpdateUserPasswordAsync(UpdatePasswordRequest updatePasswordRequest);

    }
}
