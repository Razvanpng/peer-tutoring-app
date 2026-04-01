import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { supabase } from '../../services/supabase';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'html', label: 'HTML' },
];

const EXTENSIONS = {
  javascript: 'js',
  python: 'py',
  cpp: 'cpp',
  java: 'java',
  html: 'html',
};

export default function CodeEditor({ sessionId, userName, onClose }) {
  const [language, setLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);
  const ydocRef = useRef(null);
  const channelRef = useRef(null);
  const bindingRef = useRef(null);
  const downloadRef = useRef(null);

  useEffect(() => {
    return () => {
      bindingRef.current?.destroy();
      ydocRef.current?.destroy();
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, []);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const type = ydoc.getText('monaco');

    bindingRef.current = new MonacoBinding(type, editor.getModel(), new Set([editor]));

    const channel = supabase.channel(`workspace-${sessionId}`);
    channelRef.current = channel;

    channel.on('broadcast', { event: 'yjs-update' }, (payload) => {
      Y.applyUpdate(ydoc, new Uint8Array(payload.payload.update), channel);
    });

    channel.on('broadcast', { event: 'request-state' }, () => {
      const state = Y.encodeStateAsUpdate(ydoc);
      channel.send({
        type: 'broadcast',
        event: 'yjs-update',
        payload: { update: Array.from(state) },
      });
    });

    ydoc.on('update', (update, origin) => {
      if (origin !== channel) {
        channel.send({
          type: 'broadcast',
          event: 'yjs-update',
          payload: { update: Array.from(update) },
        });
      }
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.send({ type: 'broadcast', event: 'request-state' });
      }
    });
  }

  async function handleCopy() {
    const code = editorRef.current?.getValue() ?? '';
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const code = editorRef.current?.getValue() ?? '';
    const ext = EXTENSIONS[language] ?? 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    downloadRef.current.href = url;
    downloadRef.current.download = `workspace.${ext}`;
    downloadRef.current.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] overflow-hidden rounded-xl border border-slate-200">
      <div className="h-12 bg-slate-900 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-700" />
            <span className="w-3 h-3 rounded-full bg-slate-700" />
            <span className="w-3 h-3 rounded-full bg-slate-700" />
          </div>
          <span className="text-xs font-medium text-slate-400 ml-2">Live Workspace</span>
        </div>

        <div className="flex items-center gap-1.5">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 border-0 outline-none focus:ring-1 focus:ring-slate-600 cursor-pointer mr-1"
          >
            {LANGUAGES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>

          <button
            onClick={handleDownload}
            title="Download file"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>

          <button
            onClick={onClose}
            title="Close workspace"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition ml-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <a ref={downloadRef} className="hidden" aria-hidden="true" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 22,
            padding: { top: 12, bottom: 12 },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'gutter',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontLigatures: true,
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            contextmenu: false,
          }}
        />
      </div>
    </div>
  );
}