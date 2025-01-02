import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [step, setStep] = useState("roleSelection");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    // Student-specific fields
    dateOfBirth: "",
    gender: "",
    address: "",
    enrollmentDate: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelection = (role) => {
    setFormData({ ...formData, role });
    setStep("formFilling");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "https://localhost:7226/api/Auth/Register",
        formData
      );
      setSuccess("Registration completed successfully!");
      setFormData({
        email: "",
        password: "",
        role: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        enrollmentDate: "",
      });
      setStep("roleSelection");
    } catch (error) {
      setError(
        error.response?.data || "An error occurred during registration."
      );
    }
  };

  if (step === "roleSelection") {
    return (
      <div>
        <h2>Select Your Role</h2>
        <button onClick={() => handleRoleSelection("student")}>Student</button>
        <button onClick={() => handleRoleSelection("teacher")}>Teacher</button>
        <button onClick={() => handleRoleSelection("admin")}>Admin</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Register as {formData.role === "student" ? "Student" : "Teacher"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        {formData.role === "student" && (
          <>
            <div>
              <label htmlFor="dateOfBirth">Date of Birth:</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="enrollmentDate">Enrollment Date:</label>
              <input
                type="date"
                id="enrollmentDate"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit">Register</button>
      </form>
      <button onClick={() => setStep("roleSelection")}>
        Back to Role Selection
      </button>
    </div>
  );
};

export default RegisterForm;
