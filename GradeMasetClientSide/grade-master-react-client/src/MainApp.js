import React from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import TeachersApi from "./ApiCalls/TeachersApi";
import StudentsApi from "./ApiCalls/StudentsApi";
import UserForm from "./Auth/UserForm";
import Home from "./pages/home/Home";
import Attendance from "./pages/Attendance/Attendance";
import GradeSettings from "./pages/teacher/GradeSettings";
import Exams from "./pages/teacher/Exam";
import Assignments from "./pages/teacher/Assignment";
import TeacherEditing from "./Admin/TeachersEditing";
import StudentsEditing from "./Admin/StudentsEditing";
import Enrollments from "./pages/teacher/Enrollments";
import Submissions from "./pages/teacher/Submissions";
import FinalGrades from "./pages/teacher/FinalGrades";

import Layout from "./Components/Layout";

const MainApp = () => {
  const navigate = useNavigate();

  const validateUserRole = async (email, password, role) => {
    try {
      let user = null;

      // Fetch user data based on the role
      if (role === "teacher") {
        const response = await TeachersApi.getTeachers();
        user = response.data.$values.find(
          (t) => t.email === email && t.password === password
        );
      } else if (role === "student") {
        const response = await StudentsApi.getStudents();
        user = response.data.$values.find(
          (s) => s.email === email && s.password === password
        );
      }

      if (user) {
        // Save user details to localStorage
        localStorage.setItem("firstName", user.firstName);
        localStorage.setItem("lastName", user.lastName);
        localStorage.setItem("role", role);
        if (role === "teacher") {
          localStorage.setItem("teacherId", user.id); // Assuming the teacher's ID is available as 'id'
        }
        return true; // Credentials are valid
      } else {
        return false; // Invalid credentials
      }
    } catch (error) {
      console.error("Error validating user role:", error);
      return false;
    }
  };

  const handleLogin = async (email, password, role) => {
    try {
      const isValidRole = await validateUserRole(email, password, role);
      if (!isValidRole) {
        alert("Invalid credentials or role.");
        return;
      }

      navigate("/home"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while validating the user role.");
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<UserForm onLogin={handleLogin} />} />
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/grade-settings" element={<GradeSettings />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/adminTeachersEdit" element={<TeacherEditing />} />
        <Route path="/adminStudentsEdit" element={<StudentsEditing />} />
        <Route path="/enrollmentsSet" element={<Enrollments />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/finalGrades" element={<FinalGrades />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default MainApp;
