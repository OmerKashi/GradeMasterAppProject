import axios from "axios";

const API_ENROLLMENTS_URL = "https://localhost:7226/api/Enrollments";

class EnrollmentsApi {
  getEnrollments() {
    return axios.get(API_ENROLLMENTS_URL);
  }

  getEnrollment(id) {
    return axios.get(`${API_ENROLLMENTS_URL}/${id}`);
  }

  createEnrollment(enrollment) {
    return axios.post(API_ENROLLMENTS_URL, enrollment);
  }

  updateEnrollment(id, enrollment) {
    return axios.put(`${API_ENROLLMENTS_URL}/${id}`, enrollment);
  }

  deleteEnrollment(id) {
    return axios.delete(`${API_ENROLLMENTS_URL}/${id}`);
  }

  getStudentByCourse(courseId) {
    return axios.get(`${API_ENROLLMENTS_URL}/bycourse/${courseId}`);
  }
}

export default new EnrollmentsApi();
