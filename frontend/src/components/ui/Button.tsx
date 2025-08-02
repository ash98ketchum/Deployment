// src/components/ui/Button.tsx
import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'transparent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'solid',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}) => {
  const base =
    'relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white';
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variants = {
    solid: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-300',
    outline:
      'bg-white border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-300',
    transparent: 'bg-transparent text-green-600 hover:bg-green-50 focus:ring-green-300',
  };
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  return (
    <motion.button
      {...(props as any)}
      className={classes}
      whileTap={{ scale: 0.97 }}
      disabled={isLoading || props.disabled}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 
               12h4zm2 5.291A7.962 7.962 0 014 
               12H0c0 3.042 1.135 5.824
               3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
      <motion.div
        className="absolute w-full h-full rounded-lg pointer-events-none"
        initial={false}
        animate="initial"
        whileTap="tap"
        variants={{
          initial: { opacity: 0 },
          tap: {
            opacity: [0, 0.4, 0],
            scale: [0, 1.4, 1.8],
            transition: { duration: 0.5 },
          },
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </motion.button>
  );
};

export default Button;
