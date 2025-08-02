// src/components/ui/Badge.tsx
import React from "react";
import { motion } from "framer-motion";

interface BadgeProps {
  confidence: number;    // 0–100 percentage
  showLabel?: boolean;
  className?: string;
}

const getLevel = (confidence: number): "low" | "medium" | "high" => {
  if (confidence < 40) return "low";
  if (confidence < 75) return "medium";
  return "high";
};

const Badge: React.FC<BadgeProps> = ({
  confidence,
  showLabel = true,
  className = "",
}) => {
  const level = getLevel(confidence);

  const bgColor =
    level === "low"
      ? "bg-red-100"
      : level === "medium"
      ? "bg-yellow-100"
      : "bg-green-100";

  const textColor =
    level === "low"
      ? "text-red-600"
      : level === "medium"
      ? "text-yellow-600"
      : "text-green-700";

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor} ${className}`}
    >
      <motion.span
        animate={{
          boxShadow: [
            "0 0 0px currentColor",
            "0 0 4px currentColor",
            "0 0 0px currentColor",
          ],
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mr-1.5 h-2 w-2 rounded-full"
      />
      {confidence}%{showLabel && (
        <span className="ml-1 capitalize">{level}</span>
      )}
    </motion.div>
  );
};

export default Badge;
