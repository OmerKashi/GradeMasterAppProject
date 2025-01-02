namespace GradeMasterAPI.ApiModules {
    public class GradesDTO {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public int FinalGrade { get; set; }
        public float SubbmissionsGrades { get; set; }
        public float Attendence { get; set; }
        public int ExamGrade { get; set; }
        public List<int> GradeComponentPercentages { get; set; } = new List<int> { 10, 30, 60 }; //Attendance, Exams, Assignments

    }
}
