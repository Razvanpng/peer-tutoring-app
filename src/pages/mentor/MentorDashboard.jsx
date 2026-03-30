import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { sessionsApi } from '../../services/api';

function PendingSessionCard({ session, onAccept, isAccepting }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-800">{session.topic}</p>
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

export default function MentorDashboard() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['pending-sessions'],
    queryFn: () => sessionsApi.getPendingSessions(),
  });

  const acceptMutation = useMutation({
    mutationFn: (sessionId) => sessionsApi.acceptSession(sessionId, user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-sessions'] });
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
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

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        <div>
          <h2 className="text-base font-semibold text-slate-800">Open requests</h2>
          <p className="text-sm text-slate-500 mt-0.5">Accept a session to connect with a mentee.</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-sm">
            <p className="text-sm text-slate-400">No open requests at the moment.</p>
            <p className="text-xs text-slate-400 mt-1">Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <PendingSessionCard
                key={session.id}
                session={session}
                onAccept={(id) => acceptMutation.mutate(id)}
                isAccepting={acceptMutation.isPending && acceptMutation.variables === session.id}
              />
            ))}
          </div>
        )}

        {acceptMutation.isError && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {acceptMutation.error?.message ?? 'Failed to accept session. Please try again.'}
          </p>
        )}

      </main>
    </div>
  );
}