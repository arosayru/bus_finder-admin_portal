import axios from 'axios';

const API_BASE_URL = 'http://localhost:5176/api'; // Adjust your backend port

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
