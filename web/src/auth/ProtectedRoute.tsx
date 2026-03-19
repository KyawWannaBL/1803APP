import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/auth/AuthProvider';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <section className="page-card"><div className="empty-state">Loading session...</div></section>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}