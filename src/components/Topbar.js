import React from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <div className="fixed left-64 right-0 top-0 px-6 py-4 flex justify-end items-center border-b border-gray-300 bg-white z-20">
      <div
        onClick={handleNotificationClick}
        className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background:
            'linear-gradient(to bottom, #BD2D01 0%, #CF4602 10%, #F67F00 50%, #CF4602 90%, #BD2D01 100%)',
        }}
      >
        <FaBell className="text-white text-lg" />
      </div>
    </div>
  );
};

export default Topbar;
