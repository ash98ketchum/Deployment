// frontend/src/layouts/MainLayout.tsx
import React from "react";
import { motion } from "framer-motion";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingFoodIcons from "@/components/common/FloatingFoodIcons";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-green-50 via-orange-50 to-yellow-50">
    {/* ✨ Animated colour shift */}
    <FloatingFoodIcons />
    <motion.div
      className="absolute inset-0 -z-20"
      animate={{
        background: [
          "linear-gradient(135deg,#f0fdf4 0%,#fef3c7 50%,#fed7aa 100%)",
          "linear-gradient(135deg,#ecfdf5 0%,#fef3c7 50%,#fde68a 100%)",
          "linear-gradient(135deg,#f0fdf4 0%,#fed7aa 50%,#fef3c7 100%)",
        ],
      }}
      transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
    />

    {/* 🍎 Floating icons (single instance) */}
    

    {/* 🌐 Site chrome + content */}
    <Navbar />
    <main className="flex-1 container mx-auto px-4">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;
