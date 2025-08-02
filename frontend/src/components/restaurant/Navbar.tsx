// frontend/src/components/restaurant/Navbar.tsx
import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChefHat,
  Settings,
  Home,
  PlusCircle,
  Clock,
  Calendar,
  File,
  Upload,
} from "lucide-react";

const NAV_LINKS = [
  { to: "/restaurant",           label: "Dashboard", Icon: Home },
  { to: "/restaurant/serving",   label: "Serving",   Icon: PlusCircle },
  { to: "/restaurant/events",    label: "Events",    Icon: Calendar },
   { to: "/restaurant/form",    label: "Upload Food",    Icon: Upload },
    { to: "/restaurant/request",    label: "NGO Request",    Icon: File },
  { to: "/restaurant/settings",  label: "Settings",  Icon: Settings },
  { to: "/restaurant/history",   label: "History",   Icon: Clock },   
] as const;

const RestaurantNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* shadow / blur on scroll */
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 py-4 transition-all duration-300 ${
        scrolled ? "bg-white/80 shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 select-none">
                          <motion.div
                            whileHover={{ rotate: 10 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <ChefHat className="h-8 w-8 text-green-600" />
                          </motion.div>
                          <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-xl font-bold text-transparent">
                            SmartMeal AI 
                          </span>
                        </Link>
          </div>

          {/* Desktop */}
          <ul className="hidden items-center space-x-6 md:flex">
            {NAV_LINKS.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `relative flex items-center text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-green-600"
                        : "text-gray-600 hover:text-green-600"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={16} className="mr-1" />
                      {label}
                      {isActive && (
                        <motion.div
                          layoutId="restaurant-navbar-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-600"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Burger */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="block text-gray-700 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/90 pt-20 backdrop-blur-md md:hidden"
          >
            <div className="container mx-auto px-4">
              <ul className="flex flex-col space-y-4">
                {NAV_LINKS.map(({ to, label, Icon }, i) => (
                  <motion.li
                    key={to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                  >
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center rounded-lg px-4 py-3 text-lg ${
                          isActive
                            ? "bg-green-100 text-green-600"
                            : "text-gray-600 hover:bg-green-50"
                        }`
                      }
                      onClick={() => setOpen(false)}
                    >
                      <Icon size={20} className="mr-3" />
                      {label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default RestaurantNavbar;
