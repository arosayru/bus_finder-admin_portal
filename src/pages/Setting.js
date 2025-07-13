import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { FaEye, FaEyeSlash, FaEdit } from 'react-icons/fa';
import api from '../services/api';

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [message, setMessage] = useState('');

  const adminId = localStorage.getItem('admin_id');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get(`/admin/${adminId}`);
        const data = response.data;
        setFormData((prev) => ({
          ...prev,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
        }));

        try {
          const picRes = await api.get(`/admin/profile-picture/${adminId}`, { responseType: 'blob' });
          setProfilePicture(URL.createObjectURL(picRes.data));
        } catch (err) {
          console.warn('No profile picture found');
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      }
    };

    if (adminId) fetchAdminData();
  }, [adminId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      // Step 1: Upload profile picture if changed
      if (profilePictureFile) {
        const formDataPic = new FormData();
        formDataPic.append('file', profilePictureFile);
        await api.put(`/admin/update-profile-picture/${adminId}`, formDataPic, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      // Step 2: Update admin profile fields
      const updateFields = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      await api.put(`/admin/${adminId}`, updateFields);

      // Step 3: If password fields filled, update password
      if (
        formData.currentPassword &&
        formData.newPassword &&
        formData.newPassword === formData.confirmPassword
      ) {
        await api.post(`/admin/update-password`, {
          email: formData.email,
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        });
      }

      setMessage('Update successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Update failed:', error);
      setMessage('Update failed. Please check input.');
      setTimeout(() => setMessage(''), 4000);
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
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-[#FB9933]">👤</span>
              )}
            </div>
            <label htmlFor="profileUpload">
              <FaEdit className="absolute bottom-3 right-[42%] text-gray-600 cursor-pointer" />
            </label>
            <input
              type="file"
              id="profileUpload"
              accept="image/*"
              onChange={handlePictureChange}
              className="hidden"
            />
          </div>

          {/* Form */}
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
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-orange-100 p-3 rounded"
              placeholder="Email"
            />

            {/* Password Fields */}
            {[
              { name: 'currentPassword', label: 'Current Password', show: showCurrentPassword, toggle: () => setShowCurrentPassword(!showCurrentPassword) },
              { name: 'newPassword', label: 'New Password', show: showNewPassword, toggle: () => setShowNewPassword(!showNewPassword) },
              { name: 'confirmPassword', label: 'Confirm Password', show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword) },
            ].map(({ name, label, show, toggle }) => (
              <div className="relative" key={name}>
                <input
                  type={show ? 'text' : 'password'}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full bg-orange-100 p-3 rounded"
                  placeholder={label}
                />
                <div
                  onClick={toggle}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {show ? <FaEye className="text-[#BD2D01]" /> : <FaEyeSlash className="text-[#BD2D01]" />}
                </div>
              </div>
            ))}
          </div>

          {/* Update Button */}
          <div className="mt-6 text-right">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#D44B00] text-white rounded font-semibold hover:bg-orange-700"
            >
              Update
            </button>
            {message && <p className="mt-2 text-green-900 font-medium">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
