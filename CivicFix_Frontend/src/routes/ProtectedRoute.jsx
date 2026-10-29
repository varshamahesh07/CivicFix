import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to appropriate login portal
  if (!currentUser) {
    if (allowedRole === 'authority') {
      return <Navigate to="/authority/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/citizen/login" state={{ from: location }} replace />;
  }

  // If user role doesn't match allowedRole, redirect to user's authorized home
  if (allowedRole && currentUser.role !== allowedRole) {
    if (currentUser.role === 'citizen') {
      return <Navigate to="/citizen/dashboard" replace />;
    }
    if (currentUser.role === 'authority') {
      return <Navigate to="/authority/dashboard" replace />;
    }
  }

  return children;
}
