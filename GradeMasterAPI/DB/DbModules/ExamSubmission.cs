namespace GradeMasterAPI.DB.DbModules {
    public class ExamSubmission {

        public int Id { get; set; }
        public string ExamFilePath { get; set; }
        public int ExamId { get; set; }
        public int StudentId { get; set; }
        public DateTime SubmissionDate { get; set; }
        public int Grade { get; set; }
        


        #region --Navigation Properties--
        public Exam ExamRef { get; set; } = new Exam();
        public Student StudentRef { get; set; } = new Student();

        #endregion

    }
}
