import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Button,
  Alert,
} from "react-bootstrap";
import CoursesApi from "../../ApiCalls/CoursesApi";
import AssignmentsApi from "../../ApiCalls/AssignmentsApi";

const Assignment = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [percentageOfTotalGrade, setPercentageOfTotalGrade] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });

  const teacherId = localStorage.getItem("teacherId");

  // Fetch courses taught by the teacher
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await CoursesApi.getCoursesByTeacher(teacherId);
        setCourses(response.data.$values || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setMessage({ type: "danger", text: "Failed to fetch courses." });
      }
    };
    fetchCourses();
  }, [teacherId]);

  // Fetch assignments for the selected course
  const fetchAssignments = async (courseId) => {
    try {
      const response = await AssignmentsApi.getAssignmentsByCourse(courseId);
      setAssignments(response.data.$values || []);
      setMessage({ type: "success", text: "Assignments loaded successfully." });
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setMessage({ type: "danger", text: "Failed to fetch assignments." });
    }
  };

  // Handle course selection
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setAssignments([]); // Clear assignments for the new course
    if (courseId) {
      fetchAssignments(courseId);
    }
  };

  // Add a new assignment
  const handleAddAssignment = async () => {
    if (
      !selectedCourse ||
      !title ||
      !description ||
      !dueDate ||
      percentageOfTotalGrade <= 0
    ) {
      setMessage({ type: "danger", text: "Please fill in all fields." });
      return;
    }

    const newAssignment = {
      courseId: selectedCourse,
      title,
      description,
      dueDate,
      percentageOfTotalGrade,
    };

    try {
      // Step 1: Create the Assignment
      await AssignmentsApi.createAssignment(newAssignment);

      setMessage({
        type: "success",
        text: "Assignment created successfully, and submissions were added automatically!",
      });

      // Refresh the assignment list
      fetchAssignments(selectedCourse);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPercentageOfTotalGrade(0);
    } catch (error) {
      console.error("Error creating assignment:", error);
      setMessage({ type: "danger", text: "Failed to create assignment." });
    }
  };

  return (
    <Container>
      <h1>Assignment Management</h1>
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Select Course</Form.Label>
              <Form.Control
                as="select"
                value={selectedCourse}
                onChange={handleCourseChange}
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
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Percentage Of Total Grade</Form.Label>
              <Form.Control
                type="number"
                value={percentageOfTotalGrade}
                onChange={(e) =>
                  setPercentageOfTotalGrade(parseInt(e.target.value, 10))
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Button onClick={handleAddAssignment} variant="primary">
          Add Assignment
        </Button>
      </Form>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Percentage Of Total Grade</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td>
                  {courses.find((course) => course.id === assignment.courseId)
                    ?.courseName || "Unknown"}
                </td>
                <td>{assignment.title}</td>
                <td>{assignment.description}</td>
                <td>
                  {new Date(assignment.dueDate).toLocaleDateString("en-GB")}
                </td>
                <td>{assignment.percentageOfTotalGrade}%</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No assignments found for the selected course.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Assignment;
