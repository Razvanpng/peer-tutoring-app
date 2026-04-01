import { Link } from 'react-router-dom';

const FEATURES = [
  {
    id: '01',
    title: 'Match & Connect',
    description: 'Find verified peers filtered by subject. Review profiles and request instantly.',
  },
  {
    id: '02',
    title: 'Live Workspace',
    description: 'Collaborate in real-time. Built-in chat, screen sharing, and synchronized editor.',
  },
  {
    id: '03',
    title: 'Review & Grow',
    description: 'Close the loop. Rate your sessions to help build a trusted academic community.',
  },
];

export default function LandingPage() {
  return (
    <div className="h-screen w-full bg-[#05090f] bg-grain flex flex-col overflow-hidden font-sans">
      
      <nav className="h-20 shrink-0 bg-[#05090f]/95 border-b border-white/[0.04] px-6 lg:px-12 flex items-center justify-between z-50 relative">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500" />
          <span className="text-sm font-bold tracking-widest text-white uppercase">
            PeerTutor
          </span>
        </div>
        <div className="flex items-center gap-8">
          <Link
            to="/login"
            className="text-xs font-semibold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-xs font-bold text-[#05090f] bg-white hover:bg-zinc-200 uppercase tracking-widest px-7 py-3 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-1 min-h-0 w-full flex flex-col lg:flex-row relative">
        <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" style={{ maskImage: 'linear-gradient(to right, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)' }} />

        <div className="relative z-10 w-full lg:w-[55%] xl:w-[50%] h-full flex flex-col justify-between border-r border-white/[0.04] bg-[#05090f]/80 p-6 lg:p-12 xl:p-16 overflow-y-auto scrollbar-none">
          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto lg:mx-0 w-full">
            
            <div className="flex items-center gap-4 text-[10px] font-semibold text-zinc-500 tracking-[0.2em] uppercase mb-8 opacity-0 animate-reveal-up">
              <span className="w-8 h-px bg-emerald-500/50" />
              Platform Beta Active
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold text-white tracking-tighter leading-[0.9] text-shadow-sm mb-6 opacity-0 animate-reveal-up" style={{ animationDelay: '0.1s' }}>
              Clarity <br />
              <span className="text-zinc-600">one-to-one.</span>
            </h1>

            <p className="text-base lg:text-lg text-zinc-400 leading-relaxed max-w-lg mb-10 opacity-0 animate-reveal-up" style={{ animationDelay: '0.2s' }}>
              A minimalist workspace connecting learners with peers. Cut through the noise, share your screen, and resolve academic blockers in real-time.
            </p>

            <div className="flex flex-wrap items-center gap-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/register"
                className="group relative flex items-center justify-between w-48 bg-emerald-500 text-[#05090f] text-sm font-bold px-6 py-4 transition-all duration-300 hover:pr-4"
              >
                <span className="uppercase tracking-widest">Start</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="text-xs font-semibold text-zinc-500 hover:text-white uppercase tracking-widest transition-all duration-300"
              >
                Log in instead
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/[0.04] opacity-0 animate-fade-in shrink-0" style={{ animationDelay: '0.6s' }}>
            {FEATURES.map((f) => (
              <div key={f.id} className="flex flex-col gap-2 group">
                <span className="text-[10px] text-emerald-500 font-bold tracking-widest mb-1">{f.id}</span>
                <h3 className="text-sm font-semibold text-zinc-200 tracking-tight">{f.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed pr-4">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="hidden lg:flex w-[45%] xl:w-[50%] h-full relative items-center justify-center p-12 bg-[#060910] overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.02] flex items-center justify-center">
            <div className="w-[400px] h-[400px] rounded-full border border-white/[0.04] flex items-center justify-center animate-pulse-slow">
              <div className="w-[200px] h-[200px] rounded-full bg-emerald-500/5 blur-[80px]" />
            </div>
          </div>

          <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 800 800">
            <path d="M 200 300 L 400 400 L 550 250" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 400 400 L 450 600 L 250 650" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 550 250 L 650 450 L 450 600" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
          </svg>

          <div className="absolute top-[35%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/10 bg-zinc-900/80 flex items-center justify-center backdrop-blur-sm animate-float-slow shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-zinc-800" />
          </div>
          
          <div className="absolute top-[25%] right-[25%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 animate-float-delayed">
            <div className="px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-bold text-emerald-400 uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              Session Live
            </div>
            <div className="w-20 h-20 rounded-full border border-emerald-500/30 bg-zinc-900/80 flex items-center justify-center backdrop-blur-sm shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-zinc-800" />
            </div>
          </div>

          <div className="absolute bottom-[20%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-zinc-900/80 flex items-center justify-center backdrop-blur-sm animate-float-slow shadow-2xl" style={{ animationDelay: '-3s' }}>
            <div className="w-8 h-8 rounded-full bg-zinc-800" />
          </div>

          <div className="absolute bottom-[35%] right-[20%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/10 bg-zinc-900/80 flex items-center justify-center backdrop-blur-sm animate-float-delayed shadow-2xl" style={{ animationDelay: '-2s' }}>
            <div className="w-12 h-12 rounded-full bg-zinc-800" />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-emerald-500/20 bg-[#05090f] flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.15)] z-10">
            <div className="w-2.5 h-2.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
          </div>

        </div>
      </main>

      <footer className="h-14 shrink-0 border-t border-white/[0.04] bg-[#05090f] px-6 lg:px-12 flex items-center justify-between relative z-50">
        <div className="flex gap-8 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
          <span>Built for learners</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-2.5">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
           <span className="text-[10px] font-semibold text-emerald-500/50 uppercase tracking-widest">Systems Nominal</span>
        </div>
      </footer>

    </div>
  );
}