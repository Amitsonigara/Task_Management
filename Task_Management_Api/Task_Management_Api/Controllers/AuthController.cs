using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Service.User;
using TaskManagement.Domain.Entities.API.Request.User;
namespace TaskManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("UserRegistration")]
        public async Task<IActionResult> UserRegistration([FromBody] RegisterUserRequest userDto)
        {
            var result = await _userService.RegisterUserAsync(userDto);
            return Ok(result);
        }

        [HttpPost("UserLogin")]
        public async Task<IActionResult> UserLogin([FromBody] LoginRequest userDto)
        {
            var result = await _userService.AuthenticateUserAsync(userDto);
            if (result.Token == null)
            {
                return Ok(new { message = "Invalid credentials" });
            }
            if (result.User == null)
            {
                return Ok(new { message = "User not found" });
            }
            ;
            return Ok(new
            {
                Token = result.Token,
                User = result.User
            });
        }
        [Authorize]
        [HttpPut("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserRequest updateUserRequest)
        {
            if (updateUserRequest != null)
            {
                var result = await _userService.UpdateUserProfileAsync(updateUserRequest);
                return Ok(result);
            }
            return Ok("Invalid request.");
        }
        [Authorize]
        [HttpPut("UpdatePassword")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordRequest updatePasswordRequest)
        {
            if (updatePasswordRequest != null)
            {
                var result = await _userService.UpdateUserPasswordAsync(updatePasswordRequest);
                return Ok(result);
            }
            return Ok("Invalid request.");
        }
    }

}