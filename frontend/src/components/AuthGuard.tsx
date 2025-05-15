import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Box, CircularProgress } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true for protected routes, false for public routes
}

/**
 * AuthGuard component
 * 
 * A higher-order component that handles authentication logic:
 * - For protected routes (requireAuth=true): Redirects to login if not authenticated
 * - For public routes (requireAuth=false): Redirects to home if already authenticated
 * - Shows loading spinner while checking auth status
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  // For protected routes: redirect to login if not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // For public routes: redirect to home if already authenticated
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise, render the children
  return <>{children}</>;
};

export default AuthGuard;
