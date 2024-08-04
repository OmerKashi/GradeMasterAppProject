import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import CoursesApi from "../../ApiCalls/CoursesApi";

const Attendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAtterndance] = useState({});
  const [roomNumber, setRoomNumber] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const teacherId = 1002; // This should be dynamically set based on the logged-in teacher

  useEffect(() => {
    // Fetch the classes for the teacher
    const fetchCourses = async () => {
      try {
        const response = await CoursesApi.getCoursesByTeacher(teacherId);
        console.log("Fetched courses:", response.data);
        const coursesArray = response.data.$values || []; // Extract the array from $values
        setCourses(coursesArray);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [teacherId]);

  return (
    <Container>
      <h1>Attendance Management</h1>
      <Form>
        <Form.Group>
          <Form.Label>Select Course</Form.Label>
          <Form.Control
            as="select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select course: </option>
            {Array.isArray(courses) &&
              courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName}{" "}
                </option>
              ))}
          </Form.Control>
        </Form.Group>

        {selectedCourse && (
          <Form.Group>
            <Form.Label>Select Class:</Form.Label>
            <Form.Control
              as="select"
              value={selectedClasses}
              onChange={(e) => setSelectedClasses(e.target.value)}
            >
              <option value="">Select class: </option>
              {classes?.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}{" "}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}
      </Form>
    </Container>
  );
};

export default Attendance;
