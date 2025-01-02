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
import AttendanceApi from "../../ApiCalls/AttendanceApi";
import AssignmentsApi from "../../ApiCalls/AssignmentsApi";
import AssignmentSubmissionsApi from "../../ApiCalls/AssignmentSubmissionsApi";
import ExamsApi from "../../ApiCalls/ExamsApi";
import ExamSubmissionsApi from "../../ApiCalls/ExamSubmissionsApi";
import GradesApi from "../../ApiCalls/GradesApi";
import EnrollmentsApi from "../../ApiCalls/EnrollmentsApi";

const FinalGrades = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [grades, setGrades] = useState([]);
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
        return [];
      }

      const mappedStudents = enrolledStudents.map((student) => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
      }));

      setStudents(mappedStudents);
      setMessage({ type: "success", text: "Students loaded successfully." });
      return mappedStudents;
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage({ type: "danger", text: "Failed to fetch students." });
      return [];
    }
  };

  const calculateGrades = async (courseId) => {
    try {
      // Fetch students for the course
      const studentsData = await fetchStudents(courseId);

      const attendances = await AttendanceApi.getAttendancesByCourse(courseId);
      const assignments = await AssignmentsApi.getAssignmentsByCourse(courseId);

      const assignmentIds = assignments.data.$values.map((a) => a.id);
      const allSubmissions =
        await AssignmentSubmissionsApi.getAssignmentSubmissionsByAssignments(
          assignmentIds
        );

      const exams = await ExamsApi.getExamsByCourse(courseId);
      const examSubmissions = await Promise.all(
        exams.data.$values.map((exam) =>
          ExamSubmissionsApi.getExamSubmissionsByExam(exam.id)
        )
      );

      const gradesData = studentsData.map((student) => {
        // Attendance Grade Calculation
        const studentAttendances = attendances.data.$values.filter(
          (a) => a.studentId === student.id
        );
        const attendanceGrade =
          studentAttendances.length > 0
            ? (studentAttendances.filter((a) => a.status === "Present").length /
                studentAttendances.length) *
              100
            : 0;

        // Assignments Grade Calculation
        const studentAssignments = allSubmissions.data.$values.filter(
          (s) => s.studentId === student.id
        );
        const assignmentsGrade =
          studentAssignments.length > 0
            ? studentAssignments.reduce((sum, s) => sum + (s.grade || 0), 0) /
              studentAssignments.length
            : 0;

        // Exam Grade Calculation
        const studentExams = examSubmissions.flatMap((response) =>
          response.data.$values.filter((sub) => sub.studentId === student.id)
        );
        const examGrade =
          studentExams.length > 0
            ? studentExams.reduce((sum, e) => sum + (e.grade || 0), 0) /
              studentExams.length
            : 0;

        // Final Grade Calculation
        const finalGrade =
          0.1 * attendanceGrade + 0.3 * assignmentsGrade + 0.6 * examGrade;

        return {
          studentId: student.id,
          studentName: student.name,
          attendanceGrade: attendanceGrade.toFixed(2),
          assignmentsGrade: assignmentsGrade.toFixed(2),
          examGrade: examGrade.toFixed(2),
          finalGrade: finalGrade.toFixed(2),
        };
      });

      setGrades(gradesData);
    } catch (error) {
      console.error("Error calculating grades:", error);
      setMessage({ type: "danger", text: "Failed to calculate grades." });
    }
  };

  const saveGrades = async () => {
    try {
      const gradesPayload = grades.map((grade) => ({
        studentId: grade.studentId,
        courseId: selectedCourse,
        finalGrade: parseFloat(grade.finalGrade),
        submissionsGrades: parseFloat(grade.assignmentsGrade),
        attendance: parseFloat(grade.attendanceGrade),
        examsGrade: parseFloat(grade.examGrade),
      }));

      await GradesApi.saveGrades(gradesPayload);

      setMessage({ type: "success", text: "Grades saved successfully!" });
    } catch (error) {
      console.error("Error saving grades:", error);
      setMessage({ type: "danger", text: "Failed to save grades." });
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setGrades([]); // Clear previous grades
    calculateGrades(courseId); // Calculate grades for the new course
  };

  return (
    <Container>
      <h1>Final Grades</h1>
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}
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
      <p>Weight Distribution: 60% Exam, 30% Assignments, 10% Attendance</p>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Attendance Grade</th>
            <th>Assignments Grade</th>
            <th>Exam Grade</th>
            <th>Final Grade</th>
          </tr>
        </thead>
        <tbody>
          {grades.length > 0 ? (
            grades.map((grade, index) => (
              <tr key={index}>
                <td>{grade.studentName}</td>
                <td>{grade.attendanceGrade}</td>
                <td>{grade.assignmentsGrade}</td>
                <td>{grade.examGrade}</td>
                <td>{grade.finalGrade}</td>
              </tr>
            ))
          ) : students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td colSpan="4" className="text-center">
                  No grades calculated for this student.
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No grades available for the selected course.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Button className="mt-3" onClick={saveGrades}>
        Save Grades
      </Button>
    </Container>
  );
};

export default FinalGrades;
