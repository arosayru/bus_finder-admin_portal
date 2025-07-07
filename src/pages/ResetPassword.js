import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../services/api'; // Axios instance with baseURL

const ResetPassword = () => {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState({ pass: false, confirm: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const email = localStorage.getItem('resetEmail');
    if (!email) {
      setError('Email not found. Please restart the reset process.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/admin/reset-password', {
        Email: email,
        NewPassword: form.password,
      });

      if (response.status === 200 || response.data?.success === true) {
        navigate('/'); // redirect to login
      } else {
        setError('Password reset failed. Please try again.');
      }
    } catch (err) {
      console.error('Reset error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #BD2D01 0%, #CF4602 10%, #F67F00 50%, #CF4602 90%, #BD2D01 100%)',
      }}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full">
        <div
          className="flex items-center px-4 py-4 text-white font-bold text-lg cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Reset Password
        </div>
        <div className="border-b border-black w-full" />
      </div>

      {/* Box */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center mt-24">
        <h2
          className="text-2xl font-bold mb-2 bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(to right, #F67F00, #CF4602)' }}
        >
          Enter New Password
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Your new password must be different<br />
          from previously used password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPass.pass ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 pr-10 rounded-md bg-orange-50 text-[#BD2D01] placeholder-[#F67F00] border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPass({ ...showPass, pass: !showPass.pass })}
            >
              {showPass.pass ? (
                <FaEye className="text-[#BD2D01]" />
              ) : (
                <FaEyeSlash className="text-[#BD2D01]" />
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              name="confirmPassword"
              type={showPass.confirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-3 pr-10 rounded-md bg-orange-50 text-[#BD2D01] placeholder-[#F67F00] border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
            >
              {showPass.confirm ? (
                <FaEye className="text-[#BD2D01]" />
              ) : (
                <FaEyeSlash className="text-[#BD2D01]" />
              )}
            </div>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-md font-semibold text-white transition duration-300"
            style={{
              background: 'linear-gradient(to bottom, #F67F00, #CF4602)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
            onMouseEnter={(e) =>
              (e.target.style.background = 'linear-gradient(to bottom, #CF4602, #F67F00)')
            }
            onMouseLeave={(e) =>
              (e.target.style.background = 'linear-gradient(to bottom, #F67F00, #CF4602)')
            }
          >
            {loading ? 'Submitting...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
