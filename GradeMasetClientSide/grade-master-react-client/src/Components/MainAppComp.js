import React from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MainScreen = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic here
    console.log('User logged out');
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>Hello {user.firstName} {user.lastName}</Navbar.Brand>
          <Nav className="ml-auto">
            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Row className="justify-content-md-center">
          <Col md={4} className="mb-4">
            <Card onClick={() => navigate('/classes')} className="text-center shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <Card.Title>Classes</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card onClick={() => navigate('/students')} className="text-center shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <Card.Title>Students</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card onClick={() => navigate('/grades')} className="text-center shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <Card.Title>Grades</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card onClick={() => navigate('/settings')} className="text-center shadow-sm" style={{ borderRadius: '15px' }}>
              <Card.Body>
                <Card.Title>Settings</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MainScreen;
