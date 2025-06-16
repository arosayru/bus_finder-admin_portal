import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import DeleteStopModal from './DeleteStopModal';

const AddStopModal = ({ onClose }) => {
  const [stopInput, setStopInput] = useState('');
  const [stops, setStops] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stopToDeleteIndex, setStopToDeleteIndex] = useState(null);

  const handleAdd = () => {
    if (stopInput.trim() !== '') {
      setStops([...stops, stopInput.trim()]);
      setStopInput('');
    }
  };

  const requestDelete = (index) => {
    setStopToDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (stopToDeleteIndex !== null) {
      const updated = [...stops];
      updated.splice(stopToDeleteIndex, 1);
      setStops(updated);
      setShowDeleteModal(false);
      setStopToDeleteIndex(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-2xl p-6 rounded-2xl shadow-xl relative"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white text-xl font-bold"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-white text-xl font-bold mb-6 text-left">Add Bus Stops</h2>

        {/* Input */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Add bus stop"
            value={stopInput}
            onChange={(e) => setStopInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-md bg-orange-100 placeholder-[#BD2D01] text-black focus:outline-none"
          />
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-[#BD2D01] hover:bg-[#A53000] text-white font-semibold rounded-md"
          >
            Add
          </button>
        </div>

        {/* Stop List */}
        <div className="bg-[#F67F00] rounded-t-md text-white font-bold px-4 py-2">
          Bus Stop List
        </div>
        <div className="bg-orange-100 max-h-64 overflow-y-auto rounded-b-md">
          {stops.map((stop, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-4 py-2 border-b border-orange-300 hover:bg-orange-200 transition"
            >
              <span>{stop}</span>
              <FaTrash
                onClick={() => requestDelete(index)}
                className="text-red-700 cursor-pointer hover:text-red-900"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteStopModal
          stopName={stops[stopToDeleteIndex]}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default AddStopModal;
