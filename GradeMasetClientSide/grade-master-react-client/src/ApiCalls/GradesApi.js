import axios from "axios";

const API_GRADES_URL = "https://localhost:7226/api/Grades";

class GradesApi {
  // Get grades for a specific course
  getGradesByCourse(courseId) {
    return axios.get(`${API_GRADES_URL}/byCourse/${courseId}`);
  }

  // Get grades for a specific student in a course
  getGradesByStudentCourse(studentId, courseId) {
    return axios.get(`${API_GRADES_URL}/byStudentCourse`, {
      params: { studentId, courseId },
    });
  }

  // Save grades for multiple students in a course
  saveGrades(grades) {
    return axios.post(`${API_GRADES_URL}/saveGrades`, grades);
  }

  // Update grades for a specific student in a course
  updateGrade(gradeId, gradeData) {
    return axios.put(`${API_GRADES_URL}/${gradeId}`, gradeData);
  }

  // Delete grades for a specific student
  deleteGrade(gradeId) {
    return axios.delete(`${API_GRADES_URL}/${gradeId}`);
  }
}

export default new GradesApi();
