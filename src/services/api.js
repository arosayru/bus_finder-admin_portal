import axios from 'axios';

const API_BASE_URL = 'https://bus-finder-sl-a7c6a549fbb1.herokuapp.com/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
