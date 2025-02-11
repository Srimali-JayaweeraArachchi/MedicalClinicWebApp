import axios from 'axios';

const API_URL = "http://localhost:8070/api/auth/"; // Replace with your backend URL

import jwt_decode from 'jwt-decode';

const getFullNameFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwt_decode(token); // Decode the token
    return decodedToken.name; // Extract the name field
  }
  return null;
};

const fullName = getFullNameFromToken();
console.log("Full Name:", fullName);


// Login function
const login = (email, password) => {
  return axios
    .post(API_URL + 'login', { email, password })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    })
    .catch((error) => {
      console.error('Login error:', error.response.data);
      throw error.response.data; // Throw error for handling in the component
    });
};

// Logout function
const logout = () => {
  localStorage.removeItem('user');
};

// Get current user function
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Export the auth service methods
export default {
  login,
  logout,
  getCurrentUser
};
