import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaBell, FaBus, FaExclamationTriangle, FaCommentDots, FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'departure',
      route: 'No. 05',
      message: 'Departure at 9.16 a.m',
      date: '01/06/2026',
      time: '9.16 a.m'
    },
    {
      id: 2,
      type: 'arrival',
      route: 'No. 05',
      message: 'Arrival at 11.46 a.m',
      date: '01/06/2026',
      time: '11.46 a.m'
    },
    {
      id: 3,
      type: 'emergency',
      route: 'No. 05 Kurunagala - Colombo',
      message: 'The bus has broken down near Polgahawela',
      date: '01/06/2026',
      time: '9.16 a.m'
    },
    {
      id: 4,
      type: 'feedback',
      name: 'John Rubic',
      subject: 'Urgent Concern: Unsafe Driving...',
      date: '01/06/2026',
      time: '9.16 a.m'
    }
  ]);

  const handleRemove = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'departure':
      case 'arrival':
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
        <div className="flex items-center justify-between border-b pb-2">
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
