import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import {
  FaBell,
  FaBus,
  FaExclamationTriangle,
  FaCommentDots,
  FaArrowLeft,
  FaTimes
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
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
          console.log('⏳ Waiting for SignalR start to finish before stopping...');
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
        </div>

        <div className="mt-6 space-y-4">
          {notifications.map((note) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
