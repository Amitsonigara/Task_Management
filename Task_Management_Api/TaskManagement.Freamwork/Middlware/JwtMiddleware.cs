using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace TaskManagement.Freamwork.Middlware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _secretKey;
        private readonly string _validateIssuer;
        private readonly string _validateAudience;

        // Constructor to inject configuration values
        public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _secretKey = configuration["JwtSettings:Key"];  // Load from configuration
            _validateIssuer = configuration["JwtSettings:Issuer"];  // Load from configuration
            _validateAudience = configuration["JwtSettings:Audience"];  // Load from configuration
        }

        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
                AttachUserToContext(context, token);

            await _next(context);
        }

        private void AttachUserToContext(HttpContext context, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_secretKey);

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),  // Use symmetric key for validation
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _validateIssuer,
                    ValidAudience = _validateAudience,
                    // Remove the `kid` validation and `RequireSignedTokens` settings
                    RequireSignedTokens = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

                var userIdClaim = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

                if (userIdClaim != null)
                {
                    context.Items["UserId"] = userIdClaim.Value;
                }
                else
                {
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "application/json";
                    context.Response.WriteAsync("{\"message\": \"User ID not found in token.\"}");
                }
            }
            catch (SecurityTokenSignatureKeyNotFoundException ex)
            {
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                context.Response.WriteAsync($"{{\"message\": \"Signature validation failed: {ex.Message}\"}}");
            }
            catch (SecurityTokenExpiredException)
            {
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                context.Response.WriteAsync("{\"message\": \"Token has expired.\"}");
            }
            catch (SecurityTokenException ex)
            {
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                context.Response.WriteAsync($"{{\"message\": \"Invalid token: {ex.Message}\"}}");
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                context.Response.WriteAsync($"{{\"message\": \"Error validating token: {ex.Message}\"}}");
            }
        }
    }
}
