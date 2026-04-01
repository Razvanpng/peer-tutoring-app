import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { sessionsApi } from '../../services/api';

function StatCard({ label, value, sub }) {
  return (
    <div className="flex flex-col gap-2 p-6 border border-white/5 bg-white/[0.01]">
      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-white tracking-tighter leading-none">{value}</span>
        {sub && <span className="text-[10px] text-zinc-600 font-mono mb-1">{sub}</span>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending:  'text-amber-400 border-amber-400/20 bg-amber-400/5',
    accepted: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    completed: 'text-zinc-400 border-white/5 bg-white/[0.02]',
  };
  const currentStyle = styles[status] || styles.completed;

  return (
    <span className={`px-2 py-1 text-[9px] font-mono uppercase tracking-widest border ${currentStyle}`}>
      {status}
    </span>
  );
}

function PendingSessionCard({ session, onAccept, isAccepting }) {
  return (
    <div className="flex flex-col justify-between p-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors min-h-[140px]">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <StatusBadge status="pending" />
          <span className="text-[9px] font-mono text-zinc-600">
            {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
          </span>
        </div>
        <div>
          <p className="text-base font-semibold text-zinc-200 tracking-tight line-clamp-1">{session.topic}</p>
          {session.description && (
            <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{session.description}</p>
          )}
        </div>
      </div>
      
      <div className="pt-5 mt-auto border-t border-white/5">
        <button
          onClick={() => onAccept(session.id)}
          disabled={isAccepting}
          className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-[#05090f] text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
        >
          {isAccepting ? 'Processing...' : 'Accept Connection'}
        </button>
      </div>
    </div>
  );
}

function ActiveSessionCard({ session }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-between p-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors min-h-[140px]">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <StatusBadge status="accepted" />
          <span className="text-[9px] font-mono text-zinc-600">
            {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
          </span>
        </div>
        <p className="text-base font-semibold text-zinc-200 tracking-tight line-clamp-1">{session.topic}</p>
      </div>
      
      <div className="pt-5 mt-auto border-t border-white/5">
        <button
          onClick={() => navigate(`/session/${session.id}`)}
          className="w-full py-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-[10px] font-bold uppercase tracking-widest transition-colors"
        >
          Open Interface
        </button>
      </div>
    </div>
  );
}

function CompletedSessionCard({ session }) {
  const ratedStars = session.rating ?? 0;
  return (
    <div className="flex flex-col p-5 border border-white/5 bg-transparent opacity-70 hover:opacity-100 transition-opacity">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-semibold text-zinc-300 truncate">{session.topic}</p>
          <span className="text-[9px] font-mono text-zinc-600 mt-1 block">
            {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <StatusBadge status="completed" />
      </div>

      <div className="mt-auto pt-4 border-t border-white/5">
        {session.rating != null ? (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className={`w-1.5 h-1.5 ${star <= ratedStars ? 'bg-emerald-400' : 'bg-white/10'}`} />
              ))}
            </div>
            {session.review && <p className="text-[10px] font-mono text-zinc-500 line-clamp-2">"{session.review}"</p>}
          </div>
        ) : (
          <p className="text-[10px] font-mono text-zinc-600">No telemetry logged.</p>
        )}
      </div>
    </div>
  );
}

function SectionSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-36 border border-white/5 bg-white/[0.01] animate-pulse" />
      ))}
    </div>
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
  
  const averageRating = ratedSessions.length > 0 
    ? (ratedSessions.reduce((sum, s) => sum + s.rating, 0) / ratedSessions.length).toFixed(1) 
    : '--';

  const acceptMutation = useMutation({
    mutationFn: (sessionId) => sessionsApi.acceptSession(sessionId, user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-sessions', user.id] });
    },
  });

  return (
    <div className="space-y-16 animate-fade-in">
      
      <section>
        <div className="flex items-end justify-between mb-6 pb-4 border-b border-white/5">
          <h2 className="text-3xl font-bold text-white tracking-tighter">Command Center</h2>
        </div>

        {mentorSessionsLoading ? (
          <div className="grid grid-cols-3 gap-px bg-white/5 border border-white/5">
            <div className="h-24 bg-[#05090f] animate-pulse" />
            <div className="h-24 bg-[#05090f] animate-pulse" />
            <div className="h-24 bg-[#05090f] animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
            <div className="bg-[#05090f]">
              <StatCard label="Clearances" value={pastSessions.length} />
            </div>
            <div className="bg-[#05090f]">
              <StatCard label="System Rating" value={averageRating} sub={averageRating !== '--' ? '/ 5.0' : ''} />
            </div>
            <div className="bg-[#05090f]">
              <StatCard label="Logged Reviews" value={ratedSessions.length} />
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest">Incoming Requests</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] text-amber-500 font-mono tracking-widest">{pendingSessions.length} Pending</span>
          </div>
        </div>

        {acceptMutation.isError && (
          <div className="mb-4 p-3 border border-red-500/20 bg-red-500/10 text-[10px] font-mono text-red-400 uppercase">
            Error: {acceptMutation.error?.message ?? 'Execution failed.'}
          </div>
        )}
        
        {pendingLoading ? <SectionSkeleton /> : pendingSessions.length === 0 ? (
          <div className="p-10 border border-white/5 border-dashed flex justify-center text-center">
            <p className="text-sm text-zinc-600 font-mono">No incoming signals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingSessions.map((session) => (
              <PendingSessionCard
                key={session.id}
                session={session}
                onAccept={(id) => acceptMutation.mutate(id)}
                isAccepting={acceptMutation.isPending && acceptMutation.variables === session.id}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest">Active Channels</h2>
          <span className="text-[10px] text-emerald-500 font-mono tracking-widest">{activeSessions.length} Open</span>
        </div>
        
        {mentorSessionsLoading ? <SectionSkeleton count={2} /> : activeSessions.length === 0 ? (
          <div className="p-10 border border-white/5 border-dashed flex justify-center text-center">
            <p className="text-sm text-zinc-600 font-mono">Zero active links.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSessions.map((session) => (
              <ActiveSessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center mb-6 pb-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest">System Log</h2>
        </div>
        
        {mentorSessionsLoading ? <SectionSkeleton count={3} /> : pastSessions.length === 0 ? (
          <div className="p-10 border border-white/5 border-dashed flex justify-center text-center">
            <p className="text-sm text-zinc-600 font-mono">History cache empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pastSessions.map((session) => (
              <CompletedSessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}