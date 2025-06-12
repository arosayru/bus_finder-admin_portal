import React, { useState } from 'react';
import { FaEye, FaUserCircle, FaUpload } from 'react-icons/fa';

const AddUserModal = ({ onClose }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-md p-6 rounded-2xl shadow-xl relative"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        <h2 className="text-white text-xl font-bold mb-4">Add User</h2>

        {/* Profile picture uploader with upload icon */}
        <div className="flex justify-center mb-4 relative">
          <label htmlFor="profile-upload" className="cursor-pointer relative group">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <FaUserCircle className="text-white text-6xl" />
            )}
            {/* Upload icon overlay */}
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm group-hover:scale-110 transition">
              <FaUpload className="text-[#F67F00] text-sm" />
            </div>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Form */}
        <form className="space-y-3">
          <input
            type="text"
            placeholder="First Name"
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-[#F67F00] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-[#F67F00] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-[#F67F00] focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-[#F67F00] focus:outline-none"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 pr-10 rounded-md bg-orange-50 placeholder-[#7E7573] text-[#F67F00] focus:outline-none"
            />
            <FaEye
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#BD2D01] cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="w-full p-3 pr-10 rounded-md bg-orange-50 placeholder-[#7E7573] text-[#F67F00] focus:outline-none"
            />
            <FaEye
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#BD2D01] cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            />
          </div>

          {/* Add Button aligned right */}
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

export default AddUserModal;
