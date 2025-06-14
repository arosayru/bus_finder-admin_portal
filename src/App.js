import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import EmailVerification from './pages/EmailVerification';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import StaffManagement from './pages/StaffManagement';
import BusManagement from './pages/BusManagement';
import RouteManagement from './pages/RouteManagement';
import ShiftManagement from './pages/ShiftManagement';
import ReviewFeedback from './pages/ReviewFeedback';
import ReplyFeedback from './pages/ReplyFeedback';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/staff-management" element={<StaffManagement/>} />
        <Route path="/bus-management" element={<BusManagement/>} />
        <Route path="/route-management" element={<RouteManagement/>} />
        <Route path="/shift-management" element={<ShiftManagement/>} />
        <Route path="/review-feedback" element={<ReviewFeedback/>} />
        <Route path="/reply-feedback" element={<ReplyFeedback />} />
      </Routes>
    </Router>
  );
}

export default App;
