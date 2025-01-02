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
import EnrollmentsApi from "../../ApiCalls/EnrollmentsApi";
import AssignmentSubmissionsApi from "../../ApiCalls/AssignmentSubmissionsApi";

const Submissions = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const teacherId = localStorage.getItem("teacherId");

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

  const fetchAssignments = async (courseId) => {
    try {
      const response = await AssignmentsApi.getAssignmentsByCourse(courseId);
      setAssignments(response.data.$values || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setMessage({ type: "danger", text: "Failed to fetch assignments." });
    }
  };

  const fetchStudents = async (courseId) => {
    try {
      const enrollmentResponse = await EnrollmentsApi.getStudentByCourse(
        courseId
      );
      const enrolledStudents = enrollmentResponse.data.$values || [];

      if (enrolledStudents.length === 0) {
        setStudents([]);
        setMessage({
          type: "info",
          text: "No students found for this course.",
        });
        return;
      }

      const mappedStudents = enrolledStudents.map((student) => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        filePath: "",
        submissionDate: "",
        feedback: "",
        grade: 0,
      }));

      setStudents(mappedStudents);
      setMessage({ type: "success", text: "Students loaded successfully." });
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage({ type: "danger", text: "Failed to fetch students." });
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setSelectedAssignment("");
    setAssignments([]);
    setStudents([]);
    if (courseId) {
      fetchAssignments(courseId);
      fetchStudents(courseId);
    }
  };

  const handleSaveSubmissions = async () => {
    try {
      const submissionRecords = students.map((student) => ({
        filePath: student.filePath || "",
        assignmentId: selectedAssignment,
        studentId: student.id,
        submissionDate: student.submissionDate || new Date().toISOString(),
        feedback: student.feedback || "",
        grade: parseInt(student.grade, 10) || 0,
      }));

      await Promise.all(
        submissionRecords.map((record) =>
          AssignmentSubmissionsApi.createSubmission(record)
        )
      );

      setMessage({ type: "success", text: "Submissions saved successfully!" });
    } catch (error) {
      console.error("Error saving submissions:", error);
      setMessage({ type: "danger", text: "Failed to save submissions." });
    }
  };

  return (
    <Container>
      <h1>Assignment Submissions</h1>
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
          <Col>
            <Form.Group>
              <Form.Label>Select Assignment</Form.Label>
              <Form.Control
                as="select"
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                disabled={!assignments.length}
              >
                <option value="">Select an assignment</option>
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>File Path</th>
            <th>Submission Date</th>
            <th>Feedback</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>
                <Form.Control
                  type="text"
                  value={student.filePath || ""}
                  onChange={(e) =>
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.id === student.id
                          ? { ...s, filePath: e.target.value }
                          : s
                      )
                    )
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="datetime-local"
                  value={student.submissionDate || ""}
                  onChange={(e) =>
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.id === student.id
                          ? { ...s, submissionDate: e.target.value }
                          : s
                      )
                    )
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={student.feedback || ""}
                  onChange={(e) =>
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.id === student.id
                          ? { ...s, feedback: e.target.value }
                          : s
                      )
                    )
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={student.grade || 0}
                  onChange={(e) =>
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.id === student.id
                          ? { ...s, grade: parseInt(e.target.value, 10) }
                          : s
                      )
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button className="mt-3" onClick={handleSaveSubmissions}>
        Save Submissions
      </Button>
    </Container>
  );
};

export default Submissions;
