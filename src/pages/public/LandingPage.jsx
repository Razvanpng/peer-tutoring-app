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
      <div className="absolute inset-0 bg-subtle-grid opacity-40 mask-image-b" style={{ maskImage: 'linear-gradient(to right, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)' }} />
      
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">
        <div className="lg:col-span-8 flex flex-col gap-10 items-start opacity-0 animate-reveal-up border-l border-white/10 pl-8 lg:pl-16 py-8">
          
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 tracking-[0.2em] uppercase">
            <span className="w-8 h-px bg-emerald-500/50" />
            Platform Beta Active
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-[6rem] font-semibold text-white tracking-tighter leading-[0.95] text-shadow-sm">
            Clarity <br />
            <span className="text-zinc-600">one-to-one.</span>
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed max-w-xl">
            A minimalist workspace connecting learners with peers. Cut through the noise, share your screen, and resolve academic blockers in real-time.
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6">
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
        
        <div className="hidden lg:flex lg:col-span-4 relative h-full flex-col justify-end pb-20 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="w-full aspect-[3/4] border border-white/5 bg-[#0a0f16] p-8 relative overflow-hidden animate-float-slow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 to-transparent" />
            <div className="flex justify-between items-start mb-12">
              <div className="w-2 h-2 bg-zinc-700" />
              <span className="text-[10px] text-zinc-600 tracking-widest uppercase">Session.Active</span>
            </div>
            
            <div className="space-y-6">
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