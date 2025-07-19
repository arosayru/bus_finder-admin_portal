import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  FaBell,
  FaBus,
  FaExclamationTriangle,
  FaCommentDots,
  FaArrowLeft,
  FaTimes,
  FaTrashAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
      } catch (err) {
        console.error('Failed to parse notifications from localStorage:', err);
      }
    }
  }, []);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://bus-finder-sl-a7c6a549fbb1.herokuapp.com/notificationhub', {
        transport: signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.start()
      .then(() => {
        console.log('✅ SignalR connected');

        const addNotification = (newNotification) => {
          setNotifications(prev => {
            const updated = [newNotification, ...prev];
            localStorage.setItem('notifications', JSON.stringify(updated));
            return updated;
          });
        };

        const getNow = () => {
          const now = new Date();
          return {
            date: now.toLocaleDateString('en-GB'),
            time: now.toLocaleTimeString('en-US'),
          };
        };

        connection.on('BusSOS', (message) => {
          const { date, time } = getNow();
          addNotification({
            id: Date.now(),
            type: 'emergency',
            route: 'SOS Alert',
            message,
            date,
            time
          });
        });

        connection.on('FeedbackReceived', (message) => {
          const feedbackText = typeof message === 'string'
            ? message.split(':')[1]?.trim() || message
            : 'Feedback received';
          const { date, time } = getNow();
          addNotification({
            id: Date.now(),
            type: 'feedback',
            subject: feedbackText,
            date,
            time
          });
        });

        connection.on('ShiftStarted', (message) => {
          const { date, time } = getNow();
          addNotification({
            id: Date.now(),
            type: 'starts',
            route: 'Shift Started',
            message,
            date,
            time
          });
        });

        connection.on('ShiftInterval', (message) => {
          const { date, time } = getNow();
          addNotification({
            id: Date.now(),
            type: 'starts',
            route: 'Shift Interval',
            message,
            date,
            time
          });
        });

        connection.on('ShiftEnded', (message) => {
          const { date, time } = getNow();
          addNotification({
            id: Date.now(),
            type: 'ends',
            route: 'Shift Ended',
            message,
            date,
            time
          });
        });
      })
      .catch(err => {
        console.error('❌ SignalR connection error:', err);
      });

    return () => connection.stop();
  }, []);

  const handleRemove = (id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAll = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

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

  const filteredNotifications = notifications.filter((note) => {
    if (filter === 'All') return true;
    if (filter === 'Emergency Alerts') return note.type === 'emergency';
    if (filter === 'Shift Alerts') return note.type === 'starts' || note.type === 'ends';
    if (filter === 'Feedbacks') return note.type === 'feedback';
    return true;
  });

  const buttonClass = (type) =>
    `px-4 py-2 rounded-full border-2 font-bold text-[#BD2D01] ${
      filter === type
        ? 'bg-gradient-to-b from-[#F67F00] to-[#D44B00] text-white border-transparent'
        : 'border-[#D44B00] hover:bg-orange-100'
    }`;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 pt-4 px-6">
        {/* Sticky Combined Header + Filter + Clear */}
        <div className="sticky top-0 z-30 bg-white border-b pt-4 pb-4 px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 text-[#BD2D01] font-bold text-xl">
              <FaArrowLeft
                className="cursor-pointer hover:text-orange-800"
                onClick={() => navigate(-1)}
              />
              <span>Notifications</span>
            </div>
            <FaBell className="text-[#D44B00] text-2xl mr-4" />
          </div>

          {/* Filter + Clear All */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4 ml-64">
              {['All', 'Emergency Alerts', 'Shift Alerts', 'Feedbacks'].map((type) => (
                <button
                  key={type}
                  className={buttonClass(type)}
                  onClick={() => setFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 border border-red-500 px-3 py-1 rounded"
              >
                <FaTrashAlt />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="mt-6 mb-4 space-y-4">
          {filteredNotifications.length === 0 ? (
            <p className="text-center text-gray-500">No notifications available.</p>
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
