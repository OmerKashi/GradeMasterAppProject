namespace GradeMasterAPI.ApiModules {
    public class ExamSubmissionDTO {

        public int Id { get; set; }
        public string ExamFilePath { get; set; }
        public int ExamId { get; set; }
        public int StudentId { get; set; }
        public DateTime SubmissionDate { get; set; }
        public int Grade { get; set; }

    }
}
