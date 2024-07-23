namespace GradeMasterAPI.DB.DbModules {
    public class Teacher {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }


        #region --Navigation Properties--
        public List<Course> Courses { get; set; } = new List<Course>();

        #endregion

    }
}
