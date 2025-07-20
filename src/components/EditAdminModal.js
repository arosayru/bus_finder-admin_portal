import React, { useState } from 'react';
import { FaUserCircle, FaUpload } from 'react-icons/fa';
import api from '../services/api';

const EditAdminModal = ({ admin, onClose, onUpdate }) => {
  const [form, setForm] = useState({ ...admin });
  const [preview, setPreview] = useState(admin.profilePicture || '');
  const [errors, setErrors] = useState({});

  const [focusFirstName, setFocusFirstName] = useState(false);
  const [focusLastName, setFocusLastName] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusTelNo, setFocusTelNo] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Please fill out this field.';
    else if (!/^[A-Za-z]+$/.test(form.firstName)) newErrors.firstName = 'Only letters allowed.';

    if (!form.lastName.trim()) newErrors.lastName = 'Please fill out this field.';
    else if (!/^[A-Za-z]+$/.test(form.lastName)) newErrors.lastName = 'Only letters allowed.';

    if (!form.telNo.trim()) newErrors.telNo = 'Please fill out this field.';
    else if (!/^\d{10}$/.test(form.telNo)) newErrors.telNo = 'Must be exactly 10 digits.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const updatePayload = {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        telNo: form.telNo,
        profilePicture: form.profilePicture || '',
      };

      await api.put(`/admin/${form.adminId}`, updatePayload);
      onUpdate({ ...form });
      onClose();
    } catch (err) {
      console.error('Error updating admin:', err);
      alert('Failed to update admin. Please try again.');
    }
  };

  const renderTooltip = (msg) => (
    <div className="absolute left-0 mt-1 bg-white text-black text-sm rounded shadow-md border border-gray-300 px-3 py-2 z-10">
      <div className="absolute -top-2 left-4 w-3 h-3 bg-white rotate-45 border-l border-t border-gray-300"></div>
      <span role="img" aria-label="warning" className="mr-2">⚠️</span>
      {msg}
    </div>
  );

  const renderInput = (label, name, type = 'text', focusState, setFocusState, disabled = false) => (
    <div className="relative">
      <label htmlFor={name} className={`absolute left-3 transition-all duration-300 ${form[name] || focusState ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'}`}>{label}</label>
      <input
        name={name}
        type={type}
        placeholder={label}
        value={form[name]}
        onChange={handleChange}
        onFocus={() => setFocusState(true)}
        onBlur={() => setFocusState(form[name] ? true : false)}
        disabled={disabled}
        className={`w-full p-3 rounded-md ${disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-orange-50'} text-black placeholder-transparent focus:outline-none`}
      />
      {errors[name] && renderTooltip(errors[name])}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-md p-6 rounded-2xl shadow-xl relative"
        style={{ background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)' }}
      >
        <h2 className="text-white text-xl font-bold mb-4">Edit Admin</h2>

        {/* Profile Picture Preview (UI only) */}
        <div className="flex justify-center mb-4 relative">
          <label htmlFor="edit-profile-upload" className="cursor-pointer relative group">
            {preview ? (
              <img src={preview} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border-2 border-white" />
            ) : (
              <FaUserCircle className="text-white text-6xl" />
            )}
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm group-hover:scale-110 transition">
              <FaUpload className="text-[#F67F00] text-sm" />
            </div>
            <input id="edit-profile-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderInput('First Name', 'firstName', 'text', focusFirstName, setFocusFirstName)}
          {renderInput('Last Name', 'lastName', 'text', focusLastName, setFocusLastName)}
          {renderInput('Email', 'email', 'email', focusEmail, setFocusEmail, true)}
          {renderInput('Phone Number', 'telNo', 'text', focusTelNo, setFocusTelNo)}

          {/* Update Button */}
          <div className="flex justify-end">
            <button type="submit" className="mt-2 px-6 py-2 rounded-md text-white font-semibold" style={{ background: '#CF4602' }}>
              Update
            </button>
          </div>
        </form>

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-3 text-white text-lg font-bold">
          ✕
        </button>
      </div>
    </div>
  );
};

export default EditAdminModal;