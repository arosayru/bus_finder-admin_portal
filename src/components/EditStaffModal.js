import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaUserCircle, FaUpload } from 'react-icons/fa';
import api from '../services/api'; // Make sure api.js is properly set up

const EditStaffModal = ({ staff, onClose, onUpdate }) => {
  const [form, setForm] = useState({ ...staff });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profilePic, setProfilePic] = useState(staff.profilePicture || null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedStaff = { ...form, profilePicture: profilePic };

    try {
      // Update the staff data via PUT request
      const response = await api.put(`/staff/${staff.staffId}`, updatedStaff);

      if (response.status === 200 || response.status === 204) {
        onUpdate(updatedStaff); 
        onClose();
      } else {
        // Log the full response for debugging
        setErrorMessage(`Failed to update staff. Status: ${response.status}`);
        console.error('Failed to update staff', response);
      }
    } catch (err) {
      // Log the detailed error message for debugging
      setErrorMessage(`Error updating staff: ${err.message}`);
      console.error('Error updating staff:', err);
    }
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

        {/* Error message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-3 text-sm">{errorMessage}</div>
        )}

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
          {/* First Name */}
          <div className="relative">
            <label
              htmlFor="firstName"
              className={`absolute left-3 transition-all duration-300 ${
                form.firstName ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
              }`}
            >
              First Name
            </label>
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-transparent focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div className="relative">
            <label
              htmlFor="lastName"
              className={`absolute left-3 transition-all duration-300 ${
                form.lastName ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
              }`}
            >
              Last Name
            </label>
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-transparent focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <label
              htmlFor="email"
              className={`absolute left-3 transition-all duration-300 ${
                form.email ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
              }`}
            >
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              disabled
              className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-transparent cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* NIC */}
          <div className="relative">
            <label
              htmlFor="nic"
              className={`absolute left-3 transition-all duration-300 ${
                form.nic ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
              }`}
            >
              NIC
            </label>
            <input
              name="nic"
              type="text"
              placeholder="NIC"
              value={form.nic}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-transparent focus:outline-none"
            />
          </div>

          {/* Phone Number */}
          <div className="relative">
            <label
              htmlFor="telNo"
              className={`absolute left-3 transition-all duration-300 ${
                form.telNo ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
              }`}
            >
              Phone Number
            </label>
            <input
              name="telNo"
              type="text"
              placeholder="Phone Number"
              value={form.telNo}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-transparent focus:outline-none"
            />
          </div>

          {/* Staff Role Dropdown */}
          <div className="relative">
            <label
              htmlFor="staffRole"
              className={`absolute left-3 transition-all duration-300 ${
                form.staffRole ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
              }`}
            >
              Staff Role
            </label>
            <select
              name="staffRole"
              value={form.staffRole}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-orange-50 text-black focus:outline-none"
            >
              <option value="Driver">Driver</option>
              <option value="Conductor">Conductor</option>
            </select>
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

export default EditStaffModal;
