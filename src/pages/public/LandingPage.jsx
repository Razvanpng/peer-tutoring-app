import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05090f]/95 border-b border-white/[0.04]">
      <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between">
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
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center px-6 md:px-12 pt-20 overflow-hidden border-b border-white/[0.04]">
      <div className="absolute inset-0 bg-subtle-grid opacity-40 mask-image-b" style={{ maskImage: 'linear-gradient(to right, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)' }} />
      
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full max-w-[1800px] mx-auto">
        <div className="lg:col-span-6 flex flex-col gap-10 items-start opacity-0 animate-reveal-up py-8 z-20">
          
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 tracking-[0.2em] uppercase">
            <span className="w-8 h-px bg-emerald-500/50" />
            Platform Beta Active
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-[7.5rem] font-semibold text-white tracking-tighter leading-[0.9] text-shadow-sm">
            Clarity <br />
            <span className="text-zinc-600">one-to-one.</span>
          </h1>

          <p className="text-xl text-zinc-400 leading-relaxed max-w-xl">
            A minimalist workspace connecting learners with peers. Cut through the noise, share your screen, and resolve academic blockers in real-time.
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-4">
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

          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/[0.04] w-full max-w-lg">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-medium text-white tracking-tight">100+</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Active Mentors</span>
            </div>
            <div className="w-px h-8 bg-white/[0.04]" />
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-medium text-white tracking-tight">{'<'} 5m</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Avg. Match Time</span>
            </div>
          </div>

        </div>
        
        <div className="hidden lg:flex lg:col-span-6 relative h-[800px] w-full flex-col items-center justify-center opacity-0 animate-fade-in z-10" style={{ animationDelay: '0.4s' }}>
          
          <div className="absolute w-[600px] h-[600px] border border-white/[0.02] rounded-full flex items-center justify-center">
            <div className="w-[400px] h-[400px] border border-white/[0.04] rounded-full flex items-center justify-center animate-pulse-slow">
              <div className="w-[200px] h-[200px] border border-white/[0.06] rounded-full bg-emerald-500/5 blur-3xl" />
            </div>
          </div>

          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 800">
            <path d="M 200 200 L 400 350 L 600 250" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 400 350 L 450 550 L 250 600" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 600 250 L 650 450 L 450 550" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
          </svg>

          <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-zinc-900/80 flex items-center justify-center backdrop-blur-sm animate-float-slow">
            <div className="w-8 h-8 rounded-full bg-zinc-800" />
          </div>
          
          <div className="absolute top-[30%] right-[25%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 animate-float-slow" style={{ animationDelay: '-2s' }}>
            <div className="px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-400 font-medium uppercase tracking-widest backdrop-blur-md">
              Session Live
            </div>
            <div className="w-16 h-16 rounded-full border border-emerald-500/30 bg-zinc-900/80 flex items-center justify-center backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-zinc-800" />
            </div>
          </div>

          <div className="absolute bottom-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 bg-zinc-900/80 flex items-center justify-center backdrop-blur-sm animate-float-slow" style={{ animationDelay: '-4s' }}>
            <div className="w-6 h-6 rounded-full bg-zinc-800" />
          </div>

          <div className="absolute bottom-[25%] right-[30%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/10 bg-zinc-900/80 flex items-center justify-center backdrop-blur-sm animate-float-slow" style={{ animationDelay: '-1s' }}>
            <div className="w-10 h-10 rounded-full bg-zinc-800" />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-emerald-500/20 bg-[#05090f] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.1)] z-10">
            <div className="w-2 h-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </div>

        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    id: '01',
    title: 'Match & Connect',
    description: 'Find verified peers filtered by subject. Review their profiles and send a request without leaving the platform.',
  },
  {
    id: '02',
    title: 'Live Workspace',
    description: 'Collaborate in real-time. Use the built-in chat, share files, and work together in the synchronized editor.',
  },
  {
    id: '03',
    title: 'Review & Grow',
    description: 'Close the loop. Rate your sessions to help build a trusted community of reliable peer mentors.',
  },
];

function FeaturesSection() {
  return (
    <section className="relative py-32 px-6 md:px-12 border-b border-white/[0.04]">
      <div className="w-full max-w-[1800px] mx-auto">
        <div className="mb-24 flex items-end justify-between border-b border-white/10 pb-8">
          <h2 className="text-4xl font-semibold text-white tracking-tighter">
            System Workflow
          </h2>
          <span className="text-xs text-zinc-500 uppercase tracking-[0.2em] hidden sm:block">
            Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col gap-8 group"
            >
              <div className="text-sm font-medium text-emerald-500 font-mono">
                {feature.id}
              </div>
              <div className="w-full h-px bg-white/10 group-hover:bg-emerald-500/50 transition-colors duration-500" />
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-base text-zinc-500 leading-relaxed max-w-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="relative py-32 px-6 md:px-12 bg-[#05090f]">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 border border-white/10 p-12 lg:p-24">
        <div className="max-w-xl">
          <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tighter mb-6">
            Initiate Session
          </h2>
          <p className="text-lg text-zinc-500">
            Join the community today. Whether you need help or want to help others, your space is waiting.
          </p>
        </div>
        <Link
          to="/register"
          className="shrink-0 bg-white text-[#05090f] text-sm font-bold uppercase tracking-widest px-10 py-5 hover:bg-zinc-200 transition-colors"
        >
          Create Account
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#05090f]">
      <div className="w-full px-6 md:px-12 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500" />
          <span className="text-sm font-bold tracking-widest text-white uppercase">
            PeerTutor
          </span>
        </div>
        <div className="flex gap-12 text-xs font-medium text-zinc-600 uppercase tracking-widest">
          <span>Built for learners</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#05090f] bg-grain flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}