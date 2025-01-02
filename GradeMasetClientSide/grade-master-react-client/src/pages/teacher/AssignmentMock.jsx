import React, { useState } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";

const AssignmentsMock = () => {
  // Mock data for assignments, structured according to the DB model
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      courseId: 101,
      courseName: "Mathematics",
      title: "Linear Algebra Homework",
      description: "Complete all exercises on page 42.",
      dueDate: "2024-01-10",
    },
    {
      id: 2,
      courseId: 102,
      courseName: "Physics",
      title: "Project on Newton's Laws",
      description: "Prepare a presentation on Newton's three laws of motion.",
      dueDate: "2024-02-15",
    },
    {
      id: 3,
      courseId: 103,
      courseName: "Literature",
      title: "Read Macbeth",
      description: "Read the play and prepare for the discussion.",
      dueDate: "2024-01-24",
    },
  ]);

  // Placeholder for adding a new assignment
  const handleAddAssignment = () => {
    console.log("Add assignment clicked!");
  };

  return (
    <Container>
      <h1>Assignments</h1>
      <Button onClick={handleAddAssignment} style={{ marginBottom: "20px" }}>
        Add Assignment
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.courseName}</td>
              <td>{assignment.title}</td>
              <td>{assignment.description}</td>
              <td>{assignment.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AssignmentsMock;
