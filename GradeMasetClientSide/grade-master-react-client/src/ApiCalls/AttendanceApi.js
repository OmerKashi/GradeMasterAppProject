import axios from "axios";

const API_ATTENDANCE_URL = "https://localhost:7226/api/Attendances";

class AttendanceApi {
  // Get all attendances
  getAllAttendances() {
    return axios.get(API_ATTENDANCE_URL);
  }

  // Get a single attendance by id
  getAttendanceById(id) {
    return axios.get(`${API_ATTENDANCE_URL}/${id}`);
  }

  //Get attendances list by course id
  getAttendancesByCourse(course_id) {
    return axios.get(`${API_ATTENDANCE_URL}/byCourse/${course_id}`);
  }

  // Get attendance list by student and course
  getAttendancesByStudentCourse(studentId, courseId) {
    return axios.get(
      `${API_ATTENDANCE_URL}/byStudentCourse/${studentId}/${courseId}`
    );
  }

  searchOrCreateAttendance(data) {
    return axios.post(`${API_ATTENDANCE_URL}/searchOrCreate`, data);
  }

  // Update an attendance
  updateAttendance(id, attendanceData) {
    return axios.put(`${API_ATTENDANCE_URL}/${id}`, attendanceData);
  }

  // Create a new attendance
  createAttendance(attendanceData) {
    return axios.post(API_ATTENDANCE_URL, attendanceData);
  }

  // Delete an attendance
  deleteAttendance(id) {
    return axios.delete(`${API_ATTENDANCE_URL}/${id}`);
  }
}

export default new AttendanceApi();
