import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './ui/Spinner';

/**
 * Protects routes from unauthenticated users.
 * Optionally restricts by role.
 */
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
