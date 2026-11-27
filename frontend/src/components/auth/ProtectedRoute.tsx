import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, getAuthToken, getRedirectPathByRole } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'superadmin' | 'kasir' | 'operator' | 'kurir' | 'pelanggan'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = getAuthToken();
  const user = getCurrentUser();

  // 1. Jika belum login sama sekali, redirect ke /login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Jika ada filter role spesifik
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user.role || 'pelanggan').toLowerCase();
    const isAllowed = allowedRoles.some((r) => r.toLowerCase() === userRole);

    if (!isAllowed) {
      // Pelanggan mencoba akses modul superadmin -> alihkan ke portal pelanggan
      if (userRole === 'pelanggan') {
        return <Navigate to="/app/dashboard" replace />;
      }
      // Staf operasional yang mencoba rute di luar izinan -> alihkan ke dashboard admin
      return <Navigate to={getRedirectPathByRole(userRole)} replace />;
    }
  }

  return <>{children}</>;
};

// Guard untuk halaman login/register agar user yang sudah login tidak perlu login ulang
export const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = getAuthToken();
  const user = getCurrentUser();

  if (token && user) {
    return <Navigate to={getRedirectPathByRole(user.role)} replace />;
  }

  return <>{children}</>;
};
