import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import EmailVerification from './pages/EmailVerification';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import StaffManagement from './pages/StaffManagement';
import AdminManagement from './pages/AdminManagement';
import BusManagement from './pages/BusManagement';
import RouteManagement from './pages/RouteManagement';
import ShiftManagement from './pages/ShiftManagement';
import ReviewFeedback from './pages/ReviewFeedback';
import ReplyFeedback from './pages/ReplyFeedback';
import Settings from './pages/Setting';
//import Notifications from './pages/Notifications';

import { initNotificationHub } from './services/notificationService';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    initNotificationHub();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
        <Route path="/verify-email" element={<ProtectedRoute><EmailVerification /></ProtectedRoute>} />
        <Route path="/reset-password" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/passenger-details" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        <Route path="/staff-management" element={<ProtectedRoute><StaffManagement /></ProtectedRoute>} />
        <Route path="/admin-management" element={<ProtectedRoute><AdminManagement /></ProtectedRoute>} />
        <Route path="/bus-management" element={<ProtectedRoute><BusManagement /></ProtectedRoute>} />
        <Route path="/route-management" element={<ProtectedRoute><RouteManagement /></ProtectedRoute>} />
        <Route path="/shift-management" element={<ProtectedRoute><ShiftManagement /></ProtectedRoute>} />
        <Route path="/review-feedback" element={<ProtectedRoute><ReviewFeedback /></ProtectedRoute>} />
        <Route path="/reply-feedback" element={<ProtectedRoute><ReplyFeedback /></ProtectedRoute>} />
        {/* <Route path="/notifications" element={<Notifications />} /> */}
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
