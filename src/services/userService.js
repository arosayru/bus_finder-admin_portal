import api from './api';

export const loginAdmin = async (Email, Password) => {
  try {
    const response = await api.post('/admin/login', {
      Email,
      Password,
    });

    return response.data;
  } catch (error) {
    // Optional: log the full error for debugging
    console.error('Login error:', error.response || error.message);
    throw error.response?.data?.message || 'Login failed';
  }
};
