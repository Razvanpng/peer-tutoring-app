import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ROLE_HOME = {
  mentee: '/mentee/dashboard',
  mentor: '/mentor/dashboard',
};

export default function RoleRoute({ role }) {
  const { profile, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (!profile) return <Navigate to="/" replace />;

  if (profile.role !== role) {
    return <Navigate to={ROLE_HOME[profile.role] || '/'} replace />;
  }

  return <Outlet />;
}