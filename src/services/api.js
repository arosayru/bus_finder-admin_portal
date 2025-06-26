import axios from 'axios';

const API_BASE_URL = 'https://bus-finder-sl-a7c6a549fbb1.herokuapp.com/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all admins from the backend
const fetchAdmins = () => {
  return api.get('/admin');
};

export { fetchAdmins };

export default api;