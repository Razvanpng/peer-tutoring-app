import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MainLayout from '../components/layout/MainLayout';

import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import MenteeDashboard from '../pages/mentee/MenteeDashboard';
import MentorDashboard from '../pages/mentor/MentorDashboard';
import MentorDirectory from '../pages/mentee/MentorDirectory';
import SessionView from '../pages/session/SessionView';
import ProfileSettings from '../pages/profile/ProfileSettings';
import NotFoundPage from '../pages/NotFoundPage';

function RootRedirect() {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <LandingPage />;
  if (user && !profile) return <LoadingSpinner />;

  return (
    <Navigate
      to={profile.role === 'mentor' ? '/mentor/dashboard' : '/mentee/dashboard'}
      replace
    />
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<RootRedirect />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            <Route element={<RoleRoute role="mentee" />}>
              <Route path="/mentee/dashboard" element={<MenteeDashboard />} />
              <Route path="/mentee/directory" element={<MentorDirectory />} />
            </Route>

            <Route element={<RoleRoute role="mentor" />}>
              <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            </Route>

            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/session/:id" element={<SessionView />} />

          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}