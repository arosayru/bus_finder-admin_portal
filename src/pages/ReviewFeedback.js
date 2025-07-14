import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { FaTrash, FaReply } from 'react-icons/fa';
import DeleteFeedback from '../components/DeleteFeedback';
import api from '../services/api';

const ReviewFeedback = () => {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState([]);
  const [passengerMap, setPassengerMap] = useState({});
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch feedback and passenger data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedbackRes, passengerRes] = await Promise.all([
          api.get('/Feedback'),
          api.get('/passenger'),
        ]);

        // Map passengerId to passenger info
        const passengerData = passengerRes.data.reduce((map, p) => {
          map[p.passengerId] = {
            name: `${p.firstName} ${p.lastName}`,
            email: p.email,
          };
          return map;
        }, {});

        const fullFeedbackList = feedbackRes.data.map(fb => ({
          ...fb,
          name: passengerData[fb.passengerId]?.name || 'Unknown',
          email: passengerData[fb.passengerId]?.email || 'Unknown',
        }));

        setPassengerMap(passengerData);
        setFeedbackList(fullFeedbackList);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleReply = (feedback) => {
    navigate('/reply-feedback', { state: feedback });
  };

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const confirmDelete = async () => {
    try {
      if (deleteId) {
        await api.delete(`/Feedback/${deleteId}`);
        setFeedbackList(prev => prev.filter(fb => fb.feedbackId !== deleteId));
      }
    } catch (err) {
      console.error('Error deleting feedback:', err);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 pt-20 px-6">
        <Topbar />
        <div className="mt-8 rounded-xl border border-orange-300 overflow-hidden">
          <div className="bg-[#F67F00] text-white text-lg font-semibold px-6 py-3">
            {/* Optional Title */}
          </div>
          <div style={{ maxHeight: '580px', overflowY: 'auto' }}>
            {feedbackList.map((fb, index) => (
              <div
                key={fb.feedbackId}
                className="flex justify-between items-start px-6 py-4 border-t border-orange-300 bg-orange-100 hover:bg-orange-200 transition"
              >
                <div>
                  <p><span className="font-bold">Name:</span> {fb.name}</p>
                  <p><span className="font-bold">Email:</span> {fb.email}</p>
                  <p><span className="font-bold">Subject:</span> {fb.subject}</p>
                  <p className="text-[#BD2D01] font-medium">
                    <span className="text-black font-bold">Message:</span>{' '}
                    {expandedIndex === index
                      ? fb.message
                      : `${fb.message.substring(0, 130)}... `}
                    {fb.message.length > 130 && (
                      <button
                        onClick={() => toggleExpand(index)}
                        className="text-red-700 font-semibold ml-1"
                      >
                        {expandedIndex === index ? 'see less' : 'see more...'}
                      </button>
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 mt-2 text-[#BD2D01]">
                  <FaTrash
                    className="cursor-pointer text-2xl hover:text-red-700"
                    onClick={() => setDeleteId(fb.feedbackId)}
                    title="Delete"
                  />
                  <FaReply
                    className="cursor-pointer text-2xl hover:text-blue-600"
                    onClick={() => handleReply(fb)}
                    title="Reply"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {deleteId && (
          <DeleteFeedback
            onCancel={() => setDeleteId(null)}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewFeedback;
