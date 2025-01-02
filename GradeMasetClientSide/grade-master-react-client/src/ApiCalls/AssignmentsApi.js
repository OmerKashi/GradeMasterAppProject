import axios from "axios";

const API_ASSIGNMENTS_URL = "https://localhost:7226/api/Assignments";

class AssignmentsApi {
  // Get all assignments
  getAllAssignments() {
    return axios.get(API_ASSIGNMENTS_URL);
  }

  // Get a single assignment by ID
  getAssignmentById(id) {
    return axios.get(`${API_ASSIGNMENTS_URL}/${id}`);
  }

  // Get all assignments for a specific course
  getAssignmentsByCourse(courseId) {
    return axios.get(`${API_ASSIGNMENTS_URL}/byCourse/${courseId}`);
  }

  // Update an existing assignment
  updateAssignment(id, assignmentData) {
    return axios.put(`${API_ASSIGNMENTS_URL}/${id}`, assignmentData);
  }

  // Create a new assignment
  createAssignment(assignmentData) {
    return axios.post(API_ASSIGNMENTS_URL, assignmentData);
  }

  // Delete an assignment by ID
  deleteAssignment(id) {
    return axios.delete(`${API_ASSIGNMENTS_URL}/${id}`);
  }
}

export default new AssignmentsApi();
