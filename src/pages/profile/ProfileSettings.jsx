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
      setSubjectsInput(Array.isArray(profile.subjects) ? profile.subjects.join(', ') : '');
      setAvatarUrl(profile.avatar_url ?? null);
    }
  }, [profile]);

  const uploadMutation = useMutation({
    mutationFn: (file) => profilesApi.uploadAvatar(user.id, file),
    onSuccess: (url) => { setAvatarUrl(url); },
    onError: (err) => { setMutationError(err.message ?? 'Upload failed.'); },
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => profilesApi.updateProfile(user.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      setSuccessMessage('Parameters updated successfully.');
      setMutationError(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    onError: (err) => {
      setMutationError(err.message ?? 'Update execution failed.');
      setSuccessMessage(null);
    },
  });

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const subjects = subjectsInput.split(',').map((s) => s.trim()).filter(Boolean);
    updateMutation.mutate({ full_name: fullName.trim(), bio: bio.trim(), subjects, avatar_url: avatarUrl });
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-6">
        <div className="h-8 w-48 bg-white/5" />
        <div className="h-[400px] border border-white/5 bg-white/[0.01]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tighter">Configuration</h1>
        <p className="text-sm text-zinc-500 mt-2 font-mono">Manage identity and system parameters.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="flex items-start gap-6 pb-8 border-b border-white/5">
          <div className="w-20 h-20 bg-[#05090f] border border-white/10 shrink-0 flex items-center justify-center relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-mono text-zinc-500">{fullName?.[0] || '?'}</span>
            )}
            {uploadMutation.isPending && (
              <div className="absolute inset-0 bg-[#05090f]/80 flex items-center justify-center backdrop-blur-sm">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] px-4 py-2 transition-colors disabled:opacity-50"
            >
              Override Image
            </button>
            <p className="text-[10px] font-mono text-zinc-600">Max size 2MB. JPG, PNG.</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Designation (Full Name)
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#05090f] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-700 outline-none transition-colors focus:border-emerald-500/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Telemetry (Bio)
            </label>
            <textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your expertise..."
              className="w-full bg-[#05090f] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-700 outline-none transition-colors focus:border-emerald-500/50 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subjects" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Vectors (Subjects)
            </label>
            <input
              id="subjects"
              type="text"
              value={subjectsInput}
              onChange={(e) => setSubjectsInput(e.target.value)}
              placeholder="e.g. Mathematics, Calculus"
              className="w-full bg-[#05090f] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-700 outline-none transition-colors focus:border-emerald-500/50"
            />
            <p className="text-[10px] font-mono text-zinc-600">Comma separated variables.</p>
          </div>
        </div>

        {successMessage && (
          <div className="p-3 border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
            {successMessage}
          </div>
        )}

        {mutationError && (
          <div className="p-3 border border-red-500/20 bg-red-500/10 text-[10px] font-mono text-red-400 uppercase tracking-widest">
            {mutationError}
          </div>
        )}

        <div className="pt-6 border-t border-white/5">
          <button
            type="submit"
            disabled={updateMutation.isPending || uploadMutation.isPending}
            className="bg-emerald-500 hover:bg-emerald-400 text-[#05090f] px-8 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Executing...' : 'Commit Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}