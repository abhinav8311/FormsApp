import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Only check for Google OAuth login
  const isGoogleLoggedIn = !!localStorage.getItem('googleAccessToken');
  return isGoogleLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
// This component now only checks for Google OAuth login.