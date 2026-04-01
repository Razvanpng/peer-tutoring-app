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
      className={`relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
        active
          ? 'text-zinc-50'
          : 'text-zinc-500 hover:text-zinc-200'
      }`}
    >
      {label}
      {active && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
      )}
    </Link>
  );
}

function UserAvatar({ profile }) {
  const initial = (profile?.full_name?.[0] || profile?.email?.[0] || '?').toUpperCase();

  return (
    <div className="w-8 h-8 rounded-full border border-white/10 bg-zinc-900/50 overflow-hidden shrink-0 flex items-center justify-center">
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={profile.full_name || 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xs font-semibold text-zinc-400 select-none">
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
    <div className="min-h-screen bg-[#05090f] bg-grain relative">
      <header className="sticky top-0 z-40 bg-[#05090f]/90 backdrop-blur-xl border-b border-white/[0.04] supports-[backdrop-filter]:bg-[#05090f]/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-12">
            <Link to="/" className="shrink-0 flex items-center gap-2.5 group">
              <div className="w-2 h-2 rounded-full bg-teal-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold tracking-tight text-zinc-100">
                PeerTutor
              </span>
            </Link>

            <nav className="flex items-center gap-6">
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

          <div className="flex items-center gap-5 shrink-0">
            <button
              onClick={signOut}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
            >
              Sign out
            </button>
            <div className="w-px h-4 bg-white/10" />
            <UserAvatar profile={fullProfile ?? { email: user?.email, ...authProfile }} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}