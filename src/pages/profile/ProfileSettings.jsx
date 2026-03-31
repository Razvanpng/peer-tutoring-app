import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { profilesApi } from '../../services/api';

export default function ProfileSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [subjectsInput, setSubjectsInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [mutationError, setMutationError] = useState(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user.id],
    queryFn: () => profilesApi.getProfile(user.id),
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setBio(profile.bio ?? '');
      setSubjectsInput(
        Array.isArray(profile.subjects) ? profile.subjects.join(', ') : ''
      );
      setAvatarUrl(profile.avatar_url ?? null);
    }
  }, [profile]);

  const uploadMutation = useMutation({
    mutationFn: (file) => profilesApi.uploadAvatar(user.id, file),
    onSuccess: (url) => {
      setAvatarUrl(url);
    },
    onError: (err) => {
      setMutationError(err.message ?? 'Failed to upload avatar. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => profilesApi.updateProfile(user.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      setSuccessMessage('Profile updated successfully.');
      setMutationError(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    onError: (err) => {
      setMutationError(err.message ?? 'Failed to update profile. Please try again.');
      setSuccessMessage(null);
    },
  });

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const subjects = subjectsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    updateMutation.mutate({
      full_name: fullName.trim(),
      bio: bio.trim(),
      subjects,
      avatar_url: avatarUrl,
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-xl">
        <div className="h-6 w-32 rounded-lg bg-slate-100 animate-pulse" />
        <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Profile Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Update your name, bio, avatar, and the subjects you work with.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5"
      >
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Avatar</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-slate-400 uppercase select-none">
                  {fullName?.[0] || user.email?.[0] || '?'}
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadMutation.isPending ? 'Uploading…' : 'Upload image'}
              </button>
              <p className="text-xs text-slate-400">JPG, PNG or WebP. Max 2MB.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Alex Johnson"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="bio" className="block text-sm font-medium text-slate-700">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell mentees a bit about your background and expertise…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="subjects" className="block text-sm font-medium text-slate-700">
            Subjects
          </label>
          <input
            id="subjects"
            type="text"
            value={subjectsInput}
            onChange={(e) => setSubjectsInput(e.target.value)}
            placeholder="e.g. Math, Physics, Computer Science"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
          <p className="text-xs text-slate-400">Separate subjects with commas.</p>
        </div>

        {successMessage && (
          <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            {successMessage}
          </p>
        )}

        {mutationError && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {mutationError}
          </p>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={updateMutation.isPending || uploadMutation.isPending}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}