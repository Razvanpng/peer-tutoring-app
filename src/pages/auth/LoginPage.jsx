import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#05090f] bg-grain flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse at top, black 0%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at top, black 0%, transparent 70%)' }} />

      <header className="h-20 shrink-0 px-6 lg:px-12 flex items-center z-20 relative">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500" />
          <span className="text-sm font-bold tracking-widest text-white uppercase">
            PeerTutor
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 z-10 relative">
        <div className="w-full max-w-md animate-reveal-up">
          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tighter mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Sign in to your account to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.04]"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.04]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-xs text-red-400 font-medium">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#05090f] px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between group"
            >
              <span>{isLoading ? 'Signing in…' : 'Sign In'}</span>
              {!isLoading && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </form>

          <p className="mt-8 text-sm font-medium text-zinc-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-500 hover:text-emerald-400 transition-colors">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}