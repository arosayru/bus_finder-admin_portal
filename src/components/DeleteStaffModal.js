import React from 'react';

const DeleteStaffModal = ({ staff, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-sm p-6 rounded-2xl shadow-xl text-center"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        <h2 className="text-white text-2xl font-bold mb-2">Delete?</h2>
        <p className="text-white text-lg font-semibold mb-6">
          Are you sure delete <span className="font-bold text-[#FFFFFF]">“{staff.firstName}”</span>?
        </p>

        <div className="flex justify-center gap-6">
          <button
            className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700"
            onClick={() => onConfirm(staff)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStaffModal;
