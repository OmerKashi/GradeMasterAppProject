namespace GradeMasterAPI.ApiModules {
    //Data transfer object (server <-> client)
    public class TeacherDTO { //Teacher POST (DTO req and res. not to the DB)

        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }





    }
}
