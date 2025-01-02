import React, { useState } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";

const UserForm = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = credentials;

    if (!email || !password || !role) {
      setError("All fields are required.");
      return;
    }

    const loginError = await onLogin(email, password, role);
    if (loginError) {
      setError(loginError);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        backgroundColor: "lightblue",
        borderRadius: "10px",
      }}
    >
      <Row className="justify-content-md-center w-100">
        <Col md={6} lg={4}>
          <Card
            className="p-4"
            style={{
              minWidth: "300px",
            }}
          >
            <Card.Body>
              <h2 className="text-center mb-4">Log in</h2>
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={credentials.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formRole" className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    value={credentials.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  Log in
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserForm;
