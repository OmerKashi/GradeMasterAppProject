namespace GradeMasterAPI.ApiModules {
    public class CourseDTO { //Course POST (DTO req and res. not to the DB)
        public int Id { get; set; }
        public string CourseName { get; set; }
        public string CourseDescription { get; set; }
        public int TeacherId { get; set; }
    }
}
