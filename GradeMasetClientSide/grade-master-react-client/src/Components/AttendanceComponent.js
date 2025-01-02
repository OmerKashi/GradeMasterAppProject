import React, { useEffect, useState } from "react";
import AttendanceApi from "./api/AttendanceApi";

function AttendanceComponent() {
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    try {
      const response = await AttendanceApi.getAllAttendances();
      setAttendances(response.data);
    } catch (error) {
      console.error("Failed to fetch attendances:", error);
    }
  };

  // Additional methods to handle update, delete, and create...

  return (
    <div>
      <h1>Attendance Records</h1>
      {/* Render attendances here */}
    </div>
  );
}

export default AttendanceComponent;
