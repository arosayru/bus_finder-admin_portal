import React from 'react';

const DeleteFeedback = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="rounded-2xl p-6 w-full max-w-md text-center text-white"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        <h2 className="text-2xl font-bold mb-2">Delete?</h2>
        <p className="text-lg font-semibold text-white mb-6">
          Are you sure delete <span className="text-orange-100">Feedback</span>?
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={onCancel}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#BD1111] hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFeedback;
