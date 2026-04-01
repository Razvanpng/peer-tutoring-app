import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sessionsApi } from '../../services/api';
import { supabase } from '../../services/supabase';
import CodeEditor from '../../components/session/CodeEditor';

function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex items-end gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`max-w-[75%] px-5 py-3 text-sm leading-relaxed ${
          isOwn
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-50'
            : 'bg-white/[0.02] border border-white/10 text-zinc-300'
        }`}
      >
        {message.image_url && (
          <img
            src={message.image_url}
            alt="Attachment"
            className="max-w-xs mb-2 cursor-pointer object-cover border border-white/10"
            onClick={() => window.open(message.image_url, '_blank')}
          />
        )}
        {message.content && <p>{message.content}</p>}
        <p className={`text-[9px] mt-2 font-mono uppercase tracking-widest ${isOwn ? 'text-emerald-500/50 text-right' : 'text-zinc-600 text-right'}`}>
          {new Date(message.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 ${star <= value ? 'text-emerald-400' : 'text-white/10'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewDisplay({ session }) {
  return (
    <div className="bg-white/[0.01] border border-white/5 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <StarRating value={session.rating} />
        <span className="text-[10px] text-zinc-500 font-mono">{session.rating} / 5</span>
      </div>
      {session.review && (
        <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-white/10 pl-4">{session.review}</p>
      )}
      <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-mono">Review logged by mentee</p>
    </div>
  );
}

function ReviewForm({ sessionId, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [hovered, setHovered] = useState(null);
  const [formError, setFormError] = useState(null);

  const reviewMutation = useMutation({
    mutationFn: () => sessionsApi.submitReview(sessionId, rating, review),
    onSuccess: () => {
      setFormError(null);
      onSuccess();
    },
    onError: (err) => {
      setFormError(err.message ?? 'Transmission failed.');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    reviewMutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/[0.01] border border-white/5 p-6 space-y-6">
      <div>
        <p className="text-sm font-semibold text-white tracking-tight">Log Review</p>
        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-mono">Evaluate execution</p>
      </div>

      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Rating</label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              className="focus:outline-none p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-colors ${star <= (hovered ?? rating) ? 'text-emerald-400' : 'text-white/10'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </button>
          ))}
          <span className="ml-3 text-[10px] text-zinc-500 font-mono">{hovered ?? rating} / 5</span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="review" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Details</label>
        <textarea
          id="review"
          rows={3}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Enter telemetry data..."
          className="w-full bg-[#05090f] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-700 outline-none transition-colors focus:border-emerald-500/50 resize-none"
        />
      </div>

      {formError && (
        <p className="text-[10px] font-mono text-red-400 p-2 bg-red-500/10 border border-red-500/20">
          {formError}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={reviewMutation.isPending}
          className="bg-emerald-500 hover:bg-emerald-400 text-[#05090f] px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
        >
          {reviewMutation.isPending ? 'Logging...' : 'Commit Review'}
        </button>
      </div>
    </form>
  );
}

function ReviewSection({ session, userId, onReviewSuccess }) {
  if (session.status !== 'completed') return null;

  return (
    <div className="px-6 pb-8 space-y-4">
      <div className="border-t border-white/[0.04] pt-8 space-y-4">
        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Session Terminal</p>
        {session.rating != null ? (
          <ReviewDisplay session={session} />
        ) : userId === session.mentee_id ? (
          <ReviewForm sessionId={session.id} onSuccess={onReviewSuccess} />
        ) : (
          <div className="border border-white/5 border-dashed p-6 text-center">
            <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">Awaiting mentee review.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SessionHeader({ session, onBack, onClose, isClosing, isEditorOpen, onToggleEditor }) {
  const STATUS_STYLES = {
    pending:  'text-amber-400 border-amber-400/20 bg-amber-400/5',
    accepted: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    completed: 'text-zinc-400 border-white/5 bg-white/[0.02]',
  };

  const style = STATUS_STYLES[session.status] ?? STATUS_STYLES.completed;

  return (
    <header className="bg-[#05090f] border-b border-white/[0.04] shrink-0">
      <div className="px-6 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 min-w-0">
          <button onClick={onBack} className="text-zinc-500 hover:text-white transition-colors p-2 -ml-2" aria-label="Go back">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="w-px h-6 bg-white/10" />
          <p className="text-sm font-semibold text-white truncate tracking-tight">{session.topic}</p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={onToggleEditor}
            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4 py-2 transition-colors border ${
              isEditorOpen
                ? 'bg-emerald-500 text-[#05090f] border-emerald-500 hover:bg-emerald-400'
                : 'text-zinc-400 border-white/10 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Workspace
          </button>

          {session.status === 'accepted' && (
            <button
              onClick={onClose}
              disabled={isClosing}
              className="text-[10px] font-bold text-zinc-400 border border-white/10 px-4 py-2 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest disabled:opacity-50"
            >
              {isClosing ? 'Closing...' : 'Terminate Session'}
            </button>
          )}

          <span className={`text-[9px] font-mono uppercase tracking-widest border px-3 py-1 ${style}`}>
            {session.status}
          </span>
        </div>
      </div>
    </header>
  );
}

export default function SessionView() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [typingUser, setTypingUser] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const channelRef = useRef(null);
  const lastTypingSentRef = useRef(0);
  const typingTimeoutRef = useRef(null);

  const { data: session, isLoading: sessionLoading, isError: sessionError } = useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionsApi.getSession(id),
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', id],
    queryFn: () => sessionsApi.getMessages(id),
    refetchInterval: 3000,
  });

  const closeMutation = useMutation({
    mutationFn: () => sessionsApi.updateSessionStatus(id, 'completed'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', id] });
      addToast('Session marked as completed.', 'success');
    },
    onError: () => {
      addToast('Failed to close session.', 'error');
    },
  });

  function handleReviewSuccess() {
    queryClient.invalidateQueries({ queryKey: ['session', id] });
    addToast('Review logged successfully.', 'success');
  }

  useEffect(() => {
    const channel = supabase
      .channel(`session-${id}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload?.userId !== user.id) {
          setTypingUser(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setTypingUser(false), 3000);
        }
      })
      .subscribe();

    channelRef.current = channel;
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      supabase.removeChannel(channel);
    };
  }, [id, user.id]);

  const sendTypingSignal = useCallback(() => {
    const now = Date.now();
    if (now - lastTypingSentRef.current < 2000) return;
    lastTypingSentRef.current = now;
    channelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { userId: user.id } });
  }, [user.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = '';
  }

  function removeImage() {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  }

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = content.trim();
    if ((!trimmed && !imageFile) || isSending) return;

    setIsSending(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await sessionsApi.uploadChatImage(id, imageFile);
        removeImage();
      }
      await sessionsApi.sendMessage(id, user.id, trimmed, imageUrl);
      queryClient.invalidateQueries({ queryKey: ['messages', id] });
      setContent('');
      inputRef.current?.focus();
    } catch (err) {
      addToast(err.message ?? 'Transmission failed.', 'error');
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) handleSend(e);
  }

  function handleTextareaChange(e) {
    setContent(e.target.value);
    sendTypingSignal();
  }

  const isClosed = session?.status === 'completed';
  const editorUserName = user?.user_metadata?.full_name || user?.email || 'Anonymous';

  if (sessionLoading) {
    return (
      <div className="h-screen bg-[#05090f] bg-grain flex flex-col font-sans">
        <div className="bg-[#05090f] border-b border-white/[0.04] h-16 shrink-0" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="h-screen bg-[#05090f] bg-grain flex flex-col font-sans items-center justify-center p-6">
        <div className="border border-red-500/20 bg-red-500/5 p-10 text-center max-w-md w-full">
          <p className="text-sm font-bold text-white mb-2">Node Unreachable</p>
          <p className="text-xs text-zinc-500 mb-6 leading-relaxed">The requested session has been purged or you lack sufficient clearance.</p>
          <button onClick={() => navigate(-1)} className="text-[10px] font-bold text-red-400 uppercase tracking-widest border border-red-500/30 px-6 py-2 hover:bg-red-500/10 transition-colors">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const chatColumn = (
    <div className="flex flex-col h-full bg-[#0a0f16] border border-white/[0.04] overflow-hidden relative">
      <div className="flex-1 overflow-y-auto scrollbar-none p-6 space-y-4">
        {messagesLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className="h-12 bg-white/5 animate-pulse" style={{ width: `${40 + (i * 15) % 30}%` }} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
            <p className="text-sm text-zinc-500">Channel opened.</p>
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Awaiting input...</p>
          </div>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} isOwn={message.sender_id === user.id} />)
        )}
        <div ref={bottomRef} />
        <ReviewSection session={session} userId={user.id} onReviewSuccess={handleReviewSuccess} />
      </div>

      <div className="shrink-0 bg-[#05090f] border-t border-white/[0.04]">
        {isClosed ? (
          <div className="p-4 flex items-center justify-center">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Connection Terminated</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {typingUser && (
              <div className="flex items-center gap-2 px-2">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1 h-1 bg-emerald-500/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </span>
                <p className="text-[9px] font-mono text-emerald-500/50 uppercase tracking-widest">Incoming transmission...</p>
              </div>
            )}

            {imagePreview && (
              <div className="relative inline-block ml-2">
                <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover border border-white/10" />
                <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 w-5 h-5 bg-[#05090f] border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-end gap-3">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

              <button type="button" onClick={() => fileInputRef.current?.click()} className="shrink-0 p-3 text-zinc-500 border border-white/10 bg-white/[0.02] hover:text-white hover:bg-white/5 transition-colors" aria-label="Attach file">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>

              <textarea
                ref={inputRef}
                rows={1}
                value={content}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Type command..."
                className="flex-1 bg-white/[0.02] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-500/50 resize-none leading-relaxed"
              />

              <button type="submit" disabled={(!content.trim() && !imageFile) || isSending} className="shrink-0 bg-emerald-500 text-[#05090f] px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed">
                {isSending ? 'Tx...' : 'Send'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#05090f] bg-grain flex flex-col font-sans overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden xl:block">
        <div className="absolute top-[20%] left-[-10%] w-[30%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
        
        <div className="absolute inset-y-0 left-[4%] w-px bg-white/[0.02]" />
        <div className="absolute inset-y-0 left-[6%] w-px bg-white/[0.02]" />
        <div className="absolute bottom-32 left-[5%] text-[9px] font-mono text-zinc-700 tracking-[0.3em] uppercase [writing-mode:vertical-rl] rotate-180">
          NODE.01_ACTIVE
        </div>

        <div className="absolute inset-y-0 right-[4%] w-px bg-white/[0.02]" />
        <div className="absolute inset-y-0 right-[6%] w-px bg-white/[0.02]" />
        <div className="absolute top-32 right-[5%] text-[9px] font-mono text-zinc-700 tracking-[0.3em] uppercase [writing-mode:vertical-rl]">
          SYSTEMS NOMINAL
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto border-x border-white/[0.04] h-full flex flex-col bg-[#05090f]/50 relative z-10">
        <SessionHeader
          session={session}
          onBack={() => navigate(-1)}
          onClose={() => closeMutation.mutate()}
          isClosing={closeMutation.isPending}
          isEditorOpen={isEditorOpen}
          onToggleEditor={() => setIsEditorOpen((prev) => !prev)}
        />

        <div className="flex-1 p-6 overflow-hidden">
          {isEditorOpen ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {chatColumn}
              <div className="hidden lg:block h-full">
                <CodeEditor sessionId={id} userName={editorUserName} onClose={() => setIsEditorOpen(false)} />
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full h-full">
              {chatColumn}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}