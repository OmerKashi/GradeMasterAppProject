namespace GradeMasterAPI.DB.DbModules {
    public class Attendence { //like classroom

        public int Id { get; set; }
        public string RoomNum { get; set; }
        public DateTime Start { get; set; }
        public int DurationMinutes { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }


        #region --Navigation Properties--
        public Student StudentRef { get; set; }
        public Course CourseRef { get; set; }

        #endregion

    }
}
