import axios from "axios";

const API_EXAM_URL = "https://localhost:7226/api/Exams";

class ExamApi {
  // Get all exams
  getAllExams() {
    return axios.get(API_EXAM_URL);
  }

  // Get a single exam by ID
  getExamById(id) {
    return axios.get(`${API_EXAM_URL}/${id}`);
  }

  getExamsByCourse(courseId) {
    return axios.get(`${API_EXAM_URL}/byCourse/${courseId}`);
  }

  // Update an existing exam
  updateExam(id, examData) {
    return axios.put(`${API_EXAM_URL}/${id}`, examData);
  }

  // Create a new exam
  createExam(examData) {
    return axios.post(API_EXAM_URL, examData);
  }

  // Delete an exam by ID
  deleteExam(id) {
    return axios.delete(`${API_EXAM_URL}/${id}`);
  }
}

export default new ExamApi();
