import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaArrowLeft, FaBell } from 'react-icons/fa';
import api from '../services/api';

const ReplyFeedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialFeedback = location.state;

  const [feedback, setFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch full feedback by ID
  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      if (!initialFeedback?.feedbackId) {
        setError('Invalid feedback');
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/Feedback/${initialFeedback.feedbackId}`);
        setFeedback(res.data);
        setReplyMessage(res.data.reply || '');
      } catch (err) {
        setError('Failed to load feedback');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackDetails();
  }, [initialFeedback]);

  const handleSend = async () => {
    if (!replyMessage.trim()) return;

    const adminId = localStorage.getItem('admin_id');
    if (!adminId) {
      setError('Admin ID not found. Please log in again.');
      return;
    }

    try {
      await api.put(`/Feedback/${feedback.feedbackId}/reply`, {
        adminId,
        reply: replyMessage,
      });

      // Update local state to show reply
      setFeedback(prev => ({
        ...prev,
        reply: replyMessage,
      }));
    } catch (err) {
      setError('Failed to send reply');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="ml-64 p-6">Loading...</div>;
  }

  if (error) {
    return <div className="ml-64 p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-64 pt-4 px-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-3 text-[#BD2D01] font-bold text-xl">
            <FaArrowLeft
              className="cursor-pointer hover:text-orange-800"
              onClick={() => navigate('/review-feedback')}
            />
            <span>Review Feedback</span>
          </div>
          <div>
            <FaBell className="text-[#D44B00] text-2xl mr-4" />
          </div>
        </div>

        {/* Feedback Card */}
        <div className="bg-white shadow-md rounded-xl mt-6 p-6 border border-gray-300">
          <p><span className="font-bold">Name:</span> {feedback.name || initialFeedback.name}</p>
          <p><span className="font-bold">Email:</span> {feedback.email || initialFeedback.email}</p>
          <p><span className="font-bold">Subject:</span> {feedback.subject}</p>
          <p className="text-justify"><span className="font-bold">Message:</span> {feedback.message}</p>

          {feedback.reply && (
            <div className="mt-6 border-t pt-4">
              <p className="text-[#BD2D01] font-bold">Your Reply:</p>
              <p className="text-black whitespace-pre-line">{feedback.reply}</p>
            </div>
          )}
        </div>

        {/* Reply Input */}
        {!feedback.reply && (
          <>
            <div className="mt-6">
              <textarea
                rows="6"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write a message..."
                className="w-full p-4 border border-[#BD2D01] rounded-md focus:outline-none placeholder-gray-500 text-black"
              ></textarea>
            </div>

            {/* Send Button */}
            <div className="mt-4 flex justify-end">
              <button
                className="px-6 py-2 rounded-md text-white font-semibold"
                style={{ background: '#CF4602' }}
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReplyFeedback;
