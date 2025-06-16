import React from 'react';

const DeleteStopModal = ({ stopName, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-sm p-6 rounded-xl shadow-xl text-center"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        <h2 className="text-white text-2xl font-bold mb-4">Delete?</h2>
        <p className="text-gray-100 font-semibold text-lg mb-6">
          Are you sure delete “<span className="text-white">{stopName}</span>”?
        </p>

        <div className="flex justify-center gap-6">
          <button
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-md"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStopModal;
