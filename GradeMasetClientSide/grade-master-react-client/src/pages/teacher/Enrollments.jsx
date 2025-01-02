import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Table } from "react-bootstrap";
import StudentsApi from "../../ApiCalls/StudentsApi";
import CoursesApi from "../../ApiCalls/CoursesApi";
import EnrollmentsApi from "../../ApiCalls/EnrollmentsApi";

function Enrollments() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollment, setEnrollment] = useState({
    studentId: "",
    courseId: "",
    enrollmentDate: new Date().toISOString().slice(0, 10), // Default to today's date
  });

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    const response = await StudentsApi.getStudents();
    setStudents(response.data.$values || []);
  };

  const fetchCourses = async () => {
    const response = await CoursesApi.getCourses();
    setCourses(response.data.$values || []);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEnrollment({ ...enrollment, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await EnrollmentsApi.createEnrollment(enrollment);
      alert("Enrollment created successfully");
      // Optionally reset the form or add other logic here
    } catch (error) {
      console.error("Failed to create enrollment:", error);
      alert("Failed to create enrollment");
    }
  };

  return (
    <Container>
      <h1>Enrollments</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Student</Form.Label>
              <Form.Control
                as="select"
                name="studentId"
                value={enrollment.studentId}
                onChange={handleInputChange}
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Course</Form.Label>
              <Form.Control
                as="select"
                name="courseId"
                value={enrollment.courseId}
                onChange={handleInputChange}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Enrollment Date</Form.Label>
              <Form.Control
                type="date"
                name="enrollmentDate"
                value={enrollment.enrollmentDate}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Create Enrollment
        </Button>
      </Form>
    </Container>
  );
}

export default Enrollments;
