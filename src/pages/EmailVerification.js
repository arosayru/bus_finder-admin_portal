import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../services/api'; // Axios instance with baseURL

const EmailVerification = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResendMsg('');
    setLoading(true);

    const email = localStorage.getItem('resetEmail');
    if (!email) {
      setError('Email is missing. Please go back and start again.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/admin/verify-oob-code', {
        email: email,
        oobCode: code,
      });

      const isValid =
        response.data === true ||
        response.data?.success === true ||
        (typeof response.data?.message === 'string' &&
          response.data.message.toLowerCase().includes('valid'));

      if (isValid) {
        navigate('/reset-password');
      } else {
        setError('Invalid or expired code. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to verify the code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    const email = localStorage.getItem('resetEmail');
    if (!email) {
      setError('Email not found. Please return to Forgot Password.');
      return;
    }

    setError('');
    setResendMsg('');
    setLoading(true);

    try {
      const response = await api.post('/admin/forgot-password', { Email: email });
      console.log('Resend success:', response.data);
      setResendMsg('A new code has been sent to your email.');
    } catch (err) {
      console.error('Resend error:', err.response?.data || err.message);
      setError('Failed to resend the code. Please try again.');
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
          <FaArrowLeft className="mr-2" /> Email Verification
        </div>
        <div className="border-b border-black w-full" />
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <h2
          className="text-2xl font-bold mb-2 bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(to right, #F67F00, #CF4602)' }}
        >
          Get Your Code
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Please enter the code that send to your email address
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            required
            value={code}
            onChange={handleChange}
            placeholder="Enter verification code"
            className="w-full p-3 rounded-md bg-orange-50 text-[#BD2D01] placeholder-[#F67F00] border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {resendMsg && <p className="text-green-600 text-sm">{resendMsg}</p>}

          <div className="text-sm text-gray-500">
            If you don’t received the code?{' '}
            <span
              onClick={resendCode}
              className="text-[#BD2D01] font-semibold cursor-pointer hover:underline"
            >
              Resend
            </span>
          </div>

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
            {loading ? 'Verifying...' : 'Verify and Proceed'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;
