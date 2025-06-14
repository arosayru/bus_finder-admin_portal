import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaUserCircle, FaUpload } from 'react-icons/fa';

const EditStaffModal = ({ staff, onClose, onUpdate }) => {
  const [form, setForm] = useState({ ...staff });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profilePic, setProfilePic] = useState(staff.profilePic || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...form, profilePic });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-md p-6 rounded-2xl shadow-xl relative"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        <h2 className="text-white text-xl font-bold mb-4">Edit Staff</h2>

        {/* Profile Picture Preview */}
        <div className="flex justify-center mb-4 relative">
          <label htmlFor="edit-profile-upload" className="cursor-pointer relative group">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <FaUserCircle className="text-white text-6xl" />
            )}
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm group-hover:scale-110 transition">
              <FaUpload className="text-[#F67F00] text-sm" />
            </div>
            <input
              id="edit-profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-[#7E7573] focus:outline-none"
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-[#7E7573] focus:outline-none"
          />
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-[#7E7573] focus:outline-none"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-[#7E7573] focus:outline-none"
          />

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 pr-10 rounded-md bg-orange-50 text-black placeholder-[#7E7573] focus:outline-none"
            />
            <div
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showPass ? (
                <FaEyeSlash className="text-[#BD2D01]" />
              ) : (
                <FaEye className="text-[#BD2D01]" />
              )}
            </div>
          </div>

          {/* Confirm Password (optional for UI) */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="w-full p-3 pr-10 rounded-md bg-orange-50 text-black placeholder-[#7E7573] focus:outline-none"
            />
            <div
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showConfirm ? (
                <FaEyeSlash className="text-[#BD2D01]" />
              ) : (
                <FaEye className="text-[#BD2D01]" />
              )}
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="mt-2 px-6 py-2 rounded-md text-white font-semibold"
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
      </div>
    </div>
  );
};

export default EditStaffModal;
