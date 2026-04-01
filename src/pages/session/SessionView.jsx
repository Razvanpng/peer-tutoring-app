import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sessionsApi } from '../../services/api';
import { supabase } from '../../services/supabase';

function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isOwn
            ? 'bg-slate-800 text-white rounded-br-sm'
            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
        }`}
      >
        {message.image_url && (
          <img
            src={message.image_url}
            alt="Attachment"
            className="max-w-xs rounded-lg mb-1 cursor-pointer object-cover"
            onClick={() => window.open(message.image_url, '_blank')}
          />
        )}
        {message.content && <p>{message.content}</p>}
        <p className="text-[10px] mt-1 text-slate-400 text-right">
          {new Date(message.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 ${star <= value ? 'text-amber-400' : 'text-slate-200'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewDisplay({ session }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <StarRating value={session.rating} />
        <span className="text-xs text-slate-500 font-medium">{session.rating} / 5</span>
      </div>
      {session.review && (
        <p className="text-sm text-slate-700 leading-relaxed">{session.review}</p>
      )}
      <p className="text-xs text-slate-400">Review submitted by mentee</p>
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
      setFormError(err.message ?? 'Failed to submit review. Please try again.');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    reviewMutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">Leave a Review</p>
        <p className="text-xs text-slate-500 mt-0.5">How was your session?</p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-700">Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              className="focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-6 h-6 transition-colors ${
                  star <= (hovered ?? rating) ? 'text-amber-400' : 'text-slate-200'
                }`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-xs text-slate-500">{hovered ?? rating} / 5</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="review" className="block text-xs font-medium text-slate-700">
          Review
        </label>
        <textarea
          id="review"
          rows={3}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share what you found helpful or what could be improved…"
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
          disabled={reviewMutation.isPending}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {reviewMutation.isPending ? 'Submitting…' : 'Submit review'}
        </button>
      </div>
    </form>
  );
}

function ReviewSection({ session, userId, onReviewSuccess }) {
  if (session.status !== 'closed') return null;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-6 space-y-2">
      <div className="border-t border-slate-200 pt-5 space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Session Review</p>
        {session.rating != null ? (
          <ReviewDisplay session={session} />
        ) : userId === session.mentee_id ? (
          <ReviewForm sessionId={session.id} onSuccess={onReviewSuccess} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm">
            <p className="text-sm text-slate-400">No review has been submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SessionHeader({ session, onBack, onClose, isClosing }) {
  const STATUS_STYLES = {
    pending:  'bg-amber-50 text-amber-700 border-amber-200',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    closed:   'bg-slate-100 text-slate-500 border-slate-200',
  };

  const style = STATUS_STYLES[session.status] ?? STATUS_STYLES.closed;

  return (
    <header className="bg-white border-b border-slate-200 shrink-0">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-700 transition p-1 -ml-1 rounded-lg hover:bg-slate-100"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{session.topic}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {session.status === 'accepted' && (
            <button
              onClick={onClose}
              disabled={isClosing}
              className="text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClosing ? 'Closing…' : 'Mark as Completed'}
            </button>
          )}
          <span className={`text-xs font-medium border rounded-full px-2.5 py-0.5 capitalize ${style}`}>
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

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const channelRef = useRef(null);
  const lastTypingSentRef = useRef(0);
  const typingTimeoutRef = useRef(null);

  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionsApi.getSession(id),
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', id],
    queryFn: () => sessionsApi.getMessages(id),
    refetchInterval: 3000,
  });

  const closeMutation = useMutation({
    mutationFn: () => sessionsApi.updateSessionStatus(id, 'closed'),
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
    addToast('Review submitted successfully.', 'success');
  }

  useEffect(() => {
    const channel = supabase.channel(`session-${id}`)
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
    channelRef.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: user.id },
    });
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
      addToast(err.message ?? 'Failed to send message.', 'error');
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSend(e);
    }
  }

  function handleTextareaChange(e) {
    setContent(e.target.value);
    sendTypingSignal();
  }

  const isClosed = session?.status === 'closed';

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="bg-white border-b border-slate-200 h-14 shrink-0" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-slate-200 border-t-slate-500 animate-spin" />
            <p className="text-xs text-slate-400">Loading session…</p>
          </div>
        </div>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-8 max-w-sm w-full text-center space-y-3">
          <p className="text-sm font-semibold text-slate-800">Session not found</p>
          <p className="text-xs text-slate-500">
            This session may have been removed or you may not have access to it.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 text-xs text-slate-500 underline underline-offset-2 hover:text-slate-800 transition"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <SessionHeader
        session={session}
        onBack={() => navigate(-1)}
        onClose={() => closeMutation.mutate()}
        isClosing={closeMutation.isPending}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
          {messagesLoading ? (
            <div className="space-y-3 pt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className="h-10 rounded-2xl bg-slate-200 animate-pulse"
                    style={{ width: `${32 + (i * 11) % 28}%` }}
                  />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="text-sm text-slate-400">No messages yet.</p>
              <p className="text-xs text-slate-400">Send the first message below.</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === user.id}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <ReviewSection
          session={session}
          userId={user.id}
          onReviewSuccess={handleReviewSuccess}
        />
      </div>

      <div className={`border-t shrink-0 ${isClosed ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'}`}>
        {isClosed ? (
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-center">
            <p className="text-xs text-slate-400">Session is closed</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-4 pt-2 pb-3 space-y-2">
            {typingUser && (
              <div className="flex items-center gap-1.5 px-1">
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1 h-1 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </span>
                <p className="text-xs text-slate-400">Someone is typing…</p>
              </div>
            )}

            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-16 w-16 rounded-lg object-cover border border-slate-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-slate-900 transition"
                  aria-label="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                aria-label="Attach image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>

              <textarea
                ref={inputRef}
                rows={1}
                value={content}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Write a message… (Enter to send)"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 resize-none leading-relaxed"
              />

              <button
                type="submit"
                disabled={(!content.trim() && !imageFile) || isSending}
                className="shrink-0 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending
                  </span>
                ) : (
                  'Send'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}