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
import AttendanceApi from "../../ApiCalls/AttendanceApi";
import EnrollmentsApi from "../../ApiCalls/EnrollmentsApi";

const Attendance = () => {
  const [courses, setCourses] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState(""); // Tracks selected attendance
  const [roomNumber, setRoomNumber] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isUpdating, setIsUpdating] = useState(false); // Tracks if updating attendance

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

  const fetchPreviousAttendances = async (courseId) => {
    try {
      const response = await AttendanceApi.getAttendancesByCourse(courseId);
      const attendancesData = response.data.$values || [];

      const groupedAttendances = Object.values(
        attendancesData.reduce((acc, attendance) => {
          const key = `${attendance.courseId}-${attendance.start}`;
          if (!acc[key]) {
            acc[key] = {
              id: attendance.id,
              courseId: attendance.courseId,
              start: attendance.start,
              roomNum: attendance.roomNum,
              durationMinutes: attendance.durationMinutes,
              courseName:
                courses.find((c) => c.id === attendance.courseId)?.courseName ||
                "Unknown Course",
            };
          }
          acc[key].records = acc[key].records || [];
          acc[key].records.push(attendance);
          return acc;
        }, {})
      );

      setAttendances(groupedAttendances);
    } catch (error) {
      console.error("Error fetching attendances:", error);
      setMessage({
        type: "danger",
        text: "Failed to fetch previous attendances.",
      });
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
        status: false,
        notes: "",
        attendanceId: null, // Default ID to track existing attendance records
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
    setStudents([]);
    setSelectedAttendance(""); // Clear selected attendance when course changes
    if (courseId) {
      fetchPreviousAttendances(courseId);
      fetchStudents(courseId);
    }
  };

  const handleAttendanceSelect = (e) => {
    const selectedKey = e.target.value;
    setSelectedAttendance(selectedKey); // Update selected attendance
    const selected = attendances.find(
      (attendance) =>
        `${attendance.courseId}-${attendance.start}` === selectedKey
    );

    if (selected) {
      setRoomNumber(selected.roomNum);
      setStartTime(selected.start);
      setDuration(selected.durationMinutes);
      setIsUpdating(true);

      const updatedStudents = students.map((student) => {
        const record = selected.records.find(
          (rec) => rec.studentId === student.id
        );
        return {
          ...student,
          status: record ? record.status === "Present" : false,
          notes: record ? record.notes : "",
          attendanceId: record ? record.id : null, // Map attendance ID for updates
        };
      });
      setStudents(updatedStudents);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCourse || !startTime || !roomNumber || !duration) {
      setMessage({ type: "danger", text: "Please fill in all fields." });
      return;
    }

    try {
      const attendanceRecords = students.map((student) => ({
        id: student.attendanceId || 0, // Include attendance ID for updates
        courseId: selectedCourse,
        start: startTime,
        roomNum: roomNumber,
        durationMinutes: duration,
        studentId: student.id,
        notes: student.notes,
        status: student.status ? "Present" : "Absent",
      }));

      if (isUpdating) {
        await Promise.all(
          attendanceRecords.map((record) =>
            AttendanceApi.updateAttendance(record.id, record)
          )
        );
        setMessage({
          type: "success",
          text: "Attendance updated successfully!",
        });
      } else {
        await Promise.all(
          attendanceRecords.map((record) =>
            AttendanceApi.createAttendance(record)
          )
        );
        setMessage({
          type: "success",
          text: "Attendance submitted successfully!",
        });
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      setMessage({ type: "danger", text: "Failed to submit attendance." });
    }
  };

  return (
    <Container>
      <h1>Attendance Management</h1>
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
              <Form.Label>Select Previous Attendance</Form.Label>
              <Form.Control
                as="select"
                value={selectedAttendance} // Set the selected value
                onChange={handleAttendanceSelect}
              >
                <option value="">Select attendance</option>
                {attendances.map((attendance, index) => (
                  <option
                    key={index}
                    value={`${attendance.courseId}-${attendance.start}`}
                  >
                    {attendance.courseName} -{" "}
                    {new Date(attendance.start).toLocaleDateString("en-GB")}{" "}
                    {new Date(attendance.start).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Room Number</Form.Label>
              <Form.Control
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Duration (Minutes)</Form.Label>
              <Form.Control
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={student.status}
                  onChange={(e) => {
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.id === student.id
                          ? { ...s, status: e.target.checked }
                          : s
                      )
                    );
                  }}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={student.notes}
                  onChange={(e) => {
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.id === student.id
                          ? { ...s, notes: e.target.value }
                          : s
                      )
                    );
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="mt-3">
        <Button onClick={handleSubmit}>
          {isUpdating ? "Update Attendance" : "Submit Attendance"}
        </Button>
      </div>
    </Container>
  );
};

export default Attendance;
