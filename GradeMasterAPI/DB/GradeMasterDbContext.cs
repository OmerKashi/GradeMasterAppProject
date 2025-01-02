using GradeMasterAPI.DB.DbModules;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace GradeMasterAPI.DB {
    public class GradeMasterDbContext : DbContext {
        //Holding all the references to the collections

        public GradeMasterDbContext() { }

        //Forwarding to whoever is in the DbContext (also has constructor)
        public GradeMasterDbContext(DbContextOptions<GradeMasterDbContext> options) : base(options) { }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Course> Courses { get; set; }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        //base.OnConfiguring(optionsBuilder);
        //optionsBuilder.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=GradeMasterEFDb1;Trusted_Connection=True;");
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder) {

            modelBuilder.Entity<Course>().HasOne(c => c.Teacher).WithMany(t => t.Courses).HasForeignKey(c => c.TeacherId);


            var gradeComponentPercentagesConverter = new ValueConverter<List<int>, string>(
        v => string.Join(",", v), // Convert List<int> to a comma-separated string
        v => v.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList()
    );

            var gradeComponentPercentagesComparer = new ValueComparer<List<int>>(
                (c1, c2) => c1.SequenceEqual(c2), // Compare the sequences
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())), // Calculate hash code
                c => c.ToList() // Deep copy the list
            );


            modelBuilder.Entity<Grades>()
                .Property(g => g.GradeComponentPercentages)
                .HasConversion(gradeComponentPercentagesConverter)
                .Metadata.SetValueComparer(gradeComponentPercentagesComparer);

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; } = default!;
        public DbSet<Attendance> Attendance { get; set; } = default!;
        public DbSet<Assignment> Assignment { get; set; } = default!;
        public DbSet<Exam> Exam { get; set; } = default!;
        public DbSet<Grades> Grades { get; set; } = default!;
        public DbSet<AssignmentSubmission> AssignmentSubmission { get; set; } = default!;
        public DbSet<ExamSubmission> ExamSubmission { get; set; } = default!;




    }
}
