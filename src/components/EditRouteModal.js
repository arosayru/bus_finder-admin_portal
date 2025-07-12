import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import AddStopModal from './AddStopModal';
import api from '../services/api';

const EditRouteModal = ({ route, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    routeNumber: route.routeNumber || '',
    routeName: route.routeName || '',
    vehicleNo: route.vehicleNo || '',
    driverName: route.driverName || '',
    conductorName: route.conductorName || '',
    phone: route.phone || '',
  });

  const [stops, setStops] = useState(route.routeStops || []);
  const [stopInput, setStopInput] = useState('');
  const [stopSuggestions, setStopSuggestions] = useState([]);
  const [allStops, setAllStops] = useState([]);
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchBusStops();
  }, []);

  const fetchBusStops = async () => {
    try {
      const res = await api.get('/busstop');
      setAllStops(res.data || []);
    } catch (error) {
      console.error('Failed to load stops:', error);
      setAllStops([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStopInput = (e) => {
    const value = e.target.value;
    setStopInput(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (value.trim() === '') {
        setStopSuggestions([]);
        return;
      }

      const filtered = allStops.filter((stop) => {
        const name = stop?.StopName || stop?.stopName;
        return name?.toLowerCase().includes(value.trim().toLowerCase());
      });

      setStopSuggestions(filtered);
    }, 200);
  };

  const handleSelectSuggestion = (item) => {
    const name = item?.StopName || item?.stopName;
    if (name && !stops.includes(name)) {
      setStops([...stops, name]);
    }
    setStopInput('');
    setStopSuggestions([]);
  };

  const addStop = () => {
    const trimmed = stopInput.trim();
    if (trimmed !== '' && !stops.includes(trimmed)) {
      setStops([...stops, trimmed]);
    }
    setStopInput('');
    setStopSuggestions([]);
  };

  const removeStop = (index) => {
    const updated = stops.filter((_, i) => i !== index);
    setStops(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      RouteId: route.RouteId,
      RouteNumber: form.routeNumber,
      RouteName: form.routeName,
      StartingPoint: stops[0],
      EndingPoint: stops[stops.length - 1],
      RouteStops: stops,
      vehicleNo: form.vehicleNo,
      driverName: form.driverName,
      conductorName: form.conductorName,
      phone: form.phone,
    };

    try {
      await api.put(`/busroute/${form.routeNumber}`, payload);
      onUpdate(payload);
      onClose();
    } catch (error) {
      console.error('Failed to update route:', error);
      alert('Update failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-xl max-h-[90vh] p-6 overflow-y-auto rounded-2xl shadow-xl relative"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        <h2 className="text-white text-xl font-bold mb-4">Edit Route Details</h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Route No & Name */}
          <div className="flex gap-4">
            <input
              type="text"
              name="routeNumber"
              value={form.routeNumber}
              onChange={handleChange}
              placeholder="Route No"
              className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] focus:outline-none"
            />
            <input
              type="text"
              name="routeName"
              value={form.routeName}
              onChange={handleChange}
              placeholder="Route Name"
              className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] focus:outline-none"
            />
          </div>

          {/* Add Stops with Suggestion */}
          <div className="mt-2 relative z-20">
            <label
              className="text-white font-semibold flex items-center gap-2 mb-2 cursor-pointer"
              onClick={() => setShowAddStopModal(true)}
            >
              <FaPlus /> Add Stops
            </label>

            <div className="flex gap-2 relative w-full">
              <input
                type="text"
                value={stopInput}
                onChange={handleStopInput}
                placeholder="Add bus stop"
                className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] focus:outline-none"
              />
              <button
                type="button"
                onClick={addStop}
                className="w-8 h-8 flex items-center justify-center bg-white text-[#BD2D01] rounded-full"
              >
                <FaPlus />
              </button>

              {stopSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border border-orange-200 rounded-md max-h-40 overflow-y-auto shadow-lg z-50 mt-1">
                  {stopSuggestions.map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-orange-200 cursor-pointer text-black"
                      onClick={() => handleSelectSuggestion(item)}
                    >
                      {item?.StopName || item?.stopName}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Stop List */}
            <div className="mt-3 space-y-2">
              {stops.map((stop, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={stop}
                    readOnly
                    className="w-full p-3 rounded-md bg-orange-50 text-black"
                  />
                  <button
                    type="button"
                    onClick={() => removeStop(index)}
                    className="bg-white text-[#BD2D01] w-10 h-10 flex items-center justify-center rounded-full"
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-white font-semibold"
              style={{ background: '#CF4602' }}
            >
              Update
            </button>
          </div>
        </form>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-lg font-bold"
        >
          ✕
        </button>

        {/* AddStopModal */}
        {showAddStopModal && (
          <AddStopModal onClose={() => setShowAddStopModal(false)} />
        )}
      </div>
    </div>
  );
};

export default EditRouteModal;
