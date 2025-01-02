namespace GradeMasterAPI.DB.DbModules {
    public class Grades { //Exam, Attendence, assignment

        public int Id { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public int FinalGrade { get; set; }
        public float SubbmissionsGrades { get; set; }
        public float Attendence { get; set; }
        public int ExamGrade {  get; set; }

        // New property to represent percentages of each grade component
        public List<int> GradeComponentPercentages { get; set; } = new List<int> { 10, 30, 60 }; //Attendance, Exams, Assignments



        #region --Navigation Properties--
        public Student StudentRef { get; set; }
        public Course CourseRef { get; set; }

        #endregion

    }
}
