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
import StudentsApi from "../ApiCalls/StudentsApi"; // Ensure API path is correctly set up

function StudentsEditing() {
  const initialStudentState = {
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    address: "",
    enrollmentDate: "",
    password: "",
  };
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState({ initialStudentState });
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await StudentsApi.getStudents();
      setStudents(response.data.$values || []);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    editing ? updateStudent(currentStudent.id, currentStudent) : addStudent();
  };

  const addStudent = async () => {
    await StudentsApi.createStudent(currentStudent);
    fetchStudents();
    clearForm();
  };

  const updateStudent = async (id, student) => {
    await StudentsApi.updateStudent(id, student);
    fetchStudents();
    clearForm();
  };

  const deleteStudent = async (id) => {
    await StudentsApi.deleteStudent(id);
    fetchStudents();
  };

  const clearForm = () => {
    setCurrentStudent(initialStudentState);
    setEditing(false);
  };

  const editStudent = (student) => {
    const formattedStudent = {
      ...student,
      dateOfBirth: student.dateOfBirth.split("T")[0],
      enrollmentDate: student.enrollmentDate.split("T")[0],
    };
    setCurrentStudent(formattedStudent);
    setEditing(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container fluid>
      <h2>Students</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={currentStudent.email}
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
                  value={currentStudent.password}
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
              value={currentStudent.firstName}
              onChange={handleInputChange}
            />
          </Col>
          <Col md={6}>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Enter last Name"
              value={currentStudent.lastName}
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
              placeholder="Enter phone Number"
              value={currentStudent.phoneNumber}
              onChange={handleInputChange}
            />
          </Col>
          <Col md={6}>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              placeholder="Enter address"
              value={currentStudent.address}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              placeholder="Date of Birth"
              value={currentStudent.dateOfBirth}
              onChange={handleInputChange}
            />
          </Col>
          <Col md={6}>
            <Form.Label>Enrollment Date</Form.Label>
            <Form.Control
              type="date"
              name="enrollmentDate"
              placeholder="Enrollment Date"
              value={currentStudent.enrollmentDate}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Label>Gender</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={currentStudent.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Control>
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          {editing ? "Update" : "Add"}
        </Button>
        <Button variant="secondary" onClick={clearForm} className="ml-2">
          Clear
        </Button>
      </Form>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.email}</td>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>
                <Button variant="warning" onClick={() => editStudent(student)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteStudent(student.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default StudentsEditing;
