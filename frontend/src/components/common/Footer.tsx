// frontend/src/components/common/Footer.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

// 👉  Replace with real counter hook once backend is wired
const DummyPlatesSaved = () => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="text-4xl font-extrabold text-orange-400"
  >
    24 673
  </motion.span>
);

const Footer: React.FC = () => (
  <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-4">
        {/* ───────────────  Brand  ─────────────── */}
        <div className="col-span-1 md:col-span-2">
          <div className="mb-4 flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Heart className="h-8 w-8 text-orange-400" />
            </motion.div>
            <span className="text-2xl font-bold">SmartMeal AI</span>
          </div>

          <p className="mb-6 max-w-md leading-relaxed text-green-100">
            Connecting restaurants and NGOs to reduce food waste and feed
            communities. Every meal saved is a step towards a sustainable
            future.
          </p>

          {/* live counter placeholder */}
          <div className="mb-6 flex flex-col space-y-1">
            <span className="text-sm uppercase tracking-wide text-green-300">
              Plates saved so far
            </span>
            <DummyPlatesSaved />
          </div>

          <p className="text-sm text-green-200">
            Version 1.0.0 | Built with ❤️ for humanity
          </p>
        </div>

        {/* ───────────────  Contact  ─────────────── */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-orange-400">
            Contact Us
          </h3>
          <ul className="space-y-3 text-green-100">
            <li className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>hello@smartmeal.ai</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>San Francisco, CA</span>
            </li>
          </ul>
        </div>

        {/* ───────────────  Social  ─────────────── */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-orange-400">
            Follow Us
          </h3>
          <div className="flex space-x-4">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="rounded-lg bg-green-700 p-2 transition-colors duration-200 hover:bg-green-600"
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-green-700 pt-8 text-center text-green-200">
        &copy; 2025 SmartMeal AI. All rights reserved. Made with purpose to end
        food waste.
      </div>
    </div>
  </footer>
);

export default Footer;
