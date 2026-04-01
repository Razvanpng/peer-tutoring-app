import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { sessionsApi } from '../../services/api';

function StatCard({ label, value, sub }) {
  return (
    <div className="flex flex-col gap-3 p-8 border border-white/5 bg-white/[0.01]">
      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-end gap-4">
        <span className="text-5xl font-bold text-white tracking-tighter leading-none">{value}</span>
        {sub && <span className="text-xs text-zinc-500 font-mono mb-1.5">{sub}</span>}
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
    <span className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest border ${currentStyle}`}>
      {status}
    </span>
  );
}

function PendingSessionCard({ session, onAccept, isAccepting }) {
  return (
    <div className="flex flex-col justify-between p-8 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors min-h-[220px]">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <StatusBadge status="pending" />
          <span className="text-xs font-mono text-zinc-600">
            {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
          </span>
        </div>
        <div>
          <p className="text-xl font-bold text-zinc-100 tracking-tight line-clamp-1">{session.topic}</p>
          {session.description && (
            <p className="text-base text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{session.description}</p>
          )}
        </div>
      </div>
      
      <div className="pt-8 mt-auto border-t border-white/[0.02]">
        <button
          onClick={() => onAccept(session.id)}
          disabled={isAccepting}
          className="w-full py-4 px-4 bg-emerald-500 hover:bg-emerald-400 text-[#05090f] text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
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
    <div className="flex flex-col justify-between p-8 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors min-h-[220px]">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <StatusBadge status="accepted" />
          <span className="text-xs font-mono text-zinc-600">
            {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
          </span>
        </div>
        <p className="text-xl font-bold text-zinc-100 tracking-tight line-clamp-1">{session.topic}</p>
      </div>
      
      <div className="pt-8 mt-auto border-t border-white/[0.02]">
        <button
          onClick={() => navigate(`/session/${session.id}`)}
          className="w-full py-4 px-4 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs font-bold uppercase tracking-widest transition-colors"
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
    <div className="flex flex-col p-8 border border-white/5 bg-transparent opacity-70 hover:opacity-100 transition-opacity min-h-[200px]">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0 pr-4">
          <p className="text-lg font-bold text-zinc-200 truncate">{session.topic}</p>
          <span className="text-xs font-mono text-zinc-500 mt-2 block">
            {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <StatusBadge status="completed" />
      </div>

      <div className="mt-auto pt-6 border-t border-white/[0.02]">
        {session.rating != null ? (
          <div className="space-y-3">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className={`w-2 h-2 ${star <= ratedStars ? 'bg-emerald-400' : 'bg-white/10'}`} />
              ))}
            </div>
            {session.review && <p className="text-xs font-mono text-zinc-400 line-clamp-2 leading-relaxed">"{session.review}"</p>}
          </div>
        ) : (
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">No telemetry logged.</p>
        )}
      </div>
    </div>
  );
}

function SectionSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-[220px] border border-white/5 bg-white/[0.01] animate-pulse" />
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
    <div className="space-y-20 animate-fade-in max-w-7xl mx-auto pb-20">
      
      <section>
        <div className="flex items-end justify-between mb-8 pb-6 border-b border-white/5">
          <h2 className="text-4xl font-bold text-white tracking-tighter">Command Center</h2>
        </div>

        {mentorSessionsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
            <div className="h-36 bg-[#05090f] animate-pulse" />
            <div className="h-36 bg-[#05090f] animate-pulse" />
            <div className="h-36 bg-[#05090f] animate-pulse" />
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest">Incoming Requests</h2>
          <div className="flex items-center gap-3 px-4 py-1.5 bg-amber-500/5 border border-amber-500/20">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs text-amber-500 font-mono tracking-widest uppercase">{pendingSessions.length} Pending</span>
          </div>
        </div>

        {acceptMutation.isError && (
          <div className="mb-6 p-4 border border-red-500/20 bg-red-500/10 text-xs font-mono text-red-400 uppercase tracking-widest">
            Error: {acceptMutation.error?.message ?? 'Execution failed.'}
          </div>
        )}
        
        {pendingLoading ? <SectionSkeleton /> : pendingSessions.length === 0 ? (
          <div className="p-16 border border-white/5 border-dashed flex justify-center text-center">
            <p className="text-base text-zinc-500 font-mono uppercase tracking-widest">No incoming signals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest">Active Channels</h2>
          <div className="flex items-center gap-3 px-4 py-1.5 bg-emerald-500/5 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-500 font-mono tracking-widest uppercase">{activeSessions.length} Open</span>
          </div>
        </div>
        
        {mentorSessionsLoading ? <SectionSkeleton count={2} /> : activeSessions.length === 0 ? (
          <div className="p-16 border border-white/5 border-dashed flex justify-center text-center">
            <p className="text-base text-zinc-500 font-mono uppercase tracking-widest">Zero active links.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSessions.map((session) => (
              <ActiveSessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center mb-8 pb-6 border-b border-white/5">
          <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest">System Log</h2>
        </div>
        
        {mentorSessionsLoading ? <SectionSkeleton count={4} /> : pastSessions.length === 0 ? (
          <div className="p-16 border border-white/5 border-dashed flex justify-center text-center">
            <p className="text-base text-zinc-500 font-mono uppercase tracking-widest">History cache empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastSessions.map((session) => (
              <CompletedSessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}