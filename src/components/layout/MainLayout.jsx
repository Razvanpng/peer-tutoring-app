import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { profilesApi } from '../../services/api';
import { supabase } from '../../services/supabase';

const MENTEE_LINKS = [
  { label: 'Dashboard', to: '/mentee/dashboard' },
  { label: 'Directory', to: '/mentee/directory' },
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
      className={`relative px-4 py-2 text-xs uppercase tracking-[0.1em] transition-all duration-300 ${
        active
          ? 'text-white'
          : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      {label}
      {active && (
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-emerald-400" />
      )}
    </Link>
  );
}

function UserAvatar({ profile }) {
  const initial = (profile?.full_name?.[0] || profile?.email?.[0] || '?').toUpperCase();

  return (
    <div className="w-9 h-9 border border-white/5 bg-zinc-900 overflow-hidden shrink-0 flex items-center justify-center">
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={profile.full_name || 'Avatar'}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
        />
      ) : (
        <span className="text-xs font-semibold text-zinc-500 select-none">
          {initial}
        </span>
      )}
    </div>
  );
}

export default function MainLayout() {
  const { profile: authProfile, user, signOut } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: fullProfile } = useQuery({
    queryKey: ['profile', authProfile?.id],
    queryFn: () => profilesApi.getProfile(authProfile.id),
    enabled: !!authProfile?.id,
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new?.sender_id !== user.id) {
            addToast('New message received!', 'info');
          }
          queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sessions' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['pending-sessions'] });
          queryClient.invalidateQueries({ queryKey: ['mentor-sessions', user.id] });
          queryClient.invalidateQueries({ queryKey: ['mentee-sessions', user.id] });

          if (payload.eventType === 'INSERT' && authProfile?.role === 'mentor') {
            addToast('A new session request has been posted.', 'info');
          }

          if (
            payload.eventType === 'UPDATE' &&
            payload.new?.status === 'accepted' &&
            authProfile?.role === 'mentee' &&
            payload.new?.mentee_id === user.id
          ) {
            addToast('Your session request was accepted!', 'success');
          }

          if (payload.eventType === 'UPDATE' && payload.new?.status === 'closed') {
            addToast('A session has been marked as completed.', 'info');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, authProfile?.role, addToast, queryClient]);

  const links = authProfile?.role === 'mentor' ? MENTOR_LINKS : MENTEE_LINKS;

  return (
    <div className="min-h-screen bg-[#05090f] bg-grain relative font-sans">
      <header className="sticky top-0 z-40 bg-[#05090f]/95 border-b border-white/[0.04]">
        <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Link to="/" className="shrink-0 flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500" />
              <span className="text-sm font-bold tracking-widest text-white uppercase">
                PeerTutor
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-4">
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

          <div className="flex items-center gap-8 shrink-0">
            <button
              onClick={signOut}
              className="text-xs font-medium text-zinc-500 hover:text-white uppercase tracking-widest transition-colors duration-200"
            >
              Sign out
            </button>
            <UserAvatar profile={fullProfile ?? { email: user?.email, ...authProfile }} />
          </div>
        </div>
      </header>

      <main className="w-full px-6 md:px-12 py-12 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}