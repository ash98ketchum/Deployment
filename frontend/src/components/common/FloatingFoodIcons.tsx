import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Coffee, Wheat, Utensils, Cherry, Cookie } from 'lucide-react';

const FloatingFoodIcons: React.FC = () => {
  const foodIcons = [
    { Icon: Apple, delay: 0, x: '10%', y: '20%' },
    { Icon: Coffee, delay: 1, x: '80%', y: '30%' },
    { Icon: Wheat, delay: 2, x: '20%', y: '70%' },
    { Icon: Utensils, delay: 3, x: '70%', y: '80%' },
    { Icon: Cherry, delay: 4, x: '90%', y: '60%' },
    { Icon: Cookie, delay: 0.5, x: '30%', y: '40%' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {foodIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: x,
            top: y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 10, -10, 0],
            y: [-10, 10, -10]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
          }}
        >
          <Icon className="h-10 w-10 black-300/40" />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingFoodIcons;