import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
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

function SystemLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#05090f] bg-grain flex flex-col items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-6">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Routing Systems...</p>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) return <SystemLoader />;
  if (!user) return <LandingPage />;
  if (user && !profile) return <SystemLoader />;

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