import axios from "axios";

const API_COURSES_URL = "https://localhost:7226/api/Courses";

class CoursesApi {
  //api/Courses
  getCourses() {
    return axios.get(API_COURSES_URL);
  }

  //api//Course/10
  getCourse(id) {
    return axios.get(`${API_COURSES_URL}/${id}`);
  }

  // New method to get courses by teacher ID
  getCoursesByTeacher(teacherId) {
    return axios.get(`${API_COURSES_URL}/byTeacher/${teacherId}`);
  }

  getStudentsInCourse(id) {
    return axios.get(`${API_COURSES_URL}/${id}/students`);
  }

  //api/Courses/
  //body: Course JSON
  createCourse(Course) {
    return axios.post(API_COURSES_URL, Course);
  }

  //api/Courses/
  //body: Course JSON values to update
  updateCourse(id, Course) {
    return axios.put(`${API_COURSES_URL}/${id}`, Course);
  }

  deleteCourse(id) {
    return axios.delete(`${API_COURSES_URL}/${id}`);
  }
}

//Every time other class will import it it will get new instance
export default new CoursesApi();
