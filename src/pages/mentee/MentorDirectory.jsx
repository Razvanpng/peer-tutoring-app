import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { profilesApi, sessionsApi } from '../../services/api';

function SubjectBadge({ subject }) {
  return (
    <span className="inline-block text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-2.5 py-0.5">
      {subject}
    </span>
  );
}

function RequestForm({ mentorId, onSuccess }) {
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
      setFormError(err.message ?? 'Failed to send request. Please try again.');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!topic.trim()) return;
    requestMutation.mutate({ topic: topic.trim(), description: description.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t border-slate-100">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-700">
          Topic <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Linear algebra basics"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-700">Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what you need help with…"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 resize-none"
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
          disabled={requestMutation.isPending || !topic.trim()}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {requestMutation.isPending ? 'Sending…' : 'Send request'}
        </button>
      </div>
    </form>
  );
}

function MentorCard({ mentor }) {
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);

  const displayName = mentor.full_name?.trim() || 'Anonymous Mentor';
  const initials = displayName[0].toUpperCase();

  function handleSuccess() {
    setSent(true);
    setShowForm(false);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 flex flex-col">
      <div className="space-y-1">
        <div className="w-9 h-9 rounded-full border border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
          {mentor.avatar_url ? (
            <img
              src={mentor.avatar_url}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-slate-500 uppercase select-none">
              {initials}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-slate-800 mt-2 truncate">{displayName}</p>
        {mentor.bio ? (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{mentor.bio}</p>
        ) : (
          <p className="text-xs text-slate-400 italic">No bio provided.</p>
        )}
      </div>

      {Array.isArray(mentor.subjects) && mentor.subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {mentor.subjects.map((subject) => (
            <SubjectBadge key={subject} subject={subject} />
          ))}
        </div>
      )}

      <div className="pt-1 mt-auto">
        {sent ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Request sent!
          </div>
        ) : (
          <>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
              >
                Request Session
              </button>
            )}
            {showForm && (
              <>
                <RequestForm mentorId={mentor.id} onSuccess={handleSuccess} />
                <button
                  onClick={() => setShowForm(false)}
                  className="mt-2 w-full text-xs text-slate-400 hover:text-slate-600 transition"
                >
                  Cancel
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 animate-pulse">
      <div className="w-9 h-9 rounded-full bg-slate-100" />
      <div className="h-3.5 w-40 rounded bg-slate-100 mt-2" />
      <div className="space-y-1.5 pt-1">
        <div className="h-2.5 w-full rounded bg-slate-100" />
        <div className="h-2.5 w-4/5 rounded bg-slate-100" />
      </div>
      <div className="flex gap-1.5 pt-1">
        <div className="h-5 w-14 rounded-full bg-slate-100" />
        <div className="h-5 w-16 rounded-full bg-slate-100" />
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
    ...new Set(
      mentors.flatMap((m) => (Array.isArray(m.subjects) ? m.subjects : []))
    ),
  ].sort();

  const filteredMentors = mentors.filter((mentor) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      mentor.full_name?.toLowerCase().includes(query) ||
      mentor.email?.toLowerCase().includes(query) ||
      mentor.bio?.toLowerCase().includes(query);
    const matchesSubject =
      selectedSubject === 'All' ||
      (Array.isArray(mentor.subjects) && mentor.subjects.includes(selectedSubject));
    return matchesSearch && matchesSubject;
  });

  const hasActiveFilters = searchQuery.trim() !== '' || selectedSubject !== 'All';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Find a Mentor</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Browse available mentors and send a session request directly.
        </p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or bio…"
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 shadow-sm"
          />
        </div>

        {!isLoading && uniqueSubjects.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', ...uniqueSubjects].map((subject) => {
              const active = selectedSubject === subject;
              return (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 ${
                    active
                      ? 'bg-slate-800 border-slate-800 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {subject}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {isError && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          Failed to load mentors. Please refresh and try again.
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : mentors.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <p className="text-sm text-slate-400">No mentors have joined yet.</p>
          <p className="text-xs text-slate-400 mt-1">Check back soon.</p>
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm space-y-2">
          <p className="text-sm text-slate-500 font-medium">No mentors found</p>
          <p className="text-xs text-slate-400">
            No mentors match your search criteria. Try adjusting your search or filter.
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedSubject('All'); }}
              className="mt-2 text-xs text-slate-500 underline underline-offset-2 hover:text-slate-800 transition"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      )}
    </div>
  );
}