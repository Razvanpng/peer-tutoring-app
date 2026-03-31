import { Outlet, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { profilesApi } from '../../services/api';

const MENTEE_LINKS = [
  { label: 'Dashboard', to: '/mentee/dashboard' },
  { label: 'Find Mentors', to: '/mentee/directory' },
  { label: 'Profile', to: '/profile' },
];

const MENTOR_LINKS = [
  { label: 'Dashboard', to: '/mentor/dashboard' },
  { label: 'Profile', to: '/profile' },
];

function NavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`text-sm transition px-1 py-0.5 ${
        active
          ? 'text-slate-900 font-semibold'
          : 'text-slate-500 hover:text-slate-800'
      }`}
    >
      {label}
    </Link>
  );
}

function UserAvatar({ profile }) {
  const initial = (profile?.full_name?.[0] || profile?.email?.[0] || '?').toUpperCase();

  return (
    <div className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={profile.full_name || 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xs font-semibold text-slate-500 select-none">
          {initial}
        </span>
      )}
    </div>
  );
}

export default function MainLayout() {
  const { profile: authProfile, user, signOut } = useAuth();
  const location = useLocation();

  const { data: fullProfile } = useQuery({
    queryKey: ['profile', authProfile?.id],
    queryFn: () => profilesApi.getProfile(authProfile.id),
    enabled: !!authProfile?.id,
  });

  const links = authProfile?.role === 'mentor' ? MENTOR_LINKS : MENTEE_LINKS;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-slate-900 mr-4 tracking-tight">
              PeerTutor
            </span>
            <nav className="flex items-center gap-5">
              {links.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  label={label}
                  active={location.pathname === to}
                />
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <UserAvatar profile={fullProfile ?? { email: user?.email, ...authProfile }} />
            <button
              onClick={signOut}
              className="text-xs text-slate-500 hover:text-slate-800 transition underline underline-offset-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}