// src/components/ui/Card.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = true,
  hoverEffect = true,
  onClick,
}) => {
  // Base styling for all cards
  const baseClasses =
    "bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden";

  // If glow prop is set, apply a ring
  const glowClasses = glow
    ? "ring-2 ring-green-200 ring-opacity-40"
    : "";

  // If hoverEffect is true, apply these hover states
  const hoverClasses = hoverEffect
    ? "hover:shadow-xl hover:border-orange-200 cursor-pointer"
    : "";

  // Wrap in motion.div if hoverEffect to get smooth animation
  if (hoverEffect) {
    return (
      <motion.div
        className={`${baseClasses} ${glowClasses} ${hoverClasses} ${className}`}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  // Otherwise, a plain div
  return (
    <div
      className={`${baseClasses} ${glowClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
