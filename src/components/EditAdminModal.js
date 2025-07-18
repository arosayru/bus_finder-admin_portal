import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUserCircle, FaUpload } from 'react-icons/fa';
import api from '../services/api';

const EditAdminModal = ({ admin, onClose, onUpdate }) => {
  const [form, setForm] = useState({ ...admin });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [preview, setPreview] = useState(admin.profilePicture || '');
  
  // Focus state for form fields
  const [focusFirstName, setFocusFirstName] = useState(false);
  const [focusLastName, setFocusLastName] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusTelNo, setFocusTelNo] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = form.profilePicture;

      // Step 1: Upload profile picture if selected
      if (profilePicFile) {
        const formData = new FormData();
        formData.append('file', profilePicFile);

        const uploadRes = await api.put(`/admin/update-profile-picture/${form.adminId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // If backend returns the link (e.g. Google Drive), assign it here
        if (uploadRes.data?.link) {
          imageUrl = uploadRes.data.link;
        }
      }

      // Step 2: Update other details including profilePicture (preserve it)
      const updatePayload = {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        telNo: form.telNo,
        profilePicture: imageUrl || '',
      };

      await api.put(`/admin/${form.adminId}`, updatePayload);

      // Step 3: Notify parent with updated picture
      onUpdate({ ...form, profilePicture: imageUrl });
      onClose();
    } catch (err) {
      console.error('Error updating admin:', err);
      alert('Failed to update admin. Please try again.');
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
        <h2 className="text-white text-xl font-bold mb-4">Edit Admin</h2>

        {/* Profile Picture Preview */}
        <div className="flex justify-center mb-4 relative">
          <label htmlFor="edit-profile-upload" className="cursor-pointer relative group">
            {preview ? (
              <img
                src={preview}
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
                form.firstName || focusFirstName ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
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
              onFocus={() => setFocusFirstName(true)}
              onBlur={() => setFocusFirstName(form.firstName ? true : false)}
              className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-transparent focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div className="relative">
            <label
              htmlFor="lastName"
              className={`absolute left-3 transition-all duration-300 ${
                form.lastName || focusLastName ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
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
              onFocus={() => setFocusLastName(true)}
              onBlur={() => setFocusLastName(form.lastName ? true : false)}
              className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-transparent focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <label
              htmlFor="email"
              className={`absolute left-3 transition-all duration-300 ${
                form.email || focusEmail ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
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
              className="w-full p-3 rounded-md bg-gray-200 text-black placeholder-transparent cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* Phone Number */}
          <div className="relative">
            <label
              htmlFor="telNo"
              className={`absolute left-3 transition-all duration-300 ${
                form.telNo || focusTelNo ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
              }`}
            >
              Phone Number
            </label>
            <input
              name="telNo"
              type="text"
              placeholder="Tel No."
              value={form.telNo}
              onChange={handleChange}
              onFocus={() => setFocusTelNo(true)}
              onBlur={() => setFocusTelNo(form.telNo ? true : false)}
              className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-transparent focus:outline-none"
            />
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

export default EditAdminModal;
