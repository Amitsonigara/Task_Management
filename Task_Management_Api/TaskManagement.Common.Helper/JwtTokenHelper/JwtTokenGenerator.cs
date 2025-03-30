using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TaskManagement.Domain.Entities.Entities;

namespace TaskManagement.Common.Helper.JwtTokenHelper
{
    public static class JwtTokenGenerator
    {
        public static string GenerateToken(UserDTO user)
        {
            var expirationTime = DateTime.UtcNow.AddHours(1);

            var claims = new[]
            {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim("kid", "pBzRCIYC0DtoN0Ir4gKCqc6xtv$$GqTAX6ZTLnQ^8CYlcPLXNYAUvE")  // Add the kid claim
    };

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("pBzRCIYC0DtoN0Ir4gKCqc6xtv$$GqTAX6ZTLnQ^8CYlcPLXNYAUvE"));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: "https://localhost:7131",
                audience: "https://localhost:44307",
                claims: claims,
                expires: expirationTime,
                signingCredentials: signingCredentials
            );

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(tokenDescriptor);
        }



    }

}
