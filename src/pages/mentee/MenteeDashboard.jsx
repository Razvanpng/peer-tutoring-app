import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { sessionsApi } from '../../services/api';

const STATUS_STYLES = {
  pending:  'bg-amber-50 text-amber-700 border-amber-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed:   'bg-slate-100 text-slate-500 border-slate-200',
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.closed;
  return (
    <span className={`inline-block text-xs font-medium border rounded-full px-2.5 py-0.5 capitalize ${style}`}>
      {status}
    </span>
  );
}

function SessionCard({ session }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{session.topic}</p>
          {session.description && (
            <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
              {session.description}
            </p>
          )}
        </div>
        <StatusBadge status={session.status} />
      </div>
      <p className="text-xs text-slate-400">
        {new Date(session.created_at).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        })}
      </p>
    </div>
  );
}

export default function MenteeDashboard() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();

  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState(null);

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['mentee-sessions', user.id],
    queryFn: () => sessionsApi.getMenteeSessions(user.id),
  });

  const createMutation = useMutation({
    mutationFn: ({ topic, description }) =>
      sessionsApi.createSession({ mentee_id: user.id, topic, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentee-sessions', user.id] });
      setTopic('');
      setDescription('');
      setFormError(null);
    },
    onError: (err) => {
      setFormError(err.message ?? 'Failed to create session. Please try again.');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!topic.trim()) return;
    createMutation.mutate({ topic: topic.trim(), description: description.trim() });
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800">Mentee Dashboard</span>
          <button
            onClick={signOut}
            className="text-xs text-slate-500 hover:text-slate-800 transition underline underline-offset-2"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        {/* Request form */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Request a session</h2>
            <p className="text-sm text-slate-500 mt-0.5">Describe what you need help with.</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4"
          >
            <div className="space-y-1.5">
              <label htmlFor="topic" className="block text-sm font-medium text-slate-700">
                Topic <span className="text-red-400">*</span>
              </label>
              <input
                id="topic"
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Calculus — Integration by parts"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give more context about where you're stuck…"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 resize-none"
              />
            </div>

            {formError && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createMutation.isPending || !topic.trim()}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? 'Submitting…' : 'Submit request'}
              </button>
            </div>
          </form>
        </section>

        {/* Sessions list */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-slate-800">Your requests</h2>

          {sessionsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
              <p className="text-sm text-slate-400">No requests yet. Submit one above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}