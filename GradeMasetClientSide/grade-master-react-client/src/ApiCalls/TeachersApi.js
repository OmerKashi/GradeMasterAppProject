import axios from "axios";

const API_TEACHERS_URL = "https://localhost:7226/api/Teachers";

class TeachersApi {
  //api/teachers
  getTeachers() {
    return axios.get(API_TEACHERS_URL);
  }

  //api//Teacher/10
  getTeacher(id) {
    return axios.get(`${API_TEACHERS_URL}/${id}`);
  }

  //api/teachers/
  //body: teacher JSON
  createTeacher(teacher) {
    return axios.post(API_TEACHERS_URL, teacher);
  }

  //api/teachers/
  //body: teacher JSON values to update
  updateTeacher(id, teacher) {
    return axios.put(`${API_TEACHERS_URL}/${id}`, teacher);
  }

  deleteTeacher(id) {
    return axios.delete(`${API_TEACHERS_URL}/${id}`);
  }
}

//Every time other class will import it it will get new instance
export default new TeachersApi();
