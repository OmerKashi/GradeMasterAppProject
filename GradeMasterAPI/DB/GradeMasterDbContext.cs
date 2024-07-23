using GradeMasterAPI.DB.DbModules;
using Microsoft.EntityFrameworkCore;

namespace GradeMasterAPI.DB {
    public class GradeMasterDbContext : DbContext{
        //Holding all the references to the collections

        public GradeMasterDbContext(){ }

        //Forwarding to whoever is in the DbContext (also has constructor)
        public GradeMasterDbContext(DbContextOptions<GradeMasterDbContext> options) : base(options){ }
        

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            //base.OnConfiguring(optionsBuilder);
            //optionsBuilder.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=GradeMasterEFDb1;Trusted_Connection=True;");
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);
            
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; } = default!;




    }
}
