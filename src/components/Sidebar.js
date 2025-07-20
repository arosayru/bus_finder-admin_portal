import React, { useEffect, useState } from 'react';
import {
  FaUser,
  FaUsers,
  FaShieldAlt,
  FaBus,
  FaRoute,
  FaClock,
  FaComments,
  FaCog,
  FaSignOutAlt,
  FaThLarge,
  FaUserCircle,
} from 'react-icons/fa';
import { HiShieldCheck } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState(localStorage.getItem('admin_name') || 'Admin');

  useEffect(() => {
    const fetchAdminInfo = async () => {
      const adminId = localStorage.getItem('admin_id');
      if (!adminId) return;

      if (!localStorage.getItem('admin_name')) {
        try {
          const response = await api.get('/admin');
          const admin = response.data.find((a) => a.adminId === adminId);
          if (admin) {
            const fullName = `${admin.firstName} ${admin.lastName}`;
            setAdminName(fullName);
            localStorage.setItem('admin_name', fullName);
          }
        } catch (err) {
          console.error('Failed to fetch admin details:', err);
        }
      }
    };

    fetchAdminInfo();
  }, []);

  const navItems = [
    { icon: <FaThLarge />, label: 'Dashboard', path: '/dashboard' },
    { icon: <HiShieldCheck />, label: 'Admin Management', path: '/admin-management' },
    { icon: <FaUsers />, label: 'Staff Management', path: '/staff-management' },
    { icon: <FaUser />, label: 'Passengers', path: '/passenger-details' },
    { icon: <FaRoute />, label: 'Route Management', path: '/route-management' },
    { icon: <FaBus />, label: 'Bus Management', path: '/bus-management' },
    { icon: <FaClock />, label: 'Shift Management', path: '/shift-management' },
    { icon: <FaComments />, label: 'Review Feedback', path: '/review-feedback' },
    { icon: <FaCog />, label: 'Setting', path: '/settings' },
  ];

  return (
    <div className="bg-[#F67F00] text-white w-64 min-h-screen p-4 flex flex-col justify-between fixed left-0 top-0 z-10">
      <div>
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white text-[#F67F00] rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold overflow-hidden">
            <FaUserCircle className="text-5xl" />
          </div>
          <p className="mt-2 font-semibold text-lg text-center">{adminName}</p>
        </div>

        <div className="space-y-3">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      </div>

      <button
        className="px-4 py-2 rounded-md flex items-center justify-center gap-2 font-semibold w-full border border-[#8A1E00] shadow-inner"
        style={{
          background:
            'linear-gradient(to right, #BD2D01 0%, #CF4602 10%, #F67F00 50%, #CF4602 90%, #BD2D01 100%)',
        }}
        onClick={() => {
          localStorage.clear();
          navigate('/');
        }}
      >
        <FaSignOutAlt /> Log out
      </button>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition font-medium ${
      active
        ? 'bg-gradient-to-r from-[#BD2D01] via-[#F67F00] to-[#BD2D01]'
        : 'bg-[#F67F00] hover:bg-[#CF4602]'
    }`}
  >
    {icon}
    <span>{label}</span>
  </div>
);

export default Sidebar;
