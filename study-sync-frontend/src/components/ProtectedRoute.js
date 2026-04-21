import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, requirePreferences = false }) => {
  const { isAuthenticated, isNewUser } = useContext(AuthContext);
  
  if (!isAuthenticated && !localStorage.getItem('token')) {
    return <Navigate to="/login" replace />;
  }

  // Force onboarding lock
  if (requirePreferences && isNewUser) {
    return <Navigate to="/preferences" replace />;
  }
  
  return children;
};
