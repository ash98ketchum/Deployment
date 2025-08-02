import React, { useState } from 'react';
import { Link, NavLink, Outlet , useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Home, Grid, Clock, Archive, Menu, X, StarIcon, User, UtensilsCrossed, History, Handshake, File } from 'lucide-react';
import Footer from '@/components/common/Footer';
import FloatingFoodIcons from "@/components/common/FloatingFoodIcons";

const NGOLayout: React.FC = () => {
  const navigate = useNavigate();
  const [showMobile, setShowMobile] = useState(false);

  const links = [
    { to: '/ngo', label: 'Dashboard', Icon: Home },
    { to: '/ngo/availableFood', label: 'Available Food', Icon: UtensilsCrossed },
    { to: '/ngo/restaurantPartners', label: 'Restaurant Partners', Icon: Handshake },
    { to: '/ngo/MyRequests', label: 'My Requests', Icon: File },
    { to: '/ngo/history', label: 'History', Icon: History },
    { to: '/ngo/feedback', label: 'Feedback', Icon: StarIcon },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background Animation */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-50 via-orange-50 to-yellow-50"
          animate={{
            background: [
              "linear-gradient(135deg, #f0fdf4 0%, #fef3c7 50%, #fed7aa 100%)",
              "linear-gradient(135deg, #ecfdf5 0%, #fef3c7 50%, #fde68a 100%)",
              "linear-gradient(135deg, #f0fdf4 0%, #fed7aa 50%, #fef3c7 100%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      {/* Floating Icons */}
      <FloatingFoodIcons />

      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 select-none">
              <motion.div whileHover={{ rotate: 10 }} transition={{ type: 'spring', stiffness: 300 }}>
                <ChefHat className="h-8 w-8 text-green-600" />
              </motion.div>
              <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-xl font-bold text-transparent">
                SmartMeal AI
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {links.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/ngo'}
                  className={({ isActive }) =>
                    `flex items-center space-x-1 font-medium transition-colors duration-200 ${
                      isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobile(o => !o)}
              className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 md:hidden"
              aria-label="Toggle Menu"
            >
              {showMobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Links */}
          <AnimatePresence>
            {showMobile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden"
              >
                <div className="flex flex-col space-y-4 border-t border-gray-200 py-4">
                  {links.map(({ to, label, Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setShowMobile(false)}
                      className="flex items-center space-x-2 font-medium text-gray-700 px-4 py-2 transition-colors duration-200 hover:text-green-600"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Page Content */}
      <main className="flex-1 pt-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default NGOLayout;
