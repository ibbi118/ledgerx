import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { PageLoader } from '../ui/Loader';

/**
 * ProtectedRoute — wraps routes that require authentication.
 * Shows loader during hydration, redirects to /login if not logged in.
 * systemOnly: if true, only systemUser=true can access.
 */
const ProtectedRoute = ({ children, systemOnly = false }) => {
  const { isAuthenticated, isSystemUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (systemOnly && !isSystemUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
