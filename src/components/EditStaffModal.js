import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaUserCircle, FaUpload } from 'react-icons/fa';
import api from '../services/api';

const EditStaffModal = ({ staff, onClose, onUpdate }) => {
  const [form, setForm] = useState({ ...staff });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profilePic, setProfilePic] = useState(staff.profilePicture || null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const validateNIC = (nic) => {
    return /^\d{9}[VXvx]$/.test(nic) || /^\d{12}$/.test(nic);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = 'Please fill out this field.';
    else if (!/^[A-Za-z]+$/.test(form.firstName)) newErrors.firstName = 'Only letters allowed.';

    if (!form.lastName.trim()) newErrors.lastName = 'Please fill out this field.';
    else if (!/^[A-Za-z]+$/.test(form.lastName)) newErrors.lastName = 'Only letters allowed.';

    if (!form.telNo.trim()) newErrors.telNo = 'Please fill out this field.';
    else if (!/^\d{10}$/.test(form.telNo)) newErrors.telNo = 'Must be exactly 10 digits.';

    if (!form.nic.trim()) newErrors.nic = 'Please fill out this field.';
    else if (!validateNIC(form.nic)) newErrors.nic = 'NIC format is invalid.';

    if (!form.staffRole) newErrors.staffRole = 'Please select a staff role.';

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
    if (!validate()) return;

    const updatedStaff = { ...form, profilePicture: profilePic };

    try {
      const response = await api.put(`/staff/${staff.staffId}`, updatedStaff);

      if (response.status === 200 || response.status === 204) {
        onUpdate(updatedStaff); 
        onClose();
      } else {
        setErrorMessage(`Failed to update staff. Status: ${response.status}`);
        console.error('Failed to update staff', response);
      }
    } catch (err) {
      setErrorMessage(`Error updating staff: ${err.message}`);
      console.error('Error updating staff:', err);
    }
  };

  const renderInput = (label, name, type = 'text') => (
    <div className="relative">
      <label htmlFor={name} className={`absolute left-3 transition-all duration-300 ${form[name] ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'}`}>{label}</label>
      <input
        name={name}
        type={type}
        placeholder={label}
        value={form[name]}
        onChange={handleChange}
        className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-transparent focus:outline-none"
      />
      {errors[name] && renderTooltip(errors[name])}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-xl relative" style={{ background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)' }}>
        <h2 className="text-white text-xl font-bold mb-4">Edit Staff</h2>

        {errorMessage && <div className="text-red-500 text-center mb-3 text-sm">{errorMessage}</div>}

        <div className="flex justify-center mb-4 relative">
          <label htmlFor="edit-profile-upload" className="cursor-pointer relative group">
            {profilePic ? (
              <img src={profilePic} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border-2 border-white" />
            ) : (
              <FaUserCircle className="text-white text-6xl" />
            )}
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm group-hover:scale-110 transition">
              <FaUpload className="text-[#F67F00] text-sm" />
            </div>
            <input id="edit-profile-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {renderInput('First Name', 'firstName')}
          {renderInput('Last Name', 'lastName')}

          <div className="relative">
            <label htmlFor="email" className={`absolute left-3 transition-all duration-300 ${form.email ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'}`}>Email</label>
            <input name="email" type="email" placeholder="Email" value={form.email} disabled className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-transparent cursor-not-allowed focus:outline-none" />
          </div>

          {renderInput('NIC', 'nic')}
          {renderInput('Phone Number', 'telNo')}

          <div className="relative">
            <label htmlFor="staffRole" className={`absolute left-3 transition-all duration-300 ${form.staffRole ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'}`}>Staff Role</label>
            <select name="staffRole" value={form.staffRole} onChange={handleChange} className="w-full p-3 rounded-md bg-orange-50 text-black focus:outline-none">
              <option value="">Select Staff Role</option>
              <option value="Driver">Driver</option>
              <option value="Conductor">Conductor</option>
            </select>
            {errors.staffRole && renderTooltip(errors.staffRole)}
          </div>

          <div className="flex justify-end">
            <button type="submit" className="mt-2 px-6 py-2 rounded-md text-white font-semibold" style={{ background: '#CF4602' }}>Update</button>
          </div>
        </form>

        <button onClick={onClose} className="absolute top-2 right-3 text-white text-lg font-bold">✕</button>
      </div>
    </div>
  );
};

export default EditStaffModal;