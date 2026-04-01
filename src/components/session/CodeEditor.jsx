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

export default function CodeEditor({ sessionId, userName }) {
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef(null);
  const ydocRef = useRef(null);
  const channelRef = useRef(null);
  const bindingRef = useRef(null);

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

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 border-0 outline-none focus:ring-1 focus:ring-slate-600 cursor-pointer"
        >
          {LANGUAGES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
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