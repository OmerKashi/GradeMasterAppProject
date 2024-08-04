import React, { useState } from "react";
import { Route, Routes, useNavigate, R } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import UserForm from "./Auth/UserForm";
import MainScreen from "./Components/MainAppComp";
import { validateUserRole } from "./ApiCalls/AuthApi";
import Home from "./pages/home/Home";
import Attendance from "./pages/teacher/Attendance";

const MainApp = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const getRoleRederict = () => {
    const role = localStorage.getItem("userRole");
    if (role === "teacher") {
      setRole("teacher");
    }
    if (role === "admin") {
      setRole("admin");
    }

    if (role === "student") {
      setRole("student");
    }
  };
  const handleLogin = async (email, password, role) => {
    try {
      const isValidRole = await validateUserRole(email, password, role);
      if (!isValidRole) {
        return "Invalid role for the given email.";
      }
      localStorage.setItem("userRole", role);
      setRole(role);
      if (role === "teacher") {
        navigate("/");
      }
      if (role === "admin") {
        navigate("/");
      }

      if (role === "student") {
        navigate("/");
      }
    } catch (error) {
      return "An error occurred while validating the user role.";
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<UserForm onLogin={handleLogin} />} />
      <Route path="/teacher-dashboard" element={<Attendance />} />
      {/*
      <Route path="/classes" element={<div>Classes Screen</div>} />
      <Route path="/students" element={<div>Students Screen</div>} />
      <Route path="/grades" element={<div>Grades Screen</div>} />
      <Route path="/settings" element={<div>Settings Screen</div>} />
      <Route path="/" element={<MainScreen user={user} />} />*/}
    </Routes>
  );
};

export default MainApp;
