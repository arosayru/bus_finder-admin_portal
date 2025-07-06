import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../services/api'; // Make sure this exists and points to Heroku baseURL

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/admin/forgot-password', { Email: email });
      console.log('Reset link sent:', response.data);
      localStorage.setItem('resetEmail', email); // Store for use in verification
      navigate('/verify-email');
    } catch (err) {
      console.error('Error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
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
        <div className="flex items-center px-4 py-4 text-white font-bold text-lg cursor-pointer" onClick={() => navigate(-1)}>
          <FaArrowLeft className="mr-2" /> Forgot Password
        </div>
        <div className="border-b border-black w-full" />
      </div>

      {/* Form Box */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <h2
          className="text-2xl font-bold mb-2 bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(to right, #F67F00, #CF4602)' }}
        >
          Mail Address Here
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Enter the email address associated with your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter the email address"
            className="w-full p-3 rounded-md bg-orange-50 text-[#BD2D01] placeholder-[#F67F00] border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

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
            {loading ? 'Sending...' : 'Recover Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
