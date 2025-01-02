import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const Home = () => {
  return (
    <Container fluid style={{ padding: "20px" }}>
      <h3>Welcome to Grade Master!</h3>
      <Row>
        {/* Upcoming Exams */}
        <Col md={6}>
          <Card style={{ marginBottom: "20px" }}>
            <Card.Header>Upcoming Exams</Card.Header>
            <Card.Body>
              <p>
                <strong>Java 101 Exam</strong>
              </p>
              <p>Date: 11/5/2024</p>
              <p>Description: Introduction to Java</p>
            </Card.Body>
          </Card>
        </Col>

        {/* Upcoming Assignments */}
        <Col md={6}>
          <Card style={{ marginBottom: "20px" }}>
            <Card.Header>Upcoming Assignments</Card.Header>
            <Card.Body>
              <p>
                <strong>Java Assignment</strong>
              </p>
              <p>Due: 11/4/2024</p>
              <p>Description: Introduction to Java</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
