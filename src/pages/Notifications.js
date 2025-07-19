import React, { useState, useEffect } from 'react';
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

  // Connect to SignalR
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://bus-finder-sl-a7c6a549fbb1.herokuapp.com/notificationhub')
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log('SignalR connected to notificationhub');
        connection.on('ReceiveNotification', (message) => {
          console.log('Received SignalR notification:', message);

          // Add new SOS notification to the top of the list
          const now = new Date();
          const formattedDate = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
          const formattedTime = now.toLocaleTimeString('en-US'); // hh:mm AM/PM

          const newNotification = {
            id: Date.now(),
            type: 'emergency',
            route: 'SOS Alert',
            message: message,
            date: formattedDate,
            time: formattedTime
          };

          setNotifications((prev) => [newNotification, ...prev]);
        });
      })
      .catch((err) => console.error('SignalR connection error:', err));

    return () => {
      connection.stop();
    };
  }, []);

  const handleRemove = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
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
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-white border-b pb-2 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#BD2D01] font-bold text-xl">
              <FaArrowLeft
                className="cursor-pointer hover:text-orange-800"
                onClick={() => navigate(-1)}
              />
              <span>Notifications</span>
            </div>
            <div>
              <FaBell className="text-[#D44B00] text-2xl mr-4" />
            </div>
          </div>
        </div>

        {/* Notification List */}
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
                      <p className="font-bold">User Feedback</p>
                      <p><span className="font-bold">Name:</span> {note.name}</p>
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
