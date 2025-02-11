import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8070/api', // Your backend URL
});

// Login function
export const login = (credentials) => API.post('/auth/login', credentials);
