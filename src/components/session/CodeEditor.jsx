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
    <div className="flex flex-col h-full bg-[#0a0f16] overflow-hidden border border-white/[0.04]">
      <div className="h-14 bg-white/[0.02] border-b border-white/[0.04] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 pl-1">
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-l border-white/5 pl-4 py-1">Code Space</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#05090f] text-zinc-300 text-xs border border-white/10 px-2 py-1 outline-none focus:border-emerald-500/50 cursor-pointer mr-2"
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
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <rect x="9" y="9" width="13" height="13" />
                <path d="M5 15H4V4h9v1" />
              </svg>
            )}
          </button>

          <button
            onClick={handleDownload}
            title="Download file"
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M21 15v4H5v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>

          <button
            onClick={onClose}
            title="Close workspace"
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 transition-colors ml-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
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
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
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