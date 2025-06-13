import React, { useState } from 'react';

const AddBusModal = ({ onClose }) => {
  const [form, setForm] = useState({
    vehicleNo: '',
    busType: '',
    driverName: '',
    conductorName: '',
    phone: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Bus added:', form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-md p-6 rounded-2xl shadow-xl relative"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        <h2 className="text-white text-xl font-bold mb-4">Add Bus</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="vehicleNo"
            value={form.vehicleNo}
            onChange={handleChange}
            placeholder="Vehicle No"
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
          />

          <select
            name="busType"
            value={form.busType}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-[#7E7573] focus:outline-none"
          >
            <option value="">Bus Type</option>
            <option value="A/C">A/C</option>
            <option value="Non A/C">Non A/C</option>
          </select>

          <input
            type="text"
            name="driverName"
            value={form.driverName}
            onChange={handleChange}
            placeholder="Driver Name"
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
          />

          <input
            type="text"
            name="conductorName"
            value={form.conductorName}
            onChange={handleChange}
            placeholder="Conductor Name"
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="mt-2 px-6 py-2 rounded-md text-white font-semibold"
              style={{ background: '#CF4602' }}
            >
              Add
            </button>
          </div>
        </form>

        {/* Close button */}
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

export default AddBusModal;
