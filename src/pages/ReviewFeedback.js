import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { FaTrash, FaReply } from 'react-icons/fa';
import DeleteFeedback from '../components/DeleteFeedback'; // ✅ Import modal

const ReviewFeedback = () => {
  const navigate = useNavigate();

  const [feedbackList, setFeedbackList] = useState(
    Array(6).fill({
      name: 'John Ruby',
      email: 'john99@gmail.com',
      subject: 'Urgent Concern: Unsafe Driving Practices by Sri Lankan Bus Drivers',
      message: `Honestly, most Sri Lankan bus drivers are reckless and inconsiderate. They drive like they own the road—constantly speeding, overtaking dangerously, and ignoring traffic rules. It's terrifying as a passenger, and I fear for my safety every time I board a bus. Something needs to be done!`,
    })
  );

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null); // ✅ Track index for deletion

  const handleReply = (feedback) => {
    navigate('/reply-feedback', { state: feedback });
  };

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updated = [...feedbackList];
      updated.splice(deleteIndex, 1);
      setFeedbackList(updated);
      setDeleteIndex(null);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 pt-20 px-6">
        <Topbar />

        {/* Feedback List */}
        <div className="mt-8 rounded-xl border border-orange-300 overflow-hidden">
          <div className="bg-[#F67F00] text-white text-lg font-semibold px-6 py-3">
            {/* Optional title row */}
          </div>

          {/* Scrollable Feedback */}
          <div style={{ maxHeight: '580px', overflowY: 'auto' }}>
            {feedbackList.map((fb, index) => (
              <div
                key={index}
                className={`flex justify-between items-start px-6 py-4 border-t border-orange-300 bg-orange-100 hover:bg-orange-200 transition`}
              >
                {/* Left Content */}
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

                {/* Right Icons */}
                <div className="flex flex-col items-center gap-3 mt-2 text-[#BD2D01]">
                  <FaTrash
                    className="cursor-pointer text-2xl hover:text-red-700"
                    onClick={() => setDeleteIndex(index)}
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

        {/* Delete Modal */}
        {deleteIndex !== null && (
          <DeleteFeedback
            onCancel={() => setDeleteIndex(null)}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewFeedback;
