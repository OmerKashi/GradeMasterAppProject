namespace GradeMasterAPI.DB.DbModules {

    public class Student {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public string Password { get; set; }


        #region --Navigation Properties--
        //Collection one to many (one student to many)
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<ExamSubmission> ExamSubmissions { get; set; } = new List<ExamSubmission>();
        public ICollection<AssignmentSubmission> AssignmentSubs { get; set; } = new List<AssignmentSubmission>();
        public ICollection<Attendence> Attendences { get; set; } = new List<Attendence>();
        public ICollection<Grades> FinalGrades { get; set; } = new List<Grades>();

        #endregion

    }
}

