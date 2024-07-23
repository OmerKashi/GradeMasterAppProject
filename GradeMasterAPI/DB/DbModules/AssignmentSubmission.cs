namespace GradeMasterAPI.DB.DbModules {
    public class AssignmentSubmission {

        public int Id { get; set; }
        public string FilePath { get; set; }
        public int AssignmentId { get; set; }
        public int StudentId { get; set; }
        public DateTime SubmissionDate { get; set; }
        public string Feedback { get; set; }
        public int Grade { get; set; }
        


        #region --Navigation Properties--
        public Assignment AssignmentRef{ get; set; } = new Assignment();
        public Student StudentRef { get; set; } = new Student();

        #endregion


    }
}
