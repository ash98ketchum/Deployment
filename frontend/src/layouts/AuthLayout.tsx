// src/layouts/AuthLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* The <Outlet> renders the matching child route (e.g. SignInNGO, SignInRestaurant) */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
