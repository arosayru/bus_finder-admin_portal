import React, { useState } from 'react';
import axios from 'axios';

const DeleteAdminModal = ({ admin, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`https://bus-finder-sl-a7c6a549fbb1.herokuapp.com/api/admin/${admin.adminId}`);
      onConfirm(admin); // Inform parent to refresh the list
      onClose();
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin. Please try again.');
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
          Are you sure delete <span className="font-bold text-[#FFFFFF]">“{admin.firstName}”</span>?
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

export default DeleteAdminModal;
