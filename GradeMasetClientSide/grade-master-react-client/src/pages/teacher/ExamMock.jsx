import React, { useState } from "react";
import { Container, Table, Button } from "react-bootstrap";

const ExamMock = () => {
  // Mock data for exams
  const [exams, setExams] = useState([
    {
      id: 1,
      courseId: 101,
      courseName: "Mathematics",
      examName: "Midterm Exam",
      examDate: "2024-03-15",
      roomNum: "101A",
    },
    {
      id: 2,
      courseId: 102,
      courseName: "Physics",
      examName: "Final Exam",
      examDate: "2024-05-20",
      roomNum: "102B",
    },
    {
      id: 3,
      courseId: 103,
      courseName: "Chemistry",
      examName: "Lab Exam",
      examDate: "2024-04-18",
      roomNum: "Lab 5",
    },
  ]);

  // Placeholder for adding a new exam
  const handleAddExam = () => {
    console.log("Add exam clicked!");
  };

  return (
    <Container>
      <h1>Exams</h1>
      <Button onClick={handleAddExam} className="mb-3">
        Add Exam
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Exam Name</th>
            <th>Exam Date</th>
            <th>Room Number</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id}>
              <td>{exam.courseName}</td>
              <td>{exam.examName}</td>
              <td>{exam.examDate}</td>
              <td>{exam.roomNum}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ExamMock;
