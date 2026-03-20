import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';

type ProtectedRouteProps = {
  children?: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <section className="page-card"><div className="empty-state">Loading session...</div></section>;
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children ? <>{children}</> : <Outlet />;
}