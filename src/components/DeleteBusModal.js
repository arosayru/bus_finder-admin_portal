import React, { useState } from 'react';
import api from '../services/api';

const DeleteBusModal = ({ bus, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!bus || !bus.numberPlate) return;
    setLoading(true);

    try {
      const res = await api.delete(`/bus/${bus.numberPlate}`);
      if (res.status === 200 || res.status === 204) {
        onConfirm(bus);  // Remove from state in parent
        onClose();       // Close modal
      } else {
        console.error('Unexpected delete response:', res);
      }
    } catch (err) {
      console.error('Failed to delete bus:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-sm p-6 rounded-2xl shadow-xl text-center relative"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        <h2 className="text-white text-2xl font-bold mb-4">Delete?</h2>
        <p className="text-white text-lg font-semibold mb-6">
          Are you sure you want to delete{' '}
          <span className="text-white font-bold">“{bus?.numberPlate || 'this bus'}”</span>?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2 bg-[#BD1111] text-white font-bold rounded-md hover:bg-red-700"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white text-lg font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default DeleteBusModal;
