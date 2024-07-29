import axios from 'axios';

const API_URL = 'https://localhost:3000/api'; // My API URL

export const validateUserRole = async (email, password, role) => {
    try {
      const response = await axios.post(`${API_URL}/validateUserRole`, { email, password, role });
      return response.data.isValid;
    } catch (error) {
      console.error('Error validating user role:', error);
      throw error;
    }
  };