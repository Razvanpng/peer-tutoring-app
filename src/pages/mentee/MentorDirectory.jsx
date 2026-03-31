import { useQuery } from '@tanstack/react-query';
import { profilesApi } from '../../services/api';

function SubjectBadge({ subject }) {
  return (
    <span className="inline-block text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-2.5 py-0.5">
      {subject}
    </span>
  );
}

function MentorCard({ mentor }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 flex flex-col">
      <div className="space-y-1">
        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
          <span className="text-sm font-semibold text-slate-500 uppercase">
            {mentor.email?.[0] ?? 'M'}
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-800 mt-2 truncate">
          {mentor.email}
        </p>
        {mentor.bio ? (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
            {mentor.bio}
          </p>
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
  const { data: mentors = [], isLoading, isError } = useQuery({
    queryKey: ['mentors'],
    queryFn: () => profilesApi.getAllMentors(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Find a Mentor</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Browse available mentors and the subjects they cover.
        </p>
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      )}
    </div>
  );
}