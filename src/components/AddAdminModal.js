import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUserCircle, FaUpload } from 'react-icons/fa';
import api from '../services/api';

const AddAdminModal = ({ onClose, onAddAdmin }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    telNo: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword, telNo } = formData;
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = 'Please fill out this field.';
    else if (!/^[A-Za-z]+$/.test(firstName)) newErrors.firstName = 'Only letters allowed.';

    if (!lastName.trim()) newErrors.lastName = 'Please fill out this field.';
    else if (!/^[A-Za-z]+$/.test(lastName)) newErrors.lastName = 'Only letters allowed.';

    if (!email.trim()) newErrors.email = 'Please fill out this field.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format.';

    if (!telNo.trim()) newErrors.telNo = 'Please fill out this field.';
    else if (!/^\d{10}$/.test(telNo)) newErrors.telNo = 'Must be exactly 10 digits.';

    if (!password) newErrors.password = 'Please fill out this field.';
    if (!confirmPassword) newErrors.confirmPassword = 'Please fill out this field.';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const { confirmPassword, ...payload } = formData;
      const res = await api.post('/admin', payload);
      if (res.status === 201) {
        onAddAdmin(res.data);
        onClose();
      }
    } catch (err) {
      alert('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTooltip = (msg) => (
    <div className="absolute left-0 mt-1 bg-white text-black text-sm rounded shadow-md border border-gray-300 px-3 py-2 z-10">
      <div className="absolute -top-2 left-4 w-3 h-3 bg-white rotate-45 border-l border-t border-gray-300"></div>
      <span role="img" aria-label="warning" className="mr-2">⚠️</span>
      {msg}
    </div>
  );

  const renderInput = (label, name, type = 'text', show = false, toggle = null) => (
    <div className="relative">
      <label className={`absolute left-3 transition-all duration-300 ${formData[name] ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'}`}>{label}</label>
      <input
        type={show ? 'text' : type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={label}
        className="w-full p-3 rounded-md bg-orange-50 placeholder-transparent text-black focus:outline-none"
      />
      {toggle && (
        <div onClick={toggle} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
          {show ? <FaEye className="text-[#BD2D01]" /> : <FaEyeSlash className="text-[#BD2D01]" />}
        </div>
      )}
      {errors[name] && renderTooltip(errors[name])}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-xl relative" style={{ background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)' }}>
        <h2 className="text-white text-xl font-bold mb-4">Add Admin</h2>

        <div className="flex justify-center mb-4 relative">
          <label htmlFor="admin-profile-upload" className="cursor-pointer relative group">
            {profilePic ? (
              <img src={profilePic} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border-2 border-white" />
            ) : (
              <FaUserCircle className="text-white text-6xl" />
            )}
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm group-hover:scale-110 transition">
              <FaUpload className="text-[#F67F00] text-sm" />
            </div>
            <input id="admin-profile-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {renderInput('First Name', 'firstName')}
          {renderInput('Last Name', 'lastName')}
          {renderInput('Email', 'email', 'email')}
          {renderInput('Phone Number', 'telNo', 'text')}
          {renderInput('Password', 'password', 'password', showPass, () => setShowPass(!showPass))}
          {renderInput('Confirm Password', 'confirmPassword', 'password', showConfirm, () => setShowConfirm(!showConfirm))}

          <div className="flex justify-end">
            <button type="submit" className="mt-2 px-6 py-2 rounded-md text-white font-semibold" style={{ background: '#CF4602' }} disabled={loading}>
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>

        <button onClick={onClose} className="absolute top-2 right-3 text-white text-lg font-bold">✕</button>
      </div>
    </div>
  );
};

export default AddAdminModal;
