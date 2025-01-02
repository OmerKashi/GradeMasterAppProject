namespace GradeMasterAPI.DB.DbModules {
    public class Assignment {

        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime DueDate { get; set; }

        public int PercentageOfTotalGrade { get; set; } 


        #region --Navigation Properties--
        public Course CourseRef { get; set; }
        public ICollection<AssignmentSubmission> AssignmentSubs { get; set; }

        #endregion


    }
}
