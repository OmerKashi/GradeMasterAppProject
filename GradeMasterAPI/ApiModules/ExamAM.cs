namespace GradeMasterAPI.ApiModules {
    public class ExamDTO {
        public int Id { get; set; }
        public string ExamName { get; set; }
        public DateTime ExamDate { get; set; }
        public int CourseId { get; set; }
        public string RoomNum { get; set; }
    }
}
