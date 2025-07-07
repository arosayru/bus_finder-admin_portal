import React, { useState } from 'react';
import api from '../services/api';

const DeleteStaffModal = ({ staff, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/staff/${staff.staffId}`);
      onConfirm(staff); // Inform parent to refresh list
      onClose();        // Close the modal
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Failed to delete staff. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStaffModal;
