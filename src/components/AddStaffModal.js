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
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    telNo: '',
    nic: '',
    staffRole: '',
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
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateNIC = (nic) => {
    return /^\d{9}[VXvx]$/.test(nic) || /^\d{12}$/.test(nic);
  };

  const validateForm = () => {
    const newErrors = {};
    const { firstName, lastName, email, telNo, nic, staffRole, password } = formData;

    if (!firstName.trim()) newErrors.firstName = 'Please fill out this field.';
    else if (!/^[A-Za-z]+$/.test(firstName)) newErrors.firstName = 'Only letters allowed.';

    if (!lastName.trim()) newErrors.lastName = 'Please fill out this field.';
    else if (!/^[A-Za-z]+$/.test(lastName)) newErrors.lastName = 'Only letters allowed.';

    if (!email.trim()) newErrors.email = 'Please fill out this field.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format.';

    if (!telNo.trim()) newErrors.telNo = 'Please fill out this field.';
    else if (!/^\d{10}$/.test(telNo)) newErrors.telNo = 'Must be exactly 10 digits.';

    if (!nic.trim()) newErrors.nic = 'Please fill out this field.';
    else if (!validateNIC(nic)) newErrors.nic = 'NIC format is invalid.';

    if (!staffRole) newErrors.staffRole = 'Please select a staff role.';

    if (!password) newErrors.password = 'Please fill out this field.';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderTooltip = (msg) => (
    <div className="absolute left-0 mt-1 bg-white text-black text-sm rounded shadow-md border border-gray-300 px-3 py-2 z-10">
      <div className="absolute -top-2 left-4 w-3 h-3 bg-white rotate-45 border-l border-t border-gray-300"></div>
      <span role="img" aria-label="warning" className="mr-2">⚠️</span>
      {msg}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const newStaff = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        telNo: formData.telNo,
        nic: formData.nic,
        password: formData.password,
        staffRole: formData.staffRole,
      };

      const createRes = await api.post('/staff', newStaff);
      if (createRes.status === 201 || createRes.status === 200) {
        onAddStaff?.(createRes.data);
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

  const renderField = (name, type = 'text', label = '', value, extra = {}) => (
    <div className="relative">
      <label
        htmlFor={name}
        className={`absolute left-3 transition-all duration-300 ${
          value ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
        }`}
      >
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={label}
        value={value}
        onChange={handleChange}
        className="w-full p-3 rounded-md bg-orange-50 placeholder-transparent text-black focus:outline-none"
        {...extra}
      />
      {errors[name] && renderTooltip(errors[name])}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-xl relative" style={{ background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)' }}>
        <h2 className="text-white text-xl font-bold mb-4">Add Staff</h2>

        <div className="flex justify-center mb-4 relative">
          <label htmlFor="staff-profile-upload" className="cursor-pointer relative group">
            {profilePicPreview ? (
              <img src={profilePicPreview} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border-2 border-white" />
            ) : (
              <FaUserCircle className="text-white text-6xl" />
            )}
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm group-hover:scale-110 transition">
              <FaUpload className="text-[#F67F00] text-sm" />
            </div>
            <input id="staff-profile-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        {errorMessage && <div className="text-red-500 text-center mb-3 text-sm">{errorMessage}</div>}

        <form className="space-y-3" onSubmit={handleSubmit}>
          {renderField('firstName', 'text', 'First Name', formData.firstName)}
          {renderField('lastName', 'text', 'Last Name', formData.lastName)}
          {renderField('email', 'email', 'Email', formData.email)}
          {renderField('telNo', 'text', 'Phone Number', formData.telNo)}
          {renderField('nic', 'text', 'NIC', formData.nic)}

          <div className="relative">
            <select
              name="staffRole"
              value={formData.staffRole}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-orange-50 text-black focus:outline-none"
            >
              <option value="">Select Staff Role</option>
              <option value="Driver">Driver</option>
              <option value="Conductor">Conductor</option>
            </select>
            {errors.staffRole && renderTooltip(errors.staffRole)}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className={`absolute left-3 transition-all duration-300 ${
                formData.password ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
              }`}
            >
              Password
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 pr-10 rounded-md bg-orange-50 placeholder-transparent text-black focus:outline-none"
            />
            {errors.password && renderTooltip(errors.password)}
            <div onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
              {showPass ? <FaEye className="text-[#BD2D01]" /> : <FaEyeSlash className="text-[#BD2D01]" />}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className={`absolute left-3 transition-all duration-300 ${
                confirmPassword ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
              }`}
            >
              Confirm Password
            </label>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full p-3 pr-10 rounded-md bg-orange-50 placeholder-transparent text-black focus:outline-none"
            />
            {errors.confirmPassword && renderTooltip(errors.confirmPassword)}
            <div onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
              {showConfirm ? <FaEye className="text-[#BD2D01]" /> : <FaEyeSlash className="text-[#BD2D01]" />}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="mt-2 px-6 py-2 rounded-md text-white font-semibold" style={{ background: '#CF4602' }}>
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>

        <button onClick={onClose} className="absolute top-2 right-3 text-white text-lg font-bold">✕</button>
      </div>
    </div>
  );
};

export default AddStaffModal;
