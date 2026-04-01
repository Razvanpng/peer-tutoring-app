import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { sessionsApi } from '../../services/api';

function StatCard({ label, value }) {
  return (
    <div className="flex flex-col gap-3 p-8 border border-white/5 bg-white/[0.01]">
      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
      <span className="text-5xl font-bold text-white tracking-tighter">{value}</span>
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

function SessionCard({ session }) {
  const navigate = useNavigate();
  const isActionable = session.status === 'accepted' || session.status === 'completed';

  return (
    <div className="group flex flex-col justify-between p-8 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative min-h-[220px]">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <StatusBadge status={session.status} />
          <span className="text-xs font-mono text-zinc-500">
            {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
          </span>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-zinc-100 tracking-tight line-clamp-1">{session.topic}</h3>
          {session.description && (
            <p className="text-base text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{session.description}</p>
          )}
        </div>
      </div>

      <div className="pt-8 mt-auto border-t border-white/[0.02]">
        <button
          onClick={() => navigate(`/session/${session.id}`)}
          disabled={!isActionable}
          className={`w-full py-4 px-4 text-xs font-bold uppercase tracking-widest transition-all ${
            isActionable
              ? 'bg-emerald-500 text-[#05090f] hover:bg-emerald-400'
              : 'bg-white/5 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {isActionable ? 'Access Workspace' : 'Awaiting Mentor'}
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="p-8 border border-white/5 bg-white/[0.01] min-h-[220px] animate-pulse flex flex-col justify-between">
      <div className="space-y-5">
        <div className="h-6 w-24 bg-white/5" />
        <div className="space-y-3 pt-2">
          <div className="h-6 w-3/4 bg-white/10" />
          <div className="h-4 w-1/2 bg-white/5" />
        </div>
      </div>
      <div className="pt-8 mt-auto border-t border-white/[0.02]">
        <div className="h-12 w-full bg-white/5" />
      </div>
    </div>
  );
}

export default function MenteeDashboard() {
  const { user } = useAuth();
  
  const { data: menteeSessions = [], isLoading, isError } = useQuery({
    queryKey: ['mentee-sessions', user.id],
    queryFn: () => sessionsApi.getMenteeSessions(user.id),
  });

  const activeSessions = menteeSessions.filter((s) => s.status === 'accepted' || s.status === 'pending');
  const pastSessions = menteeSessions.filter((s) => s.status === 'completed');

  if (isError) {
    return (
      <div className="p-8 border border-red-500/20 bg-red-500/5 max-w-7xl mx-auto mt-10">
        <p className="text-sm text-red-400 font-mono uppercase tracking-widest">System Error: Failed to load telemetry.</p>
      </div>
    );
  }

  return (
    <div className="space-y-20 animate-fade-in max-w-7xl mx-auto pb-20">
      
      <section>
        <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest mb-8">Metrics Overview</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
            <div className="h-36 bg-[#05090f] animate-pulse" />
            <div className="h-36 bg-[#05090f] animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
            <div className="bg-[#05090f]">
              <StatCard label="Active Requests" value={activeSessions.length} />
            </div>
            <div className="bg-[#05090f]">
              <StatCard label="Completed Sessions" value={pastSessions.length} />
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-white/5 gap-4">
          <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest">Active Workspace</h2>
          <span className="text-xs text-emerald-500 font-mono tracking-widest px-3 py-1 bg-emerald-500/5 border border-emerald-500/20">{activeSessions.length} Running</span>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : activeSessions.length === 0 ? (
          <div className="p-16 border border-white/5 border-dashed flex flex-col items-center text-center">
            <p className="text-lg text-zinc-400">No active operations.</p>
            <p className="text-sm text-zinc-600 mt-2 font-mono">Head to the Directory to initialize a new request.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
          <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest">History Log</h2>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
          </div>
        ) : pastSessions.length === 0 ? (
          <div className="p-16 border border-white/5 border-dashed flex items-center justify-center">
            <p className="text-base text-zinc-600 font-mono uppercase tracking-widest">Log is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity duration-500">
            {pastSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}