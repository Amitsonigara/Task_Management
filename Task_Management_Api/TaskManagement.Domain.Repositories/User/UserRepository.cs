using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Common.Helper.JwtTokenHelper;
using TaskManagement.Domain.Entities.API.Request.User;
using TaskManagement.Domain.Entities.Entities;
using TaskManagement.Shared.DBContext;

namespace TaskManagement.Domain.Repositories.User
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Register a new user
        public async Task<bool> RegisterUserAsync(UserDTO user)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser != null)
            {
                return false; // Email already in use
            }

            var applicationUser = new UserDTO
            {
                Username = user.Username,
                Email = user.Email,
                PasswordHash = user.PasswordHash,
                Id=user.Id
            };

            await _context.Users.AddAsync(applicationUser);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<(string Token, UserDTO User)> AuthenticateUserAsync(LoginRequest userDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == userDto.Username || u.Username == userDto.Username);

            if (user == null)
            {
                return (null, null);
            }
            var token = JwtTokenGenerator.GenerateToken(user);

            var userDTO = new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                PasswordHash=user.PasswordHash
            };

            return (token, userDTO);
        }
        public async Task<UserDTO> GetUserByIdAsync(int userId)
        {
            return await _context!.Users!
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<bool> UpdateUserAsync(UserDTO user)
        {
            _context.Users.Update(user);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}
