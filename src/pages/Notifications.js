import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import {
  FaBell,
  FaBus,
  FaExclamationTriangle,
  FaCommentDots,
  FaArrowLeft,
  FaTimes,
  FaTrash
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const connectionRef = useRef(null);
  const isMounted = useRef(true);
  const isStarting = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse notifications from localStorage:', err);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://bus-finder-sl-a7c6a549fbb1.herokuapp.com/notificationhub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;

    const now = () => {
      const n = new Date();
      return {
        date: n.toLocaleDateString('en-GB'),
        time: n.toLocaleTimeString('en-US'),
      };
    };

    const addNotification = (n) => {
      setNotifications(prev => {
        const updated = [n, ...prev];
        localStorage.setItem('notifications', JSON.stringify(updated));
        return updated;
      });
    };

    const setupHandlers = () => {
      connection.on('BusSOS', (message) => {
        const { date, time } = now();
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
        const { date, time } = now();
        addNotification({
          id: Date.now(),
          type: 'feedback',
          subject: feedbackText,
          date,
          time
        });
      });

      connection.on('ShiftStarted', (message) => {
        const { date, time } = now();
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
        const { date, time } = now();
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
        const { date, time } = now();
        addNotification({
          id: Date.now(),
          type: 'ends',
          route: 'Shift Ended',
          message,
          date,
          time
        });
      });
    };

    const startSignalR = async () => {
      isStarting.current = true;
      try {
        await connection.start();
        console.log('✅ SignalR connected');
        if (!isMounted.current) return;
        setupHandlers();
      } catch (err) {
        if (err?.name === 'AbortError' || err?.message?.includes('negotiation')) {
          console.warn('⚠️ SignalR negotiation aborted. Retrying in 5s...');
        } else {
          console.error('❌ SignalR connection error:', err);
        }
        if (isMounted.current) {
          setTimeout(() => startSignalR(), 5000);
        }
      } finally {
        isStarting.current = false;
      }
    };

    startSignalR();

    return () => {
      isMounted.current = false;

      const safeStop = async () => {
        if (isStarting.current) {
          const wait = () =>
            new Promise(resolve => {
              const interval = setInterval(() => {
                if (!isStarting.current) {
                  clearInterval(interval);
                  resolve();
                }
              }, 100);
            });
          await wait();
        }

        if (connection && connection.state !== 'Disconnected') {
          try {
            await connection.stop();
            console.log('🛑 SignalR connection stopped cleanly.');
          } catch (e) {
            console.warn('⚠️ SignalR stop error:', e);
          }
        }
      };

      safeStop();
    };
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

          {/* Filter Section - centered */}
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

          {/* Clear All Button - centered below filters */}
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
