﻿namespace GradeMasterAPI.ApiModules {
    public class StudentDTO { //Student POST (DTO req and res. not to the DB)

        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public string Password { get; set; }
    }
}
