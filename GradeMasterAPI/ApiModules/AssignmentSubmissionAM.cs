namespace GradeMasterAPI.ApiModules {
    public class AssignmentSubmissionDTO {
        public int Id { get; set; }
        public string FilePath { get; set; }
        public int AssignmentId { get; set; }
        public int StudentId { get; set; }
        public DateTime SubmissionDate { get; set; }
        public string Feedback { get; set; }
        public int Grade { get; set; }

    }
}
