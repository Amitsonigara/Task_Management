using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TaskManagement.Application.Service.Task;
using TaskManagement.Application.Service.User;
using TaskManagement.Domain.Repositories.Task;
using TaskManagement.Domain.Repositories.User;
using TaskManagement.Freamwork.Middlware;
using TaskManagement.Shared.DBContext;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Entity Framework for database connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 10, // Number of retry attempts
            maxRetryDelay: TimeSpan.FromSeconds(120), // Maximum delay between retries
            errorNumbersToAdd: null // Retry on all SQL Server errors by default
        )
    )
);

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid JWT token",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

// Add CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin()  // Allow all origins
               .AllowAnyMethod()  // Allow all HTTP methods (GET, POST, etc.)
               .AllowAnyHeader();  // Allow all headers
    });
});





// Add service and repository dependencies
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// JWT Authentication configuration
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("pBzRCIYC0DtoN0Ir4gKCqc6xtv$$GqTAX6ZTLnQ^8CYlcPLXNYAUvE")),
            ValidIssuer = "https://localhost:7131",  // Adjust your issuer
            ValidAudience = "https://localhost:44307",  // Adjust your audience
            ClockSkew = TimeSpan.Zero  // Optional, to remove any skew for token expiration
        };
    });

var app = builder.Build();

// Middleware order matters, so ensure JwtMiddleware comes before authentication/authorization
app.UseMiddleware<JwtMiddleware>();  // Ensure custom middleware comes before default authentication
 // Use default CORS policy
app.UseHttpsRedirection();

app.UseCors("AllowAllOrigins");
// Use authentication and authorization middleware in the correct order
app.UseAuthentication();  // Authentication comes before authorization
app.UseAuthorization();  // Authorization comes after authentication

// Use other middlewares
app.UseMiddleware<ErrorHandlingMiddleware>();

// Use Swagger UI only in Development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Management API v1");
        c.RoutePrefix = "swagger";  // Set the route to be "swagger" to access the UI
    });
}

app.MapControllers();
app.Run();
