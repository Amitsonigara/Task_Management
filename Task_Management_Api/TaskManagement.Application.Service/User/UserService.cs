using TaskManagement.Common.Helper.PasswordHelper;
using TaskManagement.Domain.Entities.API.Request.User;
using TaskManagement.Domain.Entities.Entities;
using TaskManagement.Domain.Repositories.User;

namespace TaskManagement.Application.Service.User
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<string> RegisterUserAsync(RegisterUserRequest userDto)
        {
            if (string.IsNullOrEmpty(userDto.Username) || string.IsNullOrEmpty(userDto.Password))
            {
                return "Username and password are required.";
            }
            CommonHelper commonHelper = new();
            string hashedPassword = commonHelper.HashPassword(userDto.Password);
            var user = new UserDTO { Username = userDto.Username, Email = userDto.Email, PasswordHash = hashedPassword };
            var result = await _userRepository.RegisterUserAsync(user);
            return result ? "User registered successfully" : "User registration failed.";
        }
        public async Task<(string Token, UserDTO User)> AuthenticateUserAsync(LoginRequest userDto)
        {
            var (token, user) = await _userRepository.AuthenticateUserAsync(userDto);

            if (user == null || token == null)
            {
                return (null, null);
            }

            CommonHelper commonHelper = new();
            bool isPasswordValid = commonHelper.VerifyPassword(userDto.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return (null, null);
            }

            return (token, user);
        }


            public async Task<string> UpdateUserProfileAsync(UpdateUserRequest updateUserRequest)
            {
                var user = await _userRepository.GetUserByIdAsync(updateUserRequest.UserId);

                if (user == null)
                {
                    return "User not found."; 
                }

                user.Username = updateUserRequest.Username;
                user.Email = updateUserRequest.Email;
                bool updateResult = await _userRepository.UpdateUserAsync(user);

                if (updateResult)
                {
                    return "User profile updated successfully."; 
                }
                else
                {
                    return "User profile update failed. Please try again."; 
                }
            }


            public async Task<string> UpdateUserPasswordAsync(UpdatePasswordRequest updatePasswordRequest)
            {
                var user = await _userRepository.GetUserByIdAsync(updatePasswordRequest.UserId);

                CommonHelper commonHelper = new();
                if (!commonHelper.VerifyPassword(updatePasswordRequest.CurrentPassword, user.PasswordHash))
                {
                    return "Current password is incorrect."; 
                }
                if (updatePasswordRequest.CurrentPassword == updatePasswordRequest.NewPassword)
                {
                    return "New password cannot be the same as the current password."; 
                }

                user.PasswordHash = commonHelper.HashPassword(updatePasswordRequest.NewPassword);

                bool updateResult = await _userRepository.UpdateUserAsync(user);

                if (updateResult)
                {
                    return "Password updated successfully."; 
                }
                else
                {
                    return "Password update failed. Please try again.";
                }
            }


    }

}
