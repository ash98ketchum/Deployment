// src/pages/signin/SigninRestaurant.tsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import FloatingFoodIcons from "@/components/common/FloatingFoodIcons";

const SigninRestaurant: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/auth/login',
        { email, password }
      );
      localStorage.setItem('token', response.data.token);
      navigate('/restaurant');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-100 via-yellow-100 to-orange-50">
      <FloatingFoodIcons />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-green-50"
      >
        <div className="flex items-center justify-center mb-6 space-x-3">
          <ChefHat className="h-10 w-10 text-orange-600" />
          <h1 className="text-3xl font-extrabold text-gray-800">SmartMeal AI</h1>
        </div>

        <h2 className="text-center text-lg font-medium text-gray-700 mb-8">
          Access Your Restaurant Portal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="owner@smartmeal.ai"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">
              {error}
            </div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl text-orange-600 text-white font-semibold tracking-wide uppercase shadow-md hover: bg-orange-600 transition"
          >
            Sign In
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup/restaurant" className="text-orange-600 hover:underline">
            Sign up here
          </Link>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Not a restaurant?{' '}
          <Link to="/signin/ngo" className="text-orange-600 hover:underline">
            Sign in as NGO
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SigninRestaurant;