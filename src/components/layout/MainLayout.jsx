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
      className={`relative px-3 py-1.5 text-xs font-semibold tracking-widest uppercase transition-colors duration-200 ${
        active
          ? 'text-white'
          : 'text-zinc-500 hover:text-zinc-300'
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
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
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
    <div className="min-h-screen bg-[#05090f] bg-grain relative font-sans flex flex-col items-center">
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden xl:block">
        <div className="absolute top-[20%] left-[-10%] w-[30%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
        
        <div className="absolute inset-y-0 left-[3%] w-px bg-white/[0.03]" />
        <div className="absolute inset-y-0 left-[5%] w-px bg-white/[0.02]" />
        <div className="absolute top-[20%] left-[3%] -translate-x-1/2 w-2 h-px bg-white/20" />
        <div className="absolute top-[25%] left-[3%] -translate-x-1/2 w-1 h-px bg-white/20" />
        <div className="absolute top-[30%] left-[3%] -translate-x-1/2 w-2 h-px bg-white/20" />
        <div className="absolute bottom-32 left-[4%] text-[9px] font-mono text-zinc-600 tracking-[0.4em] uppercase [writing-mode:vertical-rl] rotate-180">
          NODE.01_ACTIVE // SEC.A
        </div>
        <div className="absolute top-1/2 left-[3%] -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-20">
          {[...Array(15)].map((_, i) => <div key={i} className="w-1 h-px bg-white" />)}
        </div>

        <div className="absolute inset-y-0 right-[3%] w-px bg-white/[0.03]" />
        <div className="absolute inset-y-0 right-[5%] w-px bg-white/[0.02]" />
        <div className="absolute bottom-[20%] right-[3%] translate-x-1/2 w-2 h-px bg-white/20" />
        <div className="absolute bottom-[25%] right-[3%] translate-x-1/2 w-1 h-px bg-white/20" />
        <div className="absolute bottom-[30%] right-[3%] translate-x-1/2 w-2 h-px bg-white/20" />
        <div className="absolute top-32 right-[4%] text-[9px] font-mono text-zinc-600 tracking-[0.4em] uppercase [writing-mode:vertical-rl]">
          SYSTEMS NOMINAL // SEC.B
        </div>
        <div className="absolute top-1/2 right-[3%] translate-x-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-20">
          {[...Array(15)].map((_, i) => <div key={i} className="w-1 h-px bg-white" />)}
        </div>
      </div>

      <div className="w-full max-w-[1600px] border-x border-white/[0.04] min-h-screen flex flex-col relative z-10 bg-[#05090f]/50">
        <header className="sticky top-0 z-40 bg-[#05090f]/90 backdrop-blur-xl border-b border-white/[0.04] supports-[backdrop-filter]:bg-[#05090f]/60">
          <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between gap-6">
            <div className="flex items-center gap-12">
              <Link to="/" className="shrink-0 flex items-center gap-3 group">
                <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                <span className="text-sm font-semibold tracking-widest text-zinc-100 uppercase">
                  PeerTutor
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
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

            <div className="flex items-center gap-6 shrink-0">
              <button
                onClick={signOut}
                className="text-xs font-semibold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors duration-200"
              >
                Sign out
              </button>
              <div className="w-px h-4 bg-white/10" />
              <UserAvatar profile={fullProfile ?? { email: user?.email, ...authProfile }} />
            </div>
          </div>
        </header>

        <main className="w-full px-6 md:px-12 py-10 relative z-10 flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}