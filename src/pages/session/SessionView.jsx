import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { sessionsApi } from '../../services/api';

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
        <p>{message.content}</p>
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [content, setContent] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

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

  const sendMutation = useMutation({
    mutationFn: (text) => sessionsApi.sendMessage(id, user.id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', id] });
      setContent('');
      inputRef.current?.focus();
    },
  });

  const closeMutation = useMutation({
    mutationFn: () => sessionsApi.updateSessionStatus(id, 'closed'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', id] });
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || sendMutation.isPending) return;
    sendMutation.mutate(trimmed);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSend(e);
    }
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
      </div>

      {sendMutation.isError && (
        <div className="bg-red-50 border-t border-red-100 px-4 py-2">
          <p className="max-w-2xl mx-auto text-xs text-red-500">
            {sendMutation.error?.message ?? 'Failed to send message. Please try again.'}
          </p>
        </div>
      )}

      <div className={`border-t shrink-0 ${isClosed ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'}`}>
        {isClosed ? (
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-center">
            <p className="text-xs text-slate-400">Session is closed</p>
          </div>
        ) : (
          <form
            onSubmit={handleSend}
            className="max-w-2xl mx-auto px-4 py-3 flex items-end gap-3"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a message… (Enter to send)"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 resize-none leading-relaxed"
            />
            <button
              type="submit"
              disabled={!content.trim() || sendMutation.isPending}
              className="shrink-0 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {sendMutation.isPending ? (
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
        )}
      </div>
    </div>
  );
}