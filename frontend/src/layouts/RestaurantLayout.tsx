import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import RestaurantNavbar from "@/components/restaurant/Navbar";
import Footer from "@/components/common/Footer";
import FloatingFoodIcons from "@/components/common/FloatingFoodIcons";
import RestaurantChatbot from "@/Chatbots/RestaurantChatbot";

const RestaurantLayout: React.FC = () => (
  <>
    {/* Chatbot Floating Component */}
    <RestaurantChatbot />

    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
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
      <RestaurantNavbar />

      {/* Page Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  </>
);

export default RestaurantLayout;
