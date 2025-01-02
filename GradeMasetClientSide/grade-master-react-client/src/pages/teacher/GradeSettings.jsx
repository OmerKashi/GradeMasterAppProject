import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import CoursesApi from "../../ApiCalls/CoursesApi";

const GradeSettings = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [weights, setWeights] = useState({
    exams: 70,
    assignments: 20,
    attendance: 10,
  });

  const teacherId = localStorage.getItem("teacherId"); // Fetch the teacher ID from localStorage

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await CoursesApi.getCoursesByTeacher(teacherId);
        console.log("Courses fetched:", response.data); // Check the structure here
        // Check if response.data is an array or needs parsing
        const courseData = Array.isArray(response.data)
          ? response.data
          : response.data.$values || [];
        setCourses(courseData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [teacherId]);

  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    setWeights((prevWeights) => ({
      ...prevWeights,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting grade settings for:", selectedCourse, weights);
    // Here you would typically make an API call to save the weights
    alert("Grade settings saved!");
  };

  return (
    <Container>
      <h1>Final Grade Settings</h1>
      <p>Determine the % of the final grade for the course</p>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Select Course</Form.Label>
              <Form.Control
                as="select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.courseName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>% Exams</Form.Label>
              <Form.Control
                type="number"
                name="exams"
                value={weights.exams}
                onChange={handleWeightChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>% Assignments</Form.Label>
              <Form.Control
                type="number"
                name="assignments"
                value={weights.assignments}
                onChange={handleWeightChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>% Attendance</Form.Label>
              <Form.Control
                type="number"
                name="attendance"
                value={weights.attendance}
                onChange={handleWeightChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" className="mt-3">
          Save Settings
        </Button>
      </Form>
    </Container>
  );
};

export default GradeSettings;
