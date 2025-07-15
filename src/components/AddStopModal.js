import React, { useState, useRef, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import DeleteStopModal from './DeleteStopModal';
import api from '../services/api';

const AddStopModal = ({ onClose }) => {
  const [stopInput, setStopInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [stops, setStops] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stopToDeleteIndex, setStopToDeleteIndex] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchAllStops();
  }, []);

  const fetchAllStops = async () => {
    try {
      const res = await api.get('/busstop');
      setStops(res.data || []);
    } catch (error) {
      console.error('Error fetching stops:', error);
      setStops([]);
    }
  };

  useEffect(() => {
    if (stopInput.trim().length < 4) {
      setSuggestions([]);
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(stopInput.trim());
    }, 300);
  }, [stopInput]);

  const fetchSuggestions = async (query) => {
  try {
    let data = [];

    // Try Firebase first
    try {
      const res = await api.get(`/busstop/search/firebase/${query}`);
      data = Array.isArray(res.data) ? res.data : [res.data];
    } catch (firebaseErr) {
      if (firebaseErr.response?.status === 404) {
        console.log('Firebase returned 404, falling back to Google');
        // Try Google fallback
        try {
          const googleRes = await api.get(`/busstop/search/google/${query}`);
          data = Array.isArray(googleRes.data)
            ? googleRes.data
            : [googleRes.data];
        } catch (googleErr) {
          console.error('Google fetch error:', googleErr);
        }
      } else {
        console.error('Firebase fetch error (not 404):', firebaseErr);
      }
    }

    // Remove already added stops
    const filtered = data.filter((item) => {
      const name = item.stopName || item.description || '';
      return !stops.some((s) => s.stopName === name);
    });

    setSuggestions(filtered);
  } catch (error) {
    console.error('Suggestion fetch error:', error);
    setSuggestions([]);
  }
};


  const handleAdd = async () => {
    if (stopInput.trim() === '') return;

    try {
      const response = await api.get(`/busstop/search/google/${stopInput.trim()}`);
      let data = response.data;
      if (Array.isArray(data)) data = data[0];

      const latitude =
        data?.stopLatitude ?? data?.latitude ?? data?.location?.lat ?? 0;
      const longitude =
        data?.stopLongitude ?? data?.longitude ?? data?.location?.lng ?? 0;
      const stopName = data?.stopName ?? data?.description ?? stopInput.trim();

      if (!latitude || !longitude) {
        console.warn('Latitude/Longitude not found for:', stopName);
        alert('Could not retrieve exact location for this stop.');
        return;
      }

      const newStop = {
        stopName,
        stopLatitude: latitude,
        stopLongitude: longitude,
      };

      await api.post('/busstop', {
        StopName: newStop.stopName,
        StopLatitude: newStop.stopLatitude,
        StopLongitude: newStop.stopLongitude,
      });

      setStops([...stops, newStop]);
      setStopInput('');
      setSuggestions([]);
    } catch (error) {
      console.error('Add stop failed:', error);
      alert('Failed to add stop');
    }
  };

  const handleSelectSuggestion = (item) => {
    setStopInput(item.description || item.stopName);
    setSuggestions([]);
  };

  const requestDelete = (index) => {
    setStopToDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (stopToDeleteIndex === null) return;

    const stopName = stops[stopToDeleteIndex].stopName;

    try {
      await api.delete(`/busstop/${encodeURIComponent(stopName)}`);

      const updated = [...stops];
      updated.splice(stopToDeleteIndex, 1);
      setStops(updated);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete stop.');
    } finally {
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
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-white text-xl font-bold mb-6 text-left">Add Bus Stops</h2>

        <div className="flex gap-4 mb-4 relative">
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

          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white max-h-60 overflow-y-auto shadow-lg rounded-md z-10 mt-1">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-orange-200 cursor-pointer"
                  onClick={() => handleSelectSuggestion(item)}
                >
                  {item.description || item.stopName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-[#F67F00] rounded-t-md text-white font-bold px-4 py-2">
          Bus Stop List
        </div>
        <div className="bg-orange-100 max-h-64 overflow-y-auto rounded-b-md">
          {stops.map((stop, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-4 py-2 border-b border-orange-300 hover:bg-orange-200 transition"
            >
              <span>{stop.stopName}</span>
              <FaTrash
                onClick={() => requestDelete(index)}
                className="text-red-700 cursor-pointer hover:text-red-900"
              />
            </div>
          ))}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteStopModal
          stopName={stops[stopToDeleteIndex]?.stopName || ''}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default AddStopModal;
