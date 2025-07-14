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
  const [expandedReplyIndex, setExpandedReplyIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Format ISO date string to readable format, e.g. "Jul 14, 2025 06:21 AM"
  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    const date = new Date(isoString);
    return date.toLocaleString(undefined, options);
  };

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

  const toggleReplyExpand = (index) => {
    setExpandedReplyIndex(index === expandedReplyIndex ? null : index);
  };

  const confirmDelete = async () => {
    try {
      if (deleteId) {
        await api.delete(`/Feedback/${deleteId}`);

        // Refetch feedback list to get fresh data after deletion
        const feedbackRes = await api.get('/Feedback');
        setFeedbackList(
          feedbackRes.data.map(fb => ({
            ...fb,
            name: passengerMap[fb.passengerId]?.name || 'Unknown',
            email: passengerMap[fb.passengerId]?.email || 'Unknown',
          }))
        );
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

                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Created Time:</span> {formatDateTime(fb.createdTime)}
                  </p>

                  <p className="text-[#BD2D01] font-medium">
                    <span className="text-black font-bold">Message:</span>{' '}
                    {expandedIndex === index
                      ? fb.message
                      : `${fb.message.substring(0, 130)}...`}
                    {fb.message.length > 130 && (
                      <button
                        onClick={() => toggleExpand(index)}
                        className="text-red-700 font-semibold ml-1"
                      >
                        {expandedIndex === index ? 'see less' : 'see more...'}
                      </button>
                    )}
                  </p>
                  {fb.reply && (
                    <div className="mt-2">
                      <p className="text-[#BD2D01] font-bold">Reply:</p>

                      {fb.repliedTime && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">Replied Time:</span> {formatDateTime(fb.repliedTime)}
                        </p>
                      )}

                      <p className="text-black whitespace-pre-line">
                        {expandedReplyIndex === index
                          ? fb.reply
                          : `${fb.reply.substring(0, 130)}...`}
                        {fb.reply.length > 130 && (
                          <button
                            onClick={() => toggleReplyExpand(index)}
                            className="text-red-700 font-semibold ml-1"
                          >
                            {expandedReplyIndex === index ? 'see less' : 'see more...'}
                          </button>
                        )}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-3 mt-2 text-[#BD2D01]">
                  <FaTrash
                    className="cursor-pointer text-2xl hover:text-red-700"
                    onClick={() => setDeleteId(fb.feedbackId)}
                    title="Delete"
                  />
                  {!fb.reply && (
                    <FaReply
                      className="cursor-pointer text-2xl hover:text-blue-600"
                      onClick={() => handleReply(fb)}
                      title="Reply"
                    />
                  )}
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
