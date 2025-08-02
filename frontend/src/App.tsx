import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Axios interceptor: attach token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import MainLayout       from '@/layouts/MainLayout';
import RestaurantLayout from '@/layouts/RestaurantLayout';
import NGOLayout        from '@/layouts/NGOLayout';

import Landing          from '@/pages/public/Landing';
import FoodDetails      from '@/pages/public/FoodDetails';
import Reviews          from '@/pages/public/Reviews';
import FAQ              from '@/pages/public/FAQ';

import SigninNGO        from '@/pages/authentication/SigninNGO';
import SigninRestaurant from '@/pages/authentication/SigninRestaurant';
import SignUpNGO        from '@/pages/authentication/SignUpNGO';
import SignUpRestaurant from './pages/authentication/SignUpRestaurant';

import Dashboard        from '@/pages/restaurant/Dashboard';
import TodaysServing    from '@/pages/restaurant/TodaysServing';
import EventsPage       from '@/pages/restaurant/Events';
import FoodRequest       from '@/pages/restaurant/FoodRequest';
import FoodUploadForm       from '@/pages/restaurant/FoodUploadForm';
import Settings         from '@/pages/restaurant/Settings';
import History          from '@/pages/restaurant/History';

import MyRequests       from '@/pages/NGO/MyRequests';
import AvailabilityNGO  from '@/pages/NGO/AvailabilityNGO';
import RestaurantPartners from '@/pages/NGO/RestaurantPartners';
import HistoryNGO       from '@/pages/NGO/HistoryNGO';
import FeedbackNGO      from '@/pages/NGO/FeedbackNGO';
import NgoDashboard     from '@/pages/NGO/NGoDashboard';

import PrivateRoute     from '@/components/auth/PrivateRoute';

const App: React.FC = () => (
  <Router>
    <Routes>
      {/* Public */}
      <Route path="/"                 element={<MainLayout><Landing   /></MainLayout>} />
      <Route path="/food-details"     element={<MainLayout><FoodDetails/></MainLayout>} />
      <Route path="/reviews"          element={<MainLayout><Reviews    /></MainLayout>} />
      <Route path="/faq"              element={<MainLayout><FAQ        /></MainLayout>} />

      {/* Authentication */}
      <Route path="/signin/ngo"        element={<SigninNGO       />} />
      <Route path="/signin/restaurant" element={<SigninRestaurant/>} />
      <Route path="/signup/ngo"        element={<SignUpNGO />} />
      <Route path="/signup/restaurant" element={<SignUpRestaurant />} />

      {/* Restaurant Routes */}
      <Route path="/restaurant" element={
        <PrivateRoute>
          <RestaurantLayout />
        </PrivateRoute>
      }>
        <Route index            element={<Dashboard     />} />
        <Route path="serving"   element={<TodaysServing />} />
        <Route path="events"    element={<EventsPage    />} />
        <Route path="form"    element={<FoodUploadForm    />} />
        <Route path="request"    element={<FoodRequest    />} />
        <Route path="settings"  element={<Settings      />} />
        <Route path="history"   element={<History       />} />
        <Route path="*"         element={<Navigate to="/restaurant" replace />} />
      </Route>

      {/* NGO Routes */}
      <Route path="/ngo" element={
        <PrivateRoute>
          <NGOLayout />
        </PrivateRoute>
      }>
        <Route index                 element={<NgoDashboard     />} />
        <Route path="availableFood" element={<AvailabilityNGO />} />
        <Route path="MyRequests"    element={<MyRequests      />} />
        <Route path="restaurantPartners" element={<RestaurantPartners />} />
        <Route path="history"       element={<HistoryNGO       />} />
        <Route path="feedback"      element={<FeedbackNGO      />} />
        <Route path="*"             element={<Navigate to="/ngo" replace />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
