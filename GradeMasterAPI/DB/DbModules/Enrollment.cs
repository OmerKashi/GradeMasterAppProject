namespace GradeMasterAPI.DB.DbModules {
    public class Enrollment {

        public int Id { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public int FinalGrade { get; set; }


        #region --Navigation Properties--
        public Student Student { get; set; }
        public Course Course { get; set; }

        #endregion


    }
}
