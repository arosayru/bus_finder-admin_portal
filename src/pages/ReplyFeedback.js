import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaArrowLeft, FaBell } from 'react-icons/fa';

const ReplyFeedback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const feedback = location.state || {
    name: 'John Ruby',
    email: 'john99@gmail.com',
    subject: 'Urgent Concern: Unsafe Driving Practices by Sri Lankan Bus Drivers',
    message: `Honestly, most Sri Lankan bus drivers are reckless and inconsiderate. They drive like they own the road—constantly speeding, overtaking dangerously, and barely stopping to let passengers get on or off safely. They ignore traffic rules, cut off other vehicles, and make the roads chaotic and unsafe for everyone. It feels like their main priority is racing other buses, not passenger safety. Public transport is supposed to be reliable and safe, but with drivers like this, it’s just stressful and dangerous. This seriously needs to change.`,
  };

  const [replyMessage, setReplyMessage] = useState('');
  const [sentReply, setSentReply] = useState(null);

  const handleSend = () => {
    if (replyMessage.trim()) {
      setSentReply(replyMessage);
      setReplyMessage('');
    }
  };

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
          <p><span className="font-bold">Name:</span> {feedback.name}</p>
          <p><span className="font-bold">Email:</span> {feedback.email}</p>
          <p><span className="font-bold">Subject:</span> {feedback.subject}</p>
          <p className="text-justify"><span className="font-bold">Message:</span> {feedback.message}</p>

          {sentReply && (
            <div className="mt-6 border-t pt-4">
              <p className="text-[#BD2D01] font-bold">Your Reply:</p>
              <p className="text-black whitespace-pre-line">{sentReply}</p>
            </div>
          )}
        </div>

        {/* Reply Input */}
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
      </div>
    </div>
  );
};

export default ReplyFeedback;
