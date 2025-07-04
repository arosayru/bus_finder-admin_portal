import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import DeleteStopModal from './DeleteStopModal';
import api from '../services/api'; // Import the API instance to make requests

const AddStopModal = ({ onClose }) => {
  const [stopInput, setStopInput] = useState('');
  const [stops, setStops] = useState([]); // State to hold bus stops
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stopToDeleteIndex, setStopToDeleteIndex] = useState(null);
  const [stopToDeleteName, setStopToDeleteName] = useState(null); // Store stop name for deletion

  // Fetch all bus stops from the API when the modal opens
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await api.get('/busstop'); // Fetch bus stops from API
        setStops(response.data); // Set the bus stops data to state
      } catch (error) {
        console.error('Error fetching bus stops:', error);
      }
    };
    fetchStops();
  }, []); // Empty dependency array to run only once when the modal is shown

  const handleAdd = () => {
    if (stopInput.trim() !== '') {
      setStops([...stops, { stopName: stopInput.trim() }]);
      setStopInput('');
    }
  };

  const requestDelete = (index, stopName) => {
    setStopToDeleteIndex(index);
    setStopToDeleteName(stopName); // Store stop name for deletion
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (stopToDeleteName) {
      try {
        // Send DELETE request to remove the bus stop from the backend
        await api.delete(`/busstop/${stopToDeleteName}`);
        // Update the frontend by removing the stop from the list
        const updatedStops = stops.filter((stop) => stop.stopName !== stopToDeleteName);
        setStops(updatedStops);
        setShowDeleteModal(false);
        setStopToDeleteIndex(null);
        setStopToDeleteName(null); // Clear state after delete
      } catch (error) {
        console.error('Error deleting bus stop:', error);
      }
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
          {/* Displaying fetched bus stops */}
          {stops.length === 0 ? (
            <p className="text-center text-gray-500">No bus stops available</p>
          ) : (
            stops.map((stop, index) => (
              <div
                key={index}
                className="flex justify-between items-center px-4 py-2 border-b border-orange-300 hover:bg-orange-200 transition"
              >
                <span>{stop.stopName}</span> {/* Display only the StopName */}
                <FaTrash
                  onClick={() => requestDelete(index, stop.stopName)} // Pass stopName to the delete request
                  className="text-red-700 cursor-pointer hover:text-red-900"
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteStopModal
          stopName={stopToDeleteName} // Pass the stop name to the DeleteStopModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete} // Call confirmDelete on confirmation
        />
      )}
    </div>
  );
};

export default AddStopModal;
