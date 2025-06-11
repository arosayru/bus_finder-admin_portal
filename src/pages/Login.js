import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FaUser, FaEye } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #BD2D01 0%, #CF4602 10%, #F67F00 50%, #CF4602 90%, #BD2D01 100%)',
      }}
    >
      {/* Logo outside the form */}
      <div className="flex flex-col items-center mb-6">
        <img src={logo} alt="Bus Logo" className="w-50 mb-2" />
      </div>

      {/* Login box */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2
          className="text-center text-2xl font-bold mb-6 bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(to right, #F67F00 0%, #CF4602 69%)',
          }}
        >
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              name="email"
              type="text"
              value={form.email}
              onChange={handleChange}
              placeholder="Email or username"
              className="w-full p-3 pr-10 border border-orange-300 rounded-md bg-orange-50 text-[#F67F00] placeholder-[#F67F00] focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#BD2D01]" />
          </div>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 pr-10 border border-orange-300 rounded-md bg-orange-50 text-[#F67F00] placeholder-[#F67F00] focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FaEye className="text-[#BD2D01]" />
            </div>
          </div>

          <div
            className="text-right text-sm text-[#BD2D01] hover:underline cursor-pointer"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </div>

          {error && (
            <p className="text-sm text-center text-red-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-md font-semibold text-white transition duration-300"
            style={{
              background: 'linear-gradient(to bottom, #F67F00, #CF4602)',
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = 'linear-gradient(to bottom, #CF4602, #F67F00)')
            }
            onMouseLeave={(e) =>
              (e.target.style.background = 'linear-gradient(to bottom, #F67F00, #CF4602)')
            }
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
