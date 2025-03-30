using Microsoft.EntityFrameworkCore;
using TaskManagement.Domain.Entities.Entities;

namespace TaskManagement.Shared.DBContext
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<UserDTO> Users { get; set; }
        public DbSet<TaskDTO> Tasks { get; set; }
    }

}
