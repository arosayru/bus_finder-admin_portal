import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUserCircle, FaUpload } from 'react-icons/fa';
import api from '../services/api';

const AddStaffModal = ({ onClose, onAddStaff }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    telNo: '',
    nic: '',
    staffRole: 'Driver',
    password: '',
    profilePicture: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
      setFormData({ ...formData, profilePicture: file });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Upload image
      let uploadedImageUrl = '';
      if (formData.profilePicture) {
        const imageData = new FormData();
        imageData.append('file', formData.profilePicture);

        const uploadRes = await api.post('/staff/upload-profile-picture', imageData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        uploadedImageUrl = uploadRes.data.link || '';
      }

      const newStaff = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        telNo: formData.telNo,
        nic: formData.nic,
        password: formData.password,
        staffRole: formData.staffRole,
        profilePicture: uploadedImageUrl,
      };

      const createRes = await api.post('/staff', newStaff);
      if (createRes.status === 201 || createRes.status === 200) {
        onAddStaff(createRes.data);
        onClose();
      } else {
        setErrorMessage('Failed to create staff member');
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      setErrorMessage('Something went wrong. Try again.');
    } finally {
      setLoading(false);
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
        {/* Title */}
        <h2 className="text-white text-xl font-bold mb-4">Add Staff</h2>

        {/* Profile Picture */}
        <div className="flex justify-center mb-4 relative">
          <label htmlFor="staff-profile-upload" className="cursor-pointer relative group">
            {profilePicPreview ? (
              <img
                src={profilePicPreview}
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
              id="staff-profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-3 text-sm">{errorMessage}</div>
        )}

        {/* Form */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
          />
          <input
            type="text"
            name="telNo"
            placeholder="Phone Number"
            value={formData.telNo}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
          />
          <input
            type="text"
            name="nic"
            placeholder="NIC"
            value={formData.nic}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
          />

          {/* Staff Role Dropdown */}
          <select
            name="staffRole"
            value={formData.staffRole}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-orange-50 text-black focus:outline-none"
          >
            <option value="Driver">Driver</option>
            <option value="Conductor">Conductor</option>
          </select>

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 pr-10 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
            />
            <div
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showPass ? <FaEye className="text-[#BD2D01]" /> : <FaEyeSlash className="text-[#BD2D01]" />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 pr-10 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
            />
            <div
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showConfirm ? <FaEye className="text-[#BD2D01]" /> : <FaEyeSlash className="text-[#BD2D01]" />}
            </div>
          </div>

          {/* Add Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="mt-2 px-6 py-2 rounded-md text-white font-semibold"
              style={{ background: '#CF4602' }}
            >
              {loading ? 'Adding...' : 'Add'}
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

export default AddStaffModal;
