import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // ✅ Check if token exists (user logged in via Google OAuth)
  const isGoogleLoggedIn = !!localStorage.getItem('googleAccessToken');

  return currentUser || isGoogleLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
// This component checks if the user is authenticated (either via Firebase or Google OAuth)
// If authenticated, it renders the children components; otherwise, it redirects to the login page.