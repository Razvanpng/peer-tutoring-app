import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

export default function MainLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const links = profile?.role === 'mentor' ? MENTOR_LINKS : MENTEE_LINKS;

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

          <button
            onClick={signOut}
            className="text-xs text-slate-500 hover:text-slate-800 transition underline underline-offset-2 shrink-0"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}