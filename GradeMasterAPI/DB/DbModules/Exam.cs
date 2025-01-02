namespace GradeMasterAPI.DB.DbModules {
    public class Exam {

        public int Id { get; set; }
        public string ExamName { get; set; }
        public DateTime ExamDate { get; set; }
        public int CourseId { get; set; }
        public string RoomNum { get; set; }
        //public string Description { get; set; }
        //public int TotalPoints { get; set; }


        #region --Navigation Properties--
        public Course CourseRef { get; set; }
        public ICollection<ExamSubmission> ExamSubmissions { get; set; } = new List<ExamSubmission>();

        #endregion


    }
}
