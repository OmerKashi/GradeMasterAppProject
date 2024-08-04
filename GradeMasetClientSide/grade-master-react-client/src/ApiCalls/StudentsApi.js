import axios from "axios";

const API_STUDENTS_URL = "https://localhost:7226/api/Students";

class StudentsApi {
  //api/Students
  getStudents() {
    return axios.get(API_STUDENTS_URL);
  }

  //api//Students/10
  getStudent(id) {
    return axios.get(`${API_STUDENTS_URL}/${id}`);
  }

  //api/Students/
  //body: teacher JSON
  createStudent(student) {
    return axios.post(API_STUDENTS_URL, student);
  }

  //api/Students/
  //body: student JSON values to update
  updateStudent(id, student) {
    return axios.put(`${API_STUDENTS_URL}/${id}`, student);
  }

  deleteStudent(id) {
    return axios.delete(`${API_STUDENTS_URL}/${id}`);
  }
}

//Every time other class will import it it will get new instance
export default new StudentsApi();
