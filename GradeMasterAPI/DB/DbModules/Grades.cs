namespace GradeMasterAPI.DB.DbModules {
    public class Grades { //Exam, Attendence, assignment

        public int Id { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public int FinalGrade {  get; set; }
        public float SubbmissionsGrades {  get; set; }
        public float Attendence {  get; set; }



        #region --Navigation Properties--
        public Student StudentRef { get; set; }
        public Course CourseRef { get; set; }

        #endregion

    }
}
