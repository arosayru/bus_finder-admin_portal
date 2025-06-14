import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { FaEye, FaBell, FaPen } from 'react-icons/fa';

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: 'Robert',
    lastName: 'Signh',
    username: 'robert90',
    email: 'robert90@gmail.com',
    password: '12345',
    confirmPassword: '12345'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-64 pt-4 px-6">
        <Topbar />

        <div className="max-w-xl mx-auto mt-20 bg-[#FB9933] shadow-xl p-8 rounded-xl relative">
          {/* Profile Picture */}
          <div className="flex justify-center relative mb-4">
            <div className="w-24 h-24 rounded-full bg-white overflow-hidden flex items-center justify-center">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-[#FB9933]">👤</span>
              )}
            </div>
            <label htmlFor="profileUpload">
              <FaPen
                className="absolute bottom-3 right-[42%] text-gray-600 cursor-pointer"
                title="Edit profile picture"
              />
            </label>
            <input
              type="file"
              id="profileUpload"
              accept="image/*"
              onChange={handlePictureChange}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-orange-100 p-3 rounded"
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-orange-100 p-3 rounded"
              placeholder="Last Name"
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-orange-100 p-3 rounded"
              placeholder="Username"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-orange-100 p-3 rounded"
              placeholder="Email"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-orange-100 p-3 rounded"
                placeholder="Password"
              />
              <FaEye
                className="absolute right-3 top-3.5 text-[#BD2D01] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-orange-100 p-3 rounded"
                placeholder="Confirm Password"
              />
              <FaEye
                className="absolute right-3 top-3.5 text-[#BD2D01] cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-right">
            <button
              className="px-6 py-2 bg-[#D44B00] text-white rounded font-semibold hover:bg-orange-700"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
