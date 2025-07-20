import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  FaBell, FaBus, FaExclamationTriangle, FaCommentDots, FaArrowLeft, FaTimes, FaTrash
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  subscribeToNotifications,
  unsubscribeFromNotifications
} from '../services/notificationService';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  // ✅ Load notifications from localStorage
  const loadNotifications = () => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
      } catch (err) {
        console.error('Failed to parse localStorage notifications:', err);
      }
    }
  };

  // ✅ On mount & when page becomes active
  useEffect(() => {
    loadNotifications();
    sessionStorage.setItem('lastViewedNotificationTime', new Date().toISOString());

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadNotifications();
        sessionStorage.setItem('lastViewedNotificationTime', new Date().toISOString());
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // ✅ Listen to storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'notifications') {
        loadNotifications();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ✅ Handle new notifications from SignalR
  useEffect(() => {
    const handleNew = (notification) => {
      setNotifications((prev) => {
        const updated = [notification, ...prev];
        localStorage.setItem('notifications', JSON.stringify(updated));
        return updated;
      });
    };

    subscribeToNotifications(handleNew);
    return () => unsubscribeFromNotifications(handleNew);
  }, []);

  const handleRemove = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'starts':
      case 'ends': return <FaBus className="text-2xl mr-2" />;
      case 'emergency': return <FaExclamationTriangle className="text-2xl mr-2" />;
      case 'feedback': return <FaCommentDots className="text-2xl mr-2" />;
      default: return null;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'emergency') return n.type === 'emergency';
    if (filter === 'shift') return n.type === 'starts' || n.type === 'ends';
    if (filter === 'feedback') return n.type === 'feedback';
    return true;
  });

  const filterButtons = [
    { label: 'All', value: 'all' },
    { label: 'Emergency Alerts', value: 'emergency' },
    { label: 'Shift Alerts', value: 'shift' },
    { label: 'Feedbacks', value: 'feedback' },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 pt-4 px-6">
        <div className="sticky top-0 z-10 bg-white border-b pb-2 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#BD2D01] font-bold text-xl">
              <FaArrowLeft
                className="cursor-pointer hover:text-orange-800"
                onClick={() => navigate(-1)}
              />
              <span>Notifications</span>
            </div>
            <FaBell className="text-[#D44B00] text-2xl mr-4" />
          </div>

          <div className="flex justify-center mt-4 flex-wrap gap-3">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-4 py-1.5 border-2 rounded-full font-semibold text-sm ${
                  filter === btn.value
                    ? 'bg-gradient-to-r from-[#D44B00] to-[#BD2D01] text-white'
                    : 'border-[#D44B00] text-[#D44B00]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {notifications.length > 0 && (
            <div className="flex justify-center mt-2">
              <button
                onClick={handleClearAll}
                className="ml-auto flex items-center text-xs px-3 py-1 border border-[#D44B00] text-[#D44B00] rounded hover:text-white hover:bg-[#D44B00]"
              >
                <FaTrash className="mr-1" />
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 mb-4 space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center text-gray-500 py-12 text-sm italic">
              No notifications available
            </div>
          ) : (
            filteredNotifications.map((note) => (
              <div
                key={note.id}
                className="bg-orange-300 p-4 rounded-md shadow flex justify-between items-start relative"
              >
                <div className="flex">
                  {getIcon(note.type)}
                  <div>
                    {note.type === 'feedback' ? (
                      <>
                        <p className="font-bold">Passenger Feedback</p>
                        <p><span className="font-bold">Subject:</span> {note.subject}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold">{note.route}</p>
                        <p>{note.message}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-sm text-right min-w-[130px] pl-4 pt-8">
                  <p><span className="font-bold">Date:</span> {note.date}</p>
                  <p><span className="font-bold">Time:</span> {note.time}</p>
                </div>
                <FaTimes
                  onClick={() => handleRemove(note.id)}
                  className="absolute top-2 right-3 text-white text-lg cursor-pointer hover:text-red-500"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
