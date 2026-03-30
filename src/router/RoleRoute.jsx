import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ROLE_HOME = {
  mentee: '/mentee/dashboard',
  mentor: '/mentor/dashboard',
};

export default function RoleRoute({ role }) {
  const { user, profile, isLoading } = useAuth();

  if (isLoading || (user && !profile)) return <LoadingSpinner />;

  if (!profile) return <Navigate to="/login" replace />;

  if (profile.role !== role) {
    return <Navigate to={ROLE_HOME[profile.role] || '/login'} replace />;
  }

  return <Outlet />;
}