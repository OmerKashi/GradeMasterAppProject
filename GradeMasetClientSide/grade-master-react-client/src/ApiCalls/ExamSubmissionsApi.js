import axios from "axios";

const API_EXAM_SUBMISSIONS_URL = "https://localhost:7226/api/ExamSubmissions";

class ExamsSubmissionsApi {
  // Get all exam submissions
  getExamSubmissions() {
    return axios.get(API_EXAM_SUBMISSIONS_URL);
  }

  // Get exam submissions by course
  getExamSubmissionsByExam(examId) {
    return axios.get(`${API_EXAM_SUBMISSIONS_URL}/byExam/${examId}`);
  }

  // Create a new exam submission
  createExamSubmission(examSubmissionData) {
    return axios.post(API_EXAM_SUBMISSIONS_URL, examSubmissionData);
  }

  // Update an existing exam submission
  updateExamSubmission(id, examSubmissionData) {
    return axios.put(`${API_EXAM_SUBMISSIONS_URL}/${id}`, examSubmissionData);
  }

  // Delete an exam submission
  deleteExamSubmission(id) {
    return axios.delete(`${API_EXAM_SUBMISSIONS_URL}/${id}`);
  }
}

export default new ExamsSubmissionsApi();
