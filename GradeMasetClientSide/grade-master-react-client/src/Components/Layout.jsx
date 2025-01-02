import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Container, Row, Col } from "react-bootstrap";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

const Layout = () => {
  const navigate = useNavigate();
  const firstName = localStorage.getItem("firstName") || "John";
  const lastName = localStorage.getItem("lastName") || "Doe";

  const handleLogout = () => {
    // Fetch the role from localStorage
    const role = localStorage.getItem("role");

    // Remove common user-related data
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");

    // Remove teacher-specific data if the role is "teacher"
    if (role === "teacher") {
      localStorage.removeItem("teacherId");
    }

    localStorage.removeItem("role");

    // Redirect to the login page
    navigate("/login");
  };
  return (
    <Container fluid style={{ height: "100vh", overflow: "hidden" }}>
      {/* Upper bar */}
      <Navbar
        bg="dark"
        variant="dark"
        className="d-flex justify-content-between px-3 py-2"
        style={{ height: "60px" }}
      >
        <Navbar.Brand className="d-flex align-items-center">
          <img
            alt="App Logo"
            src="/GradeMasterLogo.png"
            style={{
              width: "40px",
              height: "40px",
              marginRight: "10px",
              borderRadius: "5px",
            }}
          />
          <span>Grade Master</span>
        </Navbar.Brand>
        <Nav>
          <Nav.Link
            onClick={() => navigate("/home")}
            style={{
              color: "white",
              fontSize: "1rem",
              marginRight: "15px",
              cursor: "pointer",
            }}
          >
            Home
          </Nav.Link>
          <Nav.Item className="d-flex align-items-center">
            <FaUser className="me-2 text-white" />
            <span
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              {`${firstName} ${lastName}`}
            </span>
            <Button
              variant="link"
              className="text-light ms-3"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-1" />
              Log out
            </Button>
          </Nav.Item>
        </Nav>
      </Navbar>

      {/* Layout with sidebar */}
      <Row className="m-0">
        {/* Sidebar */}
        <Col
          md={2}
          style={{
            backgroundColor: "#f8f9fa",
            borderRight: "1px solid #ddd",
            padding: "20px 10px",
          }}
        >
          <Nav className="flex-column">
            <Nav.Link
              onClick={() => navigate("/adminTeachersEdit")}
              style={{
                marginBottom: "15px",
                fontSize: "1.1rem",
                color: "#333",
                cursor: "pointer",
              }}
            >
              EditTeachers
            </Nav.Link>

            <Nav.Link
              onClick={() => navigate("/adminStudentsEdit")}
              style={{
                marginBottom: "15px",
                fontSize: "1.1rem",
                color: "#333",
                cursor: "pointer",
              }}
            >
              EditStudents
            </Nav.Link>

            <Nav.Link
              onClick={() => navigate("/home")}
              style={{
                marginBottom: "15px",
                fontSize: "1.1rem",
                color: "#333",
                cursor: "pointer",
              }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/attendance")}
              style={{
                marginBottom: "15px",
                fontSize: "1.1rem",
                color: "#333",
                cursor: "pointer",
              }}
            >
              Attendance
            </Nav.Link>

            <Nav.Link
              onClick={() => navigate("/assignments")}
              style={{
                marginBottom: "15px",
                fontSize: "1.1rem",
                color: "#333",
                cursor: "pointer",
              }}
            >
              Assignments
            </Nav.Link>

            <Nav.Link
              onClick={() => navigate("/submissions")}
              style={{
                marginBottom: "15px",
                fontSize: "1.1rem",
                color: "#333",
                cursor: "pointer",
              }}
            >
              Submissions
            </Nav.Link>

            <Nav.Link
              onClick={() => navigate("/exams")}
              style={{
                marginBottom: "15px",
                fontSize: "1.1rem",
                color: "#333",
                cursor: "pointer",
              }}
            >
              Exams
            </Nav.Link>

            <Nav.Link
              onClick={() => navigate("/grade-settings")}
              style={{
                marginBottom: "15px",
                fontSize: "1.1rem",
                color: "#333",
                cursor: "pointer",
              }}
            >
              Grade Settings
            </Nav.Link>

            <Nav.Link
              onClick={() => navigate("/enrollmentsSet")}
              style={{
                marginBottom: "15px",
                fontSize: "1.1rem",
                color: "#333",
                cursor: "pointer",
              }}
            >
              Enrollments
            </Nav.Link>

            <Nav.Link
              onClick={() => navigate("/finalGrades")}
              style={{
                marginBottom: "15px",
                fontSize: "1.1rem",
                color: "#333",
                cursor: "pointer",
              }}
            >
              Final Grade
            </Nav.Link>
          </Nav>
        </Col>

        {/* Dynamic content */}
        <Col
          md={10}
          style={{
            padding: "20px",
            backgroundColor: "#ffffff",
            overflowY: "auto",
            height: "calc(100vh - 60px)",
          }}
        >
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
