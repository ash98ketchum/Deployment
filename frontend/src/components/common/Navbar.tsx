// frontend/src/components/common/Navbar.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, ChevronDown, Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showMobile, setShowMobile] = useState(false);

  /** Handles click on either role inside the dropdown */
  const handleRoleClick = (path: string) => {
    setShowRoleMenu(false);
    setShowMobile(false);
    navigate(path);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ───────────────  Logo  ─────────────── */}
          <Link to="/" className="flex items-center space-x-2 select-none">
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChefHat className="h-8 w-8 text-green-600" />
            </motion.div>
            <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-xl font-bold text-transparent">
              SmartMeal AI
            </span>
          </Link>

          {/* ───────────────  Desktop Links  ─────────────── */}
          <div className="hidden items-center space-x-8 md:flex">
            {[
              { href: "/", label: "Home" },
              // { href: "/food-details", label: "Available Food" },
              { href: "/reviews", label: "Reviews" },
              { href: "/faq", label: "FAQs" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                to={href}
                className="font-medium text-gray-700 transition-colors duration-200 hover:text-green-600"
              >
                {label}
              </Link>
            ))}

            {/* Sign-in dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRoleMenu((o) => !o)}
                className="flex items-center space-x-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-white transition-all duration-200 hover:from-green-700 hover:to-green-800 focus:outline-none"
              >
                <span>Sign In</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    showRoleMenu ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {showRoleMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
                  >
                    {[
                      {
                        label: "Sign in as NGO",
                        color:
                          "hover:bg-green-50 hover:text-green-600 text-gray-700",
                        to: "/signin/ngo",
                      },
                      {
                        label: "Sign in as Restaurant Owner",
                        color:
                          "hover:bg-orange-50 hover:text-orange-600 text-gray-700",
                        to: "/signin/restaurant",
                      },
                    ].map(({ label, color, to }) => (
                      <button
                        key={to}
                        onClick={() => handleRoleClick(to)}
                        className={`block w-full px-4 py-2 text-left text-sm ${color} transition-colors duration-200`}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ───────────────  Mobile burger  ─────────────── */}
          <button
            onClick={() => setShowMobile((o) => !o)}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 md:hidden"
            aria-label="Toggle Menu"
          >
            {showMobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* ───────────────  Mobile menu  ─────────────── */}
        <AnimatePresence>
          {showMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="flex flex-col space-y-4 border-t border-gray-200 py-4">
                {[
                  { href: "/", label: "Home" },
                  { href: "/food-details", label: "Available Food" },
                  { href: "/reviews", label: "Reviews" },
                  { href: "/faq", label: "FAQs" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setShowMobile(false)}
                    className="font-medium text-gray-700 transition-colors duration-200 hover:text-green-600"
                  >
                    {label}
                  </Link>
                ))}

                <div className="mt-4 border-t border-gray-200 pt-4">
                  <button
                    onClick={() => handleRoleClick("/signin/ngo")}
                    className="mb-2 w-full text-left font-medium text-gray-700 transition-colors duration-200 hover:text-green-600"
                  >
                    Sign in as NGO
                  </button>
                  <button
                    onClick={() => handleRoleClick("/signin/restaurant")}
                    className="w-full text-left font-medium text-gray-700 transition-colors duration-200 hover:text-orange-600"
                  >
                    Sign in as Restaurant Owner
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
