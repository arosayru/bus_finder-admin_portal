import React, { useEffect, useState, useRef } from 'react';
import { FaBell, FaBus, FaExclamationTriangle, FaCommentDots, FaTimes, FaTrash } from 'react-icons/fa';
import {
  subscribeToNotifications,
  unsubscribeFromNotifications
} from '../services/notificationService';

const Topbar = () => {
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
        const lastViewed = sessionStorage.getItem('lastViewedNotificationTime');
        if (parsed[0] && (!lastViewed || new Date(parsed[0].id) > new Date(lastViewed))) {
          setHasNewNotification(true);
        }
      } catch (err) {
        console.error('Failed to parse localStorage notifications:', err);
      }
    }

    const handleNew = (notification) => {
      setNotifications((prev) => {
        const updated = [notification, ...prev];
        localStorage.setItem('notifications', JSON.stringify(updated));
        return updated;
      });
      setHasNewNotification(true);
    };

    subscribeToNotifications(handleNew);
    return () => unsubscribeFromNotifications(handleNew);
  }, []);

  const handleNotificationClick = () => {
    const newStatus = !showDropdown;
    setShowDropdown(newStatus);
    if (newStatus) {
      sessionStorage.setItem('lastViewedNotificationTime', new Date().toISOString());
      setHasNewNotification(false);
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const handleRemove = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'emergency') return n.type === 'emergency';
    if (filter === 'shift') return n.type === 'starts' || n.type === 'ends';
    if (filter === 'feedback') return n.type === 'feedback';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'starts':
      case 'ends':
        return <FaBus className="text-2xl mr-2" />;
      case 'emergency':
        return <FaExclamationTriangle className="text-2xl mr-2" />;
      case 'feedback':
        return <FaCommentDots className="text-2xl mr-2" />;
      default:
        return null;
    }
  };

  const filterButtons = [
    { label: 'All', value: 'all' },
    { label: 'Emergency Alerts', value: 'emergency' },
    { label: 'Shift Alerts', value: 'shift' },
    { label: 'Feedbacks', value: 'feedback' }
  ];

  return (
    <div className="fixed left-64 right-0 top-0 px-6 py-4 flex justify-end items-center border-b border-gray-300 bg-white z-20">
      <div className="relative">
        <div
          onClick={handleNotificationClick}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer relative"
          style={{
            background:
              'linear-gradient(to bottom, #BD2D01 0%, #CF4602 10%, #F67F00 50%, #CF4602 90%, #BD2D01 100%)'
          }}
        >
          <FaBell className="text-white text-lg" />
          {hasNewNotification && (
            <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white" />
          )}
        </div>

        {showDropdown && (
          <div ref={dropdownRef} className="absolute right-0 mt-3 w-[400px] bg-white border border-orange-400 rounded-md shadow-lg z-50">
            <div className="p-4 border-b">
              <h2 className="text-[#BD2D01] text-lg font-semibold mb-2">Notifications</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {filterButtons.map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => setFilter(btn.value)}
                    className={`px-3 py-1 border-2 rounded-full text-sm font-semibold ${
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
                <button
                  onClick={handleClearAll}
                  className="ml-auto flex items-center text-xs px-3 py-1 border border-[#D44B00] text-[#D44B00] rounded hover:text-white hover:bg-[#D44B00]"
                >
                  <FaTrash className="mr-1" /> Clear all
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto p-3 space-y-3">
              {filteredNotifications.length === 0 ? (
                <p className="text-center text-gray-500 text-sm italic py-4">No notifications available</p>
              ) : (
                filteredNotifications.map((note) => (
                  <div key={note.id} className="bg-orange-300 p-3 rounded shadow flex justify-between relative">
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
                    <div className="text-xs text-right min-w-[130px] pl-4 pt-8">
                      <p><span className="font-bold">Date:</span> {note.date}</p>
                      <p><span className="font-bold">Time:</span> {note.time}</p>
                    </div>
                    <FaTimes
                      onClick={() => handleRemove(note.id)}
                      className="absolute top-2 right-2 text-white text-sm cursor-pointer hover:text-red-500"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
