import axios from "axios";

const API_ASSIGNMENT_SUBMISSIONS_URL =
  "https://localhost:7226/api/AssignmentSubmissions";

class AssignmentSubmissionsApi {
  // Get all assignments
  getAssignmentSubmission() {
    return axios.get(API_ASSIGNMENT_SUBMISSIONS_URL);
  }

  // Get a single assignment by ID
  getAssignmentSubmissionById(id) {
    return axios.get(`${API_ASSIGNMENT_SUBMISSIONS_URL}/${id}`);
  }

  getAssignmentsByStudentCourse(studentId, courseId) {
    return axios.get(
      `${API_ASSIGNMENT_SUBMISSIONS_URL}/byStudentCourse/${studentId}/${courseId}`
    );
  }

  // Get assignment submissions by assignment IDs
  getAssignmentSubmissionsByAssignments(assignmentIds) {
    const params = new URLSearchParams();
    assignmentIds.forEach((id) => params.append("assignmentIds", id));
    return axios.get(
      `${API_ASSIGNMENT_SUBMISSIONS_URL}/byAssignments?${params.toString()}`
    );
  }

  // Update an existing assignment
  updateAssignmentSubmission(id, assignmentData) {
    return axios.put(`${API_ASSIGNMENT_SUBMISSIONS_URL}/${id}`, assignmentData);
  }

  // Create a new assignment
  createAssignmentSubmission(assignmentData) {
    return axios.post(API_ASSIGNMENT_SUBMISSIONS_URL, assignmentData);
  }

  // Delete an assignment by ID
  deleteAssignmentSubmission(id) {
    return axios.delete(`${API_ASSIGNMENT_SUBMISSIONS_URL}/${id}`);
  }
}

export default new AssignmentSubmissionsApi();
