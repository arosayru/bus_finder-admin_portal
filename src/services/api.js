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

// Add a new admin to the backend
const addAdmin = (adminData) => {
  return api.post('/admin', adminData);  
};

export { fetchAdmins, addAdmin };

export default api;