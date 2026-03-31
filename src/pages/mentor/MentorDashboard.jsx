import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { sessionsApi } from '../../services/api';

function ActiveSessionCard({ session }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{session.topic}</p>
          {session.description && (
            <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
              {session.description}
            </p>
          )}
        </div>
        <span className="shrink-0 text-xs font-medium border rounded-full px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border-emerald-200">
          Accepted
        </span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {new Date(session.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </p>
        <button
          onClick={() => navigate(`/session/${session.id}`)}
          className="text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 hover:border-slate-300 transition"
        >
          Open Session
        </button>
      </div>
    </div>
  );
}

function PendingSessionCard({ session, onAccept, isAccepting }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-800 truncate">{session.topic}</p>
          <span className="shrink-0 text-xs font-medium border rounded-full px-2.5 py-0.5 bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </span>
        </div>
        {session.description && (
          <p className="text-xs text-slate-500 leading-relaxed">{session.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {new Date(session.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </p>
        <button
          onClick={() => onAccept(session.id)}
          disabled={isAccepting}
          className="rounded-lg bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAccepting ? 'Accepting…' : 'Accept'}
        </button>
      </div>
    </div>
  );
}

function SectionBlock({ title, subtitle, isLoading, isEmpty, emptyText, skeletonCount = 3, children }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(skeletonCount)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
          <p className="text-sm text-slate-400">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </section>
  );
}

export default function MentorDashboard() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();

  const { data: allMentorSessions = [], isLoading: mentorSessionsLoading } = useQuery({
    queryKey: ['mentor-sessions', user.id],
    queryFn: () => sessionsApi.getMentorSessions(user.id),
  });

  const activeSessions = allMentorSessions.filter((s) => s.status === 'accepted');

  const { data: pendingSessions = [], isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-sessions'],
    queryFn: () => sessionsApi.getPendingSessions(),
  });

  const acceptMutation = useMutation({
    mutationFn: (sessionId) => sessionsApi.acceptSession(sessionId, user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-sessions', user.id] });
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800">Mentor Dashboard</span>
          <button
            onClick={signOut}
            className="text-xs text-slate-500 hover:text-slate-800 transition underline underline-offset-2"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-10">
        <SectionBlock
          title="Active Sessions"
          subtitle="Sessions you have accepted and are currently running."
          isLoading={mentorSessionsLoading}
          isEmpty={activeSessions.length === 0}
          emptyText="No active sessions yet."
          skeletonCount={2}
        >
          {activeSessions.map((session) => (
            <ActiveSessionCard key={session.id} session={session} />
          ))}
        </SectionBlock>

        <div className="border-t border-slate-200" />

        <SectionBlock
          title="Pending Requests"
          subtitle="Open requests from mentees waiting for a mentor."
          isLoading={pendingLoading}
          isEmpty={pendingSessions.length === 0}
          emptyText="No open requests at the moment."
          skeletonCount={3}
        >
          {pendingSessions.map((session) => (
            <PendingSessionCard
              key={session.id}
              session={session}
              onAccept={(id) => acceptMutation.mutate(id)}
              isAccepting={acceptMutation.isPending && acceptMutation.variables === session.id}
            />
          ))}
        </SectionBlock>

        {acceptMutation.isError && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {acceptMutation.error?.message ?? 'Failed to accept session. Please try again.'}
          </p>
        )}
      </main>
    </div>
  );
}