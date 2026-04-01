import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { profilesApi, sessionsApi } from '../../services/api';

function SubjectBadge({ subject }) {
  return (
    <span className="inline-block text-[10px] font-mono text-zinc-400 bg-white/[0.03] border border-white/5 px-3 py-1.5 uppercase tracking-widest">
      {subject}
    </span>
  );
}

function RequestForm({ mentorId, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState(null);

  const requestMutation = useMutation({
    mutationFn: ({ topic, description }) =>
      sessionsApi.createSession({ mentee_id: user.id, mentor_id: mentorId, topic, description }),
    onSuccess: () => {
      setFormError(null);
      onSuccess();
    },
    onError: (err) => {
      setFormError(err.message ?? 'Transmission failed. Retry.');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!topic.trim()) return;
    requestMutation.mutate({ topic: topic.trim(), description: description.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-6 border-t border-white/[0.02] animate-fade-in mt-6">
      <div className="space-y-2">
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">
          Topic <span className="text-emerald-500">*</span>
        </label>
        <input
          type="text"
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. React Hooks Architecture"
          className="w-full bg-[#05090f] border border-white/10 px-4 py-3 text-base text-white placeholder:text-zinc-700 outline-none transition-colors focus:border-emerald-500/50"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">
          Parameters
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue context..."
          className="w-full bg-[#05090f] border border-white/10 px-4 py-3 text-base text-white placeholder:text-zinc-700 outline-none transition-colors focus:border-emerald-500/50 resize-none"
        />
      </div>

      {formError && (
        <p className="text-xs font-mono text-red-400 p-3 bg-red-500/10 border border-red-500/20">
          {formError}
        </p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-widest text-zinc-500 border border-white/10 hover:text-white hover:bg-white/5 transition-colors"
        >
          Abort
        </button>
        <button
          type="submit"
          disabled={requestMutation.isPending || !topic.trim()}
          className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-widest bg-emerald-500 text-[#05090f] hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {requestMutation.isPending ? 'Sending...' : 'Execute'}
        </button>
      </div>
    </form>
  );
}

function MentorCard({ mentor }) {
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);

  const displayName = mentor.full_name?.trim() || 'Anonymous';
  const initials = displayName[0].toUpperCase();

  return (
    <div className="flex flex-col p-8 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors relative min-h-[300px]">
      
      <div className="flex items-start gap-5 mb-6">
        <div className="w-16 h-16 bg-zinc-900 border border-white/10 shrink-0 flex items-center justify-center">
          {mentor.avatar_url ? (
            <img src={mentor.avatar_url} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-mono text-zinc-500 select-none">{initials}</span>
          )}
        </div>
        
        <div className="min-w-0 flex-1 pt-1">
          <p className="text-xl font-bold text-zinc-100 truncate tracking-tight">{displayName}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {Array.isArray(mentor.subjects) && mentor.subjects.slice(0, 3).map((sub) => (
              <SubjectBadge key={sub} subject={sub} />
            ))}
            {Array.isArray(mentor.subjects) && mentor.subjects.length > 3 && (
              <span className="text-[10px] font-mono text-zinc-500 self-center ml-1">+{mentor.subjects.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-4">
          {mentor.bio || <span className="italic text-zinc-600">No telemetry provided.</span>}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-white/[0.02]">
        {sent ? (
          <div className="flex items-center justify-center gap-3 py-4 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">Signal Transmitted</span>
          </div>
        ) : (
          <>
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-4 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest hover:bg-emerald-500/10 transition-colors"
              >
                Connect
              </button>
            ) : (
              <RequestForm 
                mentorId={mentor.id} 
                onSuccess={() => { setSent(true); setShowForm(false); }} 
                onCancel={() => setShowForm(false)} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="p-8 border border-white/5 bg-white/[0.01] min-h-[300px] animate-pulse flex flex-col">
      <div className="flex gap-5 mb-6">
        <div className="w-16 h-16 bg-white/5" />
        <div className="flex-1 space-y-4 pt-2">
          <div className="h-5 w-1/2 bg-white/10" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-white/5" />
            <div className="h-5 w-20 bg-white/5" />
          </div>
        </div>
      </div>
      <div className="space-y-3 mt-2">
        <div className="h-3 w-full bg-white/5" />
        <div className="h-3 w-5/6 bg-white/5" />
        <div className="h-3 w-4/5 bg-white/5" />
      </div>
      <div className="mt-auto pt-8 border-t border-white/[0.02]">
        <div className="h-12 w-full bg-white/5" />
      </div>
    </div>
  );
}

export default function MentorDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const { data: mentors = [], isLoading, isError } = useQuery({
    queryKey: ['mentors'],
    queryFn: () => profilesApi.getAllMentors(),
  });

  const uniqueSubjects = [
    ...new Set(mentors.flatMap((m) => (Array.isArray(m.subjects) ? m.subjects : []))),
  ].sort();

  const filteredMentors = mentors.filter((mentor) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || mentor.full_name?.toLowerCase().includes(query) || mentor.email?.toLowerCase().includes(query) || mentor.bio?.toLowerCase().includes(query);
    const matchesSubject = selectedSubject === 'All' || (Array.isArray(mentor.subjects) && mentor.subjects.includes(selectedSubject));
    return matchesSearch && matchesSubject;
  });

  const hasActiveFilters = searchQuery.trim() !== '' || selectedSubject !== 'All';

  return (
    <div className="space-y-12 animate-fade-in max-w-7xl mx-auto pb-20">
      
      <section className="flex flex-col md:flex-row gap-8 items-end justify-between pb-8 border-b border-white/5">
        <div>
          <h1 className="text-5xl font-bold text-white tracking-tighter">Directory</h1>
          <p className="text-base text-zinc-500 mt-3 font-mono">Scan network for available peers.</p>
        </div>
        
        <div className="w-full md:w-[400px] relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="text-emerald-500 font-mono text-base">{'>'}</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Query node..."
            className="w-full bg-[#05090f] border border-white/10 pl-10 pr-6 py-4 text-base text-white placeholder:text-zinc-600 outline-none transition-all focus:border-emerald-500/50"
          />
        </div>
      </section>

      {!isLoading && uniqueSubjects.length > 0 && (
        <section className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none border-b border-white/5 pb-8">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest shrink-0 mr-2">Filter:</span>
          {['All', ...uniqueSubjects].map((subject) => {
            const active = selectedSubject === subject;
            return (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`shrink-0 px-5 py-2 text-xs font-mono tracking-widest uppercase border transition-colors ${
                  active
                    ? 'bg-white text-[#05090f] border-white'
                    : 'bg-white/[0.01] border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/30'
                }`}
              >
                {subject}
              </button>
            );
          })}
        </section>
      )}

      <section>
        {isError && (
          <div className="p-6 border border-red-500/20 bg-red-500/5 mb-8">
            <p className="text-xs text-red-400 font-mono uppercase tracking-widest">Error: Remote fetch failed.</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : mentors.length === 0 ? (
          <div className="p-24 border border-white/5 border-dashed flex items-center justify-center text-center">
            <p className="text-lg text-zinc-500 font-mono uppercase tracking-widest">No nodes active in the current sector.</p>
          </div>
        ) : filteredMentors.length === 0 ? (
          <div className="p-24 border border-white/5 border-dashed flex flex-col items-center justify-center text-center gap-6">
            <p className="text-lg text-zinc-400 font-mono">Zero matches found.</p>
            {hasActiveFilters && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedSubject('All'); }}
                className="text-xs text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-widest border-b border-emerald-500/50 hover:border-emerald-400 pb-1"
              >
                Clear parameters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}