import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { profilesApi } from '../../services/api';
import { supabase } from '../../services/supabase';

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
      className={`relative text-sm transition-all duration-200 px-1 py-0.5 ${
        active
          ? 'text-zinc-50 font-medium'
          : 'text-zinc-400 hover:text-zinc-100'
      }`}
    >
      {label}
      {active && (
        <span className="absolute -bottom-[1px] left-0 right-0 h-px bg-gradient-to-r from-violet-500/0 via-violet-500 to-violet-500/0" />
      )}
    </Link>
  );
}

function UserAvatar({ profile }) {
  const initial = (profile?.full_name?.[0] || profile?.email?.[0] || '?').toUpperCase();

  return (
    <div className="w-7 h-7 rounded-full border border-white/10 bg-zinc-900 overflow-hidden shrink-0 flex items-center justify-center ring-1 ring-inset ring-white/5">
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={profile.full_name || 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-[11px] font-semibold text-zinc-400 select-none">
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
    <div className="min-h-screen bg-zinc-950">
      <header className="sticky top-0 z-40 bg-zinc-950/70 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-5 h-13 flex items-center justify-between gap-6" style={{ height: '52px' }}>
          <div className="flex items-center gap-7">
            <Link to="/" className="shrink-0">
              <span className="text-sm font-semibold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
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

          <div className="flex items-center gap-3 shrink-0">
            <UserAvatar profile={fullProfile ?? { email: user?.email, ...authProfile }} />
            <button
              onClick={signOut}
              className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors duration-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}