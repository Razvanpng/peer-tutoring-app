import { useToast } from '../../context/ToastContext';

const TYPE_STYLES = {
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: 'text-emerald-500',
    close: 'text-emerald-400 hover:text-emerald-700',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: 'text-red-500',
    close: 'text-red-400 hover:text-red-700',
  },
  info: {
    container: 'bg-slate-50 border-slate-200 text-slate-700',
    icon: 'text-slate-400',
    close: 'text-slate-400 hover:text-slate-700',
  },
};

function ToastIcon({ type }) {
  if (type === 'success') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (type === 'error') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function Toast({ toast }) {
  const { removeToast } = useToast();
  const styles = TYPE_STYLES[toast.type] ?? TYPE_STYLES.info;

  return (
    <div
      className={`flex items-start gap-3 w-80 rounded-xl border px-4 py-3 shadow-sm animate-slide-up ${styles.container}`}
    >
      <span className={styles.icon}>
        <ToastIcon type={toast.type} />
      </span>
      <p className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className={`shrink-0 transition ${styles.close}`}
        aria-label="Dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} />
        </div>
      ))}
    </div>
  );
}