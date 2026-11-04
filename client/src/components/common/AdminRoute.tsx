import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const AdminRoute: React.FC = () => {
  const { user, isInitialized } = useSelector((s: RootState) => s.auth);
  const location = useLocation();

  if (!isInitialized) return null;

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
