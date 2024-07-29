import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import UserForm from './Auth/UserForm';
import MainScreen from './Components/MainAppComp';
import { validateUserRole } from './ApiCalls/ValidateApi';

const MainApp = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (email, password, role) => {
    try {
      const isValidRole = await validateUserRole(email, password, role);
      if (!isValidRole) {
        return 'Invalid role for the given email.';
      }
      // Assuming validateUserRole also returns user details, otherwise you need to fetch user details here
      //setUser({ firstName: 'John', lastName: 'Doe' }); // Replace with actual user data
      navigate('/'); // Navigate to main screen
    } catch (error) {
      return 'An error occurred while validating the user role.';
    }
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Row className="justify-content-md-center w-100">
              <Col md={6} lg={4}>
                <UserForm onLogin={handleLogin} />
              </Col>
            </Row>
          </Container>
        }
      />
      {/*<Route path="/classes" element={<div>Classes Screen</div>} />
      <Route path="/students" element={<div>Students Screen</div>} />
      <Route path="/grades" element={<div>Grades Screen</div>} />
      <Route path="/settings" element={<div>Settings Screen</div>} />*/}
      <Route path="/" element={<MainScreen user={user} />} />
    </Routes>
  );
};

export default MainApp;
