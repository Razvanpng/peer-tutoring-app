import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05090f]/90 backdrop-blur-xl border-b border-white/[0.04] supports-[backdrop-filter]:bg-[#05090f]/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            PeerTutor
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium text-white bg-white/10 border border-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
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
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-subtle-grid opacity-30 mask-image-b" style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }} />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-8 items-start opacity-0 animate-slide-up">
          <div className="inline-flex items-center gap-3 border border-emerald-500/20 bg-emerald-500/5 rounded-full px-4 py-1.5 text-xs font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Open platform beta
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05]">
            Clarity comes
            <br />
            <span className="text-zinc-500">one-to-one.</span>
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed max-w-lg">
            Connect with peers who understand your specific material. Collaborate live, share knowledge, and solve problems together.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#05090f] text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
            >
              Start learning
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white px-6 py-3 rounded-full hover:bg-white/5 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-teal-500/10 blur-[100px] rounded-full animate-glow-pulse" />
          
          <div className="relative w-full aspect-square max-w-sm">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
              <path d="M 120 280 C 150 280, 200 120, 280 120" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="2" strokeDasharray="6 6" />
              <circle cx="120" cy="280" r="4" fill="#10B981" />
              <circle cx="280" cy="120" r="4" fill="#14B8A6" />
              
              <circle cx="0" cy="0" r="3" fill="#fff">
                <animateMotion path="M 120 280 C 150 280, 200 120, 280 120" dur="3s" repeatCount="indefinite" />
              </circle>
            </svg>

            <div className="absolute top-[80px] right-[80px] w-20 h-20 bg-[#05090f] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl animate-float-slow z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            
            <div className="absolute bottom-[80px] left-[80px] w-16 h-16 bg-[#05090f] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl animate-float-delayed z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    title: 'Match & Connect',
    description: 'Find verified peers filtered by subject. Review their profiles and send a session request without leaving the platform.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    ),
  },
  {
    title: 'Live Workspace',
    description: 'Collaborate in real-time. Use the built-in chat, share files, and work together in the synchronized editor.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    ),
  },
  {
    title: 'Review & Grow',
    description: 'Close the loop. Rate your sessions to help build a trusted community of reliable peer mentors.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    ),
  },
];

function FeaturesSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            How it works
          </h2>
          <p className="text-zinc-500 mt-2">Three steps to resolving your academic blocks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col gap-6 p-8 border-t-2 border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors duration-300">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
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
    <section className="relative py-24 px-6 border-t border-white/5 bg-[#05090f]/50">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
        <h2 className="text-4xl font-bold text-white tracking-tight">
          Ready to get started?
        </h2>
        <p className="text-zinc-400 max-w-md">
          Join the community today. Whether you need help or want to help others, your space is waiting.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-white text-[#05090f] text-sm font-bold px-8 py-3.5 rounded-full hover:bg-zinc-200 transition-colors"
        >
          Create an account
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#05090f]">
      <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          <span className="text-xs font-medium text-zinc-500 tracking-tight">
            PeerTutor
          </span>
        </div>
        <p className="text-xs text-zinc-600">
          Built for learners.
        </p>
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