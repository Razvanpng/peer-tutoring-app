import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { sessionsApi } from '../../services/api';

function StarIcon({ filled }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-3.5 h-3.5 ${filled ? 'text-amber-400' : 'text-slate-200'}`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-800 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

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

function CompletedSessionCard({ session }) {
  const ratedStars = session.rating ?? 0;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{session.topic}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {new Date(session.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium border rounded-full px-2.5 py-0.5 bg-slate-100 text-slate-500 border-slate-200">
          Completed
        </span>
      </div>

      {session.rating != null ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={star <= ratedStars} />
            ))}
            <span className="ml-1 text-xs text-slate-500">{session.rating} / 5</span>
          </div>
          {session.review && (
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
              {session.review}
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">No review submitted.</p>
      )}
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
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: allMentorSessions = [], isLoading: mentorSessionsLoading } = useQuery({
    queryKey: ['mentor-sessions', user.id],
    queryFn: () => sessionsApi.getMentorSessions(user.id),
  });

  const { data: pendingSessions = [], isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-sessions'],
    queryFn: () => sessionsApi.getPendingSessions(),
  });

  const activeSessions = allMentorSessions.filter((s) => s.status === 'accepted');
  const pastSessions = allMentorSessions.filter((s) => s.status === 'completed');

  const ratedSessions = pastSessions.filter((s) => s.rating != null);
  const totalReviews = ratedSessions.length;
  const averageRating =
    totalReviews > 0
      ? (ratedSessions.reduce((sum, s) => sum + s.rating, 0) / totalReviews).toFixed(1)
      : null;

  const acceptMutation = useMutation({
    mutationFn: (sessionId) => sessionsApi.acceptSession(sessionId, user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-sessions', user.id] });
    },
  });

  return (
    <div className="space-y-10">

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-800">Stats Overview</h2>
        {mentorSessionsLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StatCard
              label="Sessions Completed"
              value={pastSessions.length}
            />
            <StatCard
              label="Average Rating"
              value={
                averageRating != null ? (
                  <span className="flex items-center gap-1.5">
                    {averageRating}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </span>
                ) : '—'
              }
              sub={averageRating != null ? 'out of 5' : 'No ratings yet'}
            />
            <StatCard
              label="Total Reviews"
              value={totalReviews}
            />
          </div>
        )}
      </section>

      <div className="border-t border-slate-200" />

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

      <div className="border-t border-slate-200" />

      <SectionBlock
        title="Session History"
        subtitle="All sessions you have completed with mentees."
        isLoading={mentorSessionsLoading}
        isEmpty={pastSessions.length === 0}
        emptyText="No completed sessions yet."
        skeletonCount={2}
      >
        {pastSessions.map((session) => (
          <CompletedSessionCard key={session.id} session={session} />
        ))}
      </SectionBlock>

    </div>
  );
}