// src/pages/SignUpNGO.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HandHeart } from 'lucide-react';
import { motion } from 'framer-motion';
import FloatingFoodIcons from '@/components/common/FloatingFoodIcons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const SignUpNGO: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ngoName, setNgoName] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        role: 'NGO',
        ngoName,         // changed here
        aadharNumber,
      });

      localStorage.setItem('token', response.data.token);
      navigate('/signin/ngo');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Sign up failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gradient-to-br from-green-100 via-yellow-100 to-orange-50 relative">
      <FloatingFoodIcons />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-xl px-10 py-6 bg-white rounded-3xl shadow-2xl border border-green-50"
      >
        <div className="flex items-center justify-center mb-6 space-x-3">
          <HandHeart className="h-10 w-10 text-green-600" />
          <h1 className="text-3xl font-extrabold text-gray-800">SmartMeal AI</h1>
        </div>

        <h2 className="text-center text-lg font-medium text-gray-700 mb-4">Join as NGO Partner</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

            <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">NGO Name</label>
            <input
              type="text"
              value={ngoName}
              onChange={(e) => setNgoName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 transition"
              placeholder="Helping Hands Foundation"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 transition"
              placeholder="ngo@smartmeal.ai"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Aadhar Number</label>
            <input
              type="text"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          {error && <div className="text-sm text-red-500 text-center">{error}</div>}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold uppercase shadow-md hover:bg-green-700 transition"
          >
            Sign Up
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin/ngo" className="text-green-600 hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpNGO;
