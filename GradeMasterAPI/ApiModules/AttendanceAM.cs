namespace GradeMasterAPI.ApiModules {
    public class AttendanceDto {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public DateTime Start { get; set; }
        public string RoomNum { get; set; }
        public int DurationMinutes { get; set; }
        public string Notes { get; set; }
        public int StudentId { get; set; }
        public string Status { get; set; }
    }
}
