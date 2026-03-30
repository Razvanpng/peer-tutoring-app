import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StubPage = ({ label }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="px-4 py-2 border border-slate-200 rounded text-slate-500">{label}</div>
  </div>
);

const RootRedirect = () => {
  const { user, profile, isLoading } = useAuth();
  
  if (isLoading || (user && !profile)) return <LoadingSpinner />;
  if (!profile) return <Navigate to="/login" replace />;
  
  return <Navigate to={profile.role === 'mentor' ? '/mentor/dashboard' : '/mentee/dashboard'} replace />;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute role="mentee" />}>
            <Route path="/mentee/dashboard" element={<StubPage label="Mentee Dashboard" />} />
          </Route>

          <Route element={<RoleRoute role="mentor" />}>
            <Route path="/mentor/dashboard" element={<StubPage label="Mentor Dashboard" />} />
          </Route>

          <Route path="/session/:id" element={<StubPage label="Session View" />} />
          
          {/* Ruta principală rezolvată */}
          <Route path="/" element={<RootRedirect />} />
        </Route>

        <Route path="*" element={<StubPage label="404 Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}