import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = () => {
  const token = localStorage.getItem('adminToken');

  if (token) {
    // If token exists, render the component (e.g., AdminDashboard)
    return <Outlet />;
  } else {
    // If no token, redirect to the login page
    return <Navigate to="/admin/login" replace />;
  }
};

export default ProtectedAdminRoute;