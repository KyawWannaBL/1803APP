import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import { getRoleLanding } from '@/lib/roleRouting';

export function SmartPortalHome() {
  const { user } = useAuth();
  const landing = getRoleLanding(user?.role);
  return <Navigate to={landing.path} replace />;
}

export default SmartPortalHome;