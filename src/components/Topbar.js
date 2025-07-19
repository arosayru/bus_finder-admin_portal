import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // Detect changes in localStorage notifications
  useEffect(() => {
    const checkNotifications = () => {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const lastViewed = sessionStorage.getItem('lastViewedNotificationTime');
          const lastNotification = parsed[0];

          if (
            lastNotification &&
            (!lastViewed || new Date(lastNotification.id) > new Date(lastViewed))
          ) {
            setHasNewNotification(true);
          }
        } catch (err) {
          console.error('Failed to check notifications:', err);
        }
      }
    };

    checkNotifications();

    const listener = () => {
      checkNotifications();
    };

    window.addEventListener('storage', listener);

    return () => window.removeEventListener('storage', listener);
  }, []);

  // Reset indicator when navigating to notifications
  const handleNotificationClick = () => {
    sessionStorage.setItem('lastViewedNotificationTime', new Date().toISOString());
    setHasNewNotification(false);
    navigate('/notifications');
  };

  return (
    <div className="fixed left-64 right-0 top-0 px-6 py-4 flex justify-end items-center border-b border-gray-300 bg-white z-20">
      <div
        onClick={handleNotificationClick}
        className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer relative"
        style={{
          background:
            'linear-gradient(to bottom, #BD2D01 0%, #CF4602 10%, #F67F00 50%, #CF4602 90%, #BD2D01 100%)',
        }}
      >
        <FaBell className="text-white text-lg" />
        {hasNewNotification && (
          <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white" />
        )}
      </div>
    </div>
  );
};

export default Topbar;
