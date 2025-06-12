import React from 'react';

const DeleteUserModal = ({ user, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="p-6 rounded-2xl shadow-xl text-center"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        <h2 className="text-white text-2xl font-bold mb-2">Delete?</h2>
        <p className="text-white text-lg mb-6">
          Are you sure delete <span className="font-bold text-[#FFE0B2]">"{user.firstName}"</span>?
        </p>

        <div className="flex justify-center gap-6">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
            onClick={() => onConfirm(user)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
