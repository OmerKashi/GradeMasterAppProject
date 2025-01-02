import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Alert,
  Button,
} from "react-bootstrap";
import CoursesApi from "../../ApiCalls/CoursesApi";
import ExamApi from "../../ApiCalls/ExamsApi";

const Exam = () => {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [examName, setExamName] = useState("");
  const [roomNum, setRoomNum] = useState("");
  const [examDate, setExamDate] = useState("");
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

  const fetchExamsByCourse = async (courseId) => {
    try {
      const response = await ExamApi.getExamsByCourse(courseId);
      setExams(response.data.$values || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
      setMessage({ type: "danger", text: "Failed to fetch exams." });
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setExams([]);
    if (courseId) {
      fetchExamsByCourse(courseId);
    }
  };

  const handleAddExam = async () => {
    if (!selectedCourse || !examName || !roomNum || !examDate) {
      setMessage({ type: "danger", text: "Please fill in all fields." });
      return;
    }

    const newExam = {
      courseId: selectedCourse,
      examName,
      roomNum,
      examDate,
    };

    try {
      await ExamApi.createExam(newExam);
      setMessage({ type: "success", text: "Exam added successfully." });
      setExamName("");
      setRoomNum("");
      setExamDate("");
      fetchExamsByCourse(selectedCourse);
    } catch (error) {
      console.error("Error adding exam:", error);
      setMessage({ type: "danger", text: "Failed to add exam." });
    }
  };

  return (
    <Container>
      <h1>Exam Management</h1>
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
              <Form.Label>Exam Name</Form.Label>
              <Form.Control
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Room Number</Form.Label>
              <Form.Control
                type="text"
                value={roomNum}
                onChange={(e) => setRoomNum(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Exam Date</Form.Label>
              <Form.Control
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Button className="mb-3" onClick={handleAddExam}>
        Add Exam
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Exam Name</th>
            <th>Exam Date</th>
            <th>Room Number</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id}>
              <td>
                {courses.find((c) => c.id === exam.courseId)?.courseName ||
                  "Unknown Course"}
              </td>
              <td>{exam.examName}</td>
              <td>{new Date(exam.examDate).toLocaleDateString()}</td>
              <td>{exam.roomNum}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Exam;
