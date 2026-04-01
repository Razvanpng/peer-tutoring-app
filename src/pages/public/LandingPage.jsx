import { Link } from 'react-router-dom';

const FEATURES = [
  {
    id: '01',
    title: 'Match & Connect',
    description: 'Find verified peers. Send session requests without leaving the platform.',
  },
  {
    id: '02',
    title: 'Live Workspace',
    description: 'Collaborate in real-time. Built-in chat and synchronized code editor.',
  },
  {
    id: '03',
    title: 'Review & Grow',
    description: 'Close the loop. Rate your sessions to build a trusted community.',
  },
];

export default function LandingPage() {
  return (
    <div className="h-screen w-full bg-[#05090f] bg-grain flex flex-col overflow-hidden font-sans">
      
      <header className="h-20 shrink-0 bg-[#05090f]/95 border-b border-white/[0.04] px-6 lg:px-12 flex items-center justify-between z-50 relative">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500" />
          <span className="text-sm font-bold tracking-widest text-white uppercase">
            PeerTutor
          </span>
        </div>
        <div className="flex items-center gap-8">
          <Link
            to="/login"
            className="text-xs font-medium text-zinc-400 hover:text-white uppercase tracking-widest transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-xs font-bold text-[#05090f] bg-white hover:bg-zinc-200 uppercase tracking-widest px-6 py-3 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 min-h-0 w-full flex flex-col lg:flex-row relative">
        <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" style={{ maskImage: 'linear-gradient(to right, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)' }} />

        <div className="relative z-10 w-full lg:w-[60%] h-full flex flex-col justify-between border-r border-white/[0.04] bg-[#05090f]/50 p-6 lg:p-12 overflow-y-auto scrollbar-none">
          <div className="flex-1 flex flex-col justify-center max-w-2xl">
            <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 tracking-[0.2em] uppercase mb-8">
              <span className="w-8 h-px bg-emerald-500/50" />
              Platform Beta Active
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-semibold text-white tracking-tighter leading-[0.9] text-shadow-sm mb-6 animate-reveal-up">
              Clarity <br />
              <span className="text-zinc-600">one-to-one.</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              A minimalist workspace connecting learners with peers. Cut through the noise, share your screen, and resolve academic blockers in real-time.
            </p>

            <div className="flex flex-wrap items-center gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
                className="text-xs font-medium text-zinc-500 hover:text-white uppercase tracking-widest transition-all duration-300"
              >
                Log in instead
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 mt-10 border-t border-white/[0.04] animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {FEATURES.map((f) => (
              <div key={f.id} className="flex flex-col gap-2 group">
                <span className="text-[10px] text-emerald-500 font-mono tracking-widest">{f.id}</span>
                <h3 className="text-sm font-semibold text-zinc-200 tracking-tight">{f.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed pr-4">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="hidden lg:flex w-[40%] h-full relative items-center justify-center p-12 bg-[#0a0f16]/80 border-b lg:border-b-0 border-white/[0.04]">
          <div className="w-full max-w-md aspect-[3/4] border border-white/5 bg-[#05090f] p-8 relative flex flex-col animate-float-slow shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 to-transparent" />
            <div className="flex justify-between items-center mb-10">
              <div className="w-2 h-2 bg-zinc-700" />
              <span className="text-[10px] text-zinc-600 tracking-widest uppercase">Session.Active</span>
            </div>
            
            <div className="flex-1 space-y-6 flex flex-col justify-end">
              <div className="h-px w-full bg-white/5" />
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 bg-white/10 shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="h-2 bg-white/10 w-1/3" />
                  <div className="h-2 bg-white/5 w-3/4" />
                </div>
              </div>
              <div className="h-px w-full bg-white/5" />
              <div className="flex gap-4 items-start flex-row-reverse">
                <div className="w-6 h-6 bg-emerald-500/20 shrink-0" />
                <div className="space-y-2 w-full flex flex-col items-end">
                  <div className="h-2 bg-emerald-500/20 w-1/4" />
                  <div className="h-2 bg-white/5 w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="h-14 shrink-0 border-t border-white/[0.04] bg-[#05090f] px-6 lg:px-12 flex items-center justify-between relative z-50">
        <div className="flex gap-8 text-[10px] font-medium text-zinc-600 uppercase tracking-widest">
          <span>Built for learners</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
           <span className="text-[10px] text-emerald-500/50 uppercase tracking-widest">Systems Nominal</span>
        </div>
      </footer>

    </div>
  );
}