import React from "react";
import { Table, Form } from "react-bootstrap";

const AttendanceTable = ({ attendanceRecords, setAttendanceRecords }) => {
  const handleStatusChange = (index, newStatus) => {
    const updatedRecords = attendanceRecords.map((record, recordIndex) => {
      if (index === recordIndex) {
        return { ...record, status: newStatus };
      }
      return record;
    });
    setAttendanceRecords(updatedRecords);
  };

  const handleNotesChange = (index, newNotes) => {
    const updatedRecords = attendanceRecords.map((record, recordIndex) => {
      if (index === recordIndex) {
        return { ...record, notes: newNotes };
      }
      return record;
    });
    setAttendanceRecords(updatedRecords);
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Status</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {attendanceRecords.map((record, index) => (
          <tr key={record.studentId}>
            <td>{record.name}</td>
            <td>
              <Form.Control
                as="select"
                value={record.status}
                onChange={(e) => handleStatusChange(index, e.target.value)}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </Form.Control>
            </td>
            <td>
              <Form.Control
                type="text"
                value={record.notes}
                onChange={(e) => handleNotesChange(index, e.target.value)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AttendanceTable;
