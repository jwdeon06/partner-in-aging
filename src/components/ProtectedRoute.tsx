import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'member';
  requireAuth?: boolean;
}

export default function ProtectedRoute({ children, requireRole = 'member', requireAuth = true }: ProtectedRouteProps) {
  const { user, userProfile } = useAuth();

  if (requireAuth && !user) {
    return <Navigate to="/login" />;
  }

  if (requireRole === 'admin' && userProfile?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}