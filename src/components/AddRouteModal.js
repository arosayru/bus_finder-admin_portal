import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const AddRouteModal = ({ onClose }) => {
  const [form, setForm] = useState({
    routeNo: '',
    routeName: '',
    vehicleNo: '',
    driverName: '',
    conductorName: '',
    phone: '',
  });

  const [stops, setStops] = useState(['']);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStopChange = (index, value) => {
    const updatedStops = [...stops];
    updatedStops[index] = value;
    setStops(updatedStops);
  };

  const addStop = () => {
    setStops([...stops, '']);
  };

  const removeStop = (index) => {
    const updatedStops = stops.filter((_, i) => i !== index);
    setStops(updatedStops);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...form, stops });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-xl p-6 rounded-2xl shadow-xl relative"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        <h2 className="text-white text-xl font-bold mb-4">Add Route Details</h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Route No & Route Name */}
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
          <div className="mt-4">
            <label className="text-white font-semibold flex items-center gap-2 cursor-pointer mb-2" onClick={addStop}>
              <FaPlus /> Add Stops
            </label>
            {stops.map((stop, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={stop}
                  onChange={(e) => handleStopChange(index, e.target.value)}
                  placeholder={`Stop ${index + 1}`}
                  className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] focus:outline-none"
                />
                {stops.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStop(index)}
                    className="text-[#BD2D01] bg-white p-2 rounded-full"
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Vehicle, Driver, Conductor, Phone */}
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

          {/* Submit */}
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
      </div>
    </div>
  );
};

export default AddRouteModal;
