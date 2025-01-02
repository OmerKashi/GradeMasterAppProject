import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Table,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import TeachersApi from "../ApiCalls/TeachersApi";

//Component for CRUD operation using server calls
function TeacherEditing() {
  //--state all teachers
  //Empty array of all teachers (Will be filled from server)
  const [teachers, setTeachers] = useState([]);

  //--state current teacher
  const [currentTeacher, setCurrentTeacher] = useState({
    id: 0,
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  //--Edit-Create
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //--Event for each state changed
  //--if empty its trrigered only once
  useEffect(() => {
    refreshTeachers();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentTeacher({ ...currentTeacher, [name]: value });
  };

  //Happens pnly once when the app loads
  //--Load all Teachers from remote api
  const refreshTeachers = () => {
    //Call API in server
    //And save it into state
    TeachersApi.getTeachers()
      .then((response) => {
        const data = response.data.$values || []; //Handles the structure and defaults to an empty array if $values is undefined
        console.log("Teachers fetched:", data); // Log to see what we actually receiving
        setTeachers(data);
      })
      .catch((error) => {
        console.error("Failed to fetch teachers:", error);
      });
  };

  const addTeacher = () => {
    //Call server Add
    TeachersApi.createTeacher(currentTeacher).then((response) => {
      //--Refresh current list
      refreshTeachers();

      //--Clean current teacher
      setCurrentTeacher({
        id: 0,
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
      });
    });
  };

  const updateTeacher = () => {
    TeachersApi.updateTeacher(currentTeacher.id, currentTeacher).then(
      (response) => {
        //--Refresh current list
        refreshTeachers();

        //--Clean current teacher
        setCurrentTeacher({
          id: 0,
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
        });

        setEditing(false);
      }
    );
  };

  const deleteTeacher = (id) => {
    TeachersApi.deleteTeacher(id).then(() => {
      refreshTeachers();
    });
  };

  const editTeacher = (teacher) => {
    setCurrentTeacher(teacher);
    setEditing(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    editing ? updateTeacher(currentTeacher.id, currentTeacher) : addTeacher();
  };

  const clearForm = () => {
    setCurrentTeacher({
      id: 0,
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    });
    setEditing(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //{/*EDIT/CREATE FORM*/}
  //{/*LIST OF ALL TEACHERS (each item will have edit&delete buttons)*/}

  return (
    <Container fluid>
      <h2>Teachers</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={currentTeacher.email}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <FormControl
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={currentTeacher.password}
                  onChange={handleInputChange}
                />
                <InputGroup.Text onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              placeholder="Enter First Name"
              value={currentTeacher.firstName}
              onChange={handleInputChange}
            />
          </Col>
          <Col md={6}>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Enter last Name"
              value={currentTeacher.lastName}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={currentTeacher.phoneNumber}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          {editing ? "Update" : "Add"}
        </Button>
        <Button variant="secondary" onClick={clearForm} className="ml-2">
          Clear
        </Button>
      </Form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.email}</td>
              <td>{teacher.firstName}</td>
              <td>{teacher.lastName}</td>
              <td>{teacher.phoneNumber}</td>
              <td>
                <button
                  onClick={() => editTeacher(teacher)}
                  className="btn btn-warning m-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTeacher(teacher.id)}
                  className="btn btn-danger m-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}

export default TeacherEditing;
