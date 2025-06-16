import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import AddStopModal from './AddStopModal';

const AddRouteModal = ({ onClose }) => {
  const [form, setForm] = useState({
    routeNo: '',
    routeName: '',
    vehicleNo: '',
    driverName: '',
    conductorName: '',
    phone: '',
  });

  const [stops, setStops] = useState([]);
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [stopInput, setStopInput] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStopInput = (e) => {
    setStopInput(e.target.value);
  };

  const addStop = () => {
    if (stopInput.trim() !== '') {
      setStops([...stops, stopInput.trim()]);
      setStopInput('');
    }
  };

  const removeStop = (index) => {
    const updated = [...stops];
    updated.splice(index, 1);
    setStops(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...form, stops });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-xl max-h-[90vh] p-6 overflow-y-auto rounded-2xl shadow-xl relative"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        <h2 className="text-white text-xl font-bold mb-4">Add Route Details</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Route Info */}
          <div className="flex gap-4">
            <input
              type="text"
              name="routeNo"
              value={form.routeNo}
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

          {/* Add Stops */}
          <div className="mt-2">
            <label
              className="text-white font-semibold flex items-center gap-2 mb-2 cursor-pointer"
              onClick={() => setShowAddStopModal(true)}
            >
              <FaPlus /> Add Stops
            </label>

            <div className="flex gap-2">
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
            </div>

            {/* List of Added Stops */}
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
                    className="bg-white text-[#BD2D01] p-2 rounded-full"
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle & Staff Info */}
          <div className="flex gap-4 mt-4">
            <input
              type="text"
              name="vehicleNo"
              value={form.vehicleNo}
              onChange={handleChange}
              placeholder="Vehicle No"
              className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] focus:outline-none"
            />
            <input
              type="text"
              name="driverName"
              value={form.driverName}
              onChange={handleChange}
              placeholder="Driver’s Name"
              className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] focus:outline-none"
            />
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              name="conductorName"
              value={form.conductorName}
              onChange={handleChange}
              placeholder="Conductor’s Name"
              className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] focus:outline-none"
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] focus:outline-none"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-white font-semibold"
              style={{ background: '#CF4602' }}
            >
              Add
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

        {/* AddStopModal Popup */}
        {showAddStopModal && (
          <AddStopModal onClose={() => setShowAddStopModal(false)} />
        )}
      </div>
    </div>
  );
};

export default AddRouteModal;
