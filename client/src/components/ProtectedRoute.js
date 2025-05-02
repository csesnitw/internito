import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) return null; // or a spinner

  return isLoggedIn ? children : <Navigate to="/" />;
}

export default ProtectedRoute;