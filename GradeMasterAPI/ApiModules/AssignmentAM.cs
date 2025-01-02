namespace GradeMasterAPI.ApiModules {
    public class AssignmentDTO {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }

        public int PercentageOfTotalGrade { get; set; }
    }
}
