import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_id');
    if (!isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return children;
};

export default ProtectedRoute;
