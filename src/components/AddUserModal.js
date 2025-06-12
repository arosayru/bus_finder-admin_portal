import React, { useState } from 'react';
import { FaEye, FaUserCircle } from 'react-icons/fa';

const AddUserModal = ({ onClose }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-md p-6 rounded-2xl shadow-xl relative"
        style={{
          background: 'linear-gradient(to bottom, #BD2D01 0%, #CF4602 10%, #F67F00 50%, #CF4602 90%, #BD2D01 100%)',
        }}
      >
        <h2 className="text-white text-xl font-bold mb-4">Add User</h2>

        <div className="flex justify-center mb-4">
          <FaUserCircle className="text-white text-6xl" />
        </div>

        <form className="space-y-3">
          <input type="text" placeholder="First Name" className="w-full p-3 rounded-md bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none" />
          <input type="text" placeholder="Last Name" className="w-full p-3 rounded-md bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none" />
          <input type="text" placeholder="Username" className="w-full p-3 rounded-md bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none" />
          <input type="email" placeholder="Email" className="w-full p-3 rounded-md bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none" />

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 pr-10 rounded-md bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none"
            />
            <FaEye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#BD2D01] cursor-pointer"
              onClick={() => setShowPass(!showPass)} />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="w-full p-3 pr-10 rounded-md bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none"
            />
            <FaEye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#BD2D01] cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)} />
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-2 rounded-md text-white font-semibold"
            style={{
              background: 'linear-gradient(to right, #F67F00, #CF4602)',
            }}
          >
            Add
          </button>
        </form>

        {/* Close backdrop on outside click */}
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

export default AddUserModal;
