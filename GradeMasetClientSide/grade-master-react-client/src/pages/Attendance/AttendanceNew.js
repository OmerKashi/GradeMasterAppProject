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
import CoursesApi from "../../ApiCalls/CoursesApi";
import StudentsApi from "../../ApiCalls/StudentsApi";
import AttendanceApi from "../../ApiCalls/AttendanceApi";
import EnrollmentsApi from "../../ApiCalls/EnrollmentsApi";

const AttendanceNew = () => {
  //Empty array of students
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await CoursesApi.getCoursesByTeacher(teacherId);
        setCourses(response.data.$values || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [teacherId]);

  const fetchStudentsForCourse = async (courseId) => {
    try {
      // First, fetch enrollments for the course
      const enrollmentResponse = await EnrollmentsApi.getEnrollmentsByCourse(
        courseId
      );
      if (!enrollmentResponse.data.length) {
        // If no enrollments, clear students and provide message
        setStudents([]);
        setMessage({
          type: "info",
          text: "No students enrolled in this course.",
        });
        return;
      }
      const studentIds = enrollmentResponse.data.map(
        (enrollment) => enrollment.studentId
      );

      // Ensure to handle courses with enrollments but missing student data gracefully
      if (!studentIds.length) {
        setStudents([]);
        setMessage({
          type: "info",
          text: "Enrolled students' details are not available.",
        });
        return;
      }

      // Now, fetch student details by these IDs
      const studentsResponse = await StudentsApi.getStudentsLstByIds(
        studentIds
      );
      setStudents(studentsResponse.$values || []);
      setMessage({ type: "success", text: "Students loaded successfully." });
    } catch (error) {
      console.error("Error fetching students for course:", error);
      setMessage({ type: "danger", text: "Failed to load students." });
    }
  };

  //--Edit-Create
  const [editing, setEditing] = useState(false);

  //return
};

export default AttendanceNew;
