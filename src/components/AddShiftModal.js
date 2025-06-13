import React, { useState } from 'react';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';

const AddShiftModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    routeNo: '',
    routeName: '',
    departureTime: '',
    arrivalTime: '',
    date: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
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
        {/* Header */}
        <h2 className="text-white text-xl font-bold mb-6 text-center">Add Shift</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Route Fields */}
          <div className="flex gap-4">
            <input
              type="text"
              name="routeNo"
              value={form.routeNo}
              onChange={handleChange}
              placeholder="Route No"
              className="flex-1 p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
            />
            <input
              type="text"
              name="routeName"
              value={form.routeName}
              onChange={handleChange}
              placeholder="Route Name"
              className="flex-1 p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
            />
          </div>

          {/* Time Fields */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="time"
                name="departureTime"
                value={form.departureTime}
                onChange={handleChange}
                className="w-full p-3 pr-5 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
              />
            </div>
            <div className="relative flex-1">
              <input
                type="time"
                name="arrivalTime"
                value={form.arrivalTime}
                onChange={handleChange}
                className="w-full p-3 pr-5 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
              />
            </div>
          </div>

          {/* Date Field */}
          <div className="relative">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-3 pr-5 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
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

        {/* Close Button */}
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

export default AddShiftModal;
