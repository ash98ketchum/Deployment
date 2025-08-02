// NgoBadge.tsx
import React from 'react';
import clsx from 'clsx'; // optional, for cleaner conditional classes

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | string; // add more if needed
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'info', size = 'md', children }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variantClasses: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const finalClassName = clsx(
    baseClasses,
    variantClasses[variant] || variantClasses['info'],
    sizeClasses[size] || sizeClasses['md']
  );

  return <span className={finalClassName}>{children}</span>;
};

export default Badge;
