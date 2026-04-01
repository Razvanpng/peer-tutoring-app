import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/70 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-5 h-13 flex items-center justify-between" style={{ height: '52px' }}>
        <span className="text-sm font-semibold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          PeerTutor
        </span>
        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium text-zinc-900 bg-zinc-100 hover:bg-white px-3.5 py-1.5 rounded-lg transition-all duration-200"
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
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[700px] h-[700px] rounded-full bg-violet-600/10 blur-[120px] animate-glow-pulse" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/8 blur-[80px]"
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] rounded-full px-4 py-1.5 text-xs text-zinc-400 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Now in open beta — free to join
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-50 tracking-tight leading-[1.05]">
          Master any subject
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            with peer mentors
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl">
          Connect with senior students and subject experts who guide you through
          difficult material at your own pace — live, collaborative, and human.
        </p>

        <div className="flex items-center justify-center gap-4 mt-2">
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.35)] hover:shadow-[0_0_30px_rgba(124,58,237,0.55)] hover:-translate-y-0.5"
          >
            Get Started Free
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to="/login"
            className="text-sm text-zinc-400 hover:text-zinc-100 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] px-6 py-2.5 rounded-xl transition-all duration-300"
          >
            Sign In
          </Link>
        </div>

        <p className="text-xs text-zinc-600">No credit card required · Cancel anytime</p>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent"
      />
    </section>
  );
}

const FEATURES = [
  {
    title: 'Find your mentor',
    description:
      'Browse verified mentors filtered by subject. Read their bios, view their ratings, and send a direct session request in seconds.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    title: 'Request a session',
    description:
      'Describe your topic and exactly where you\'re stuck. Your mentor accepts and you connect in a dedicated live workspace.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Learn together',
    description:
      'Chat in real-time, share code in a collaborative editor, attach files, and close the loop with a review when you\'re done.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

function FeaturesSection() {
  return (
    <section className="relative py-28 px-5">
      <div className="max-w-5xl mx-auto space-y-14">
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold tracking-widest uppercase text-violet-400">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 tracking-tight">
            Three steps to clarity
          </h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            Getting expert help is simple. No scheduling apps, no back-and-forth emails.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative flex flex-col gap-4 bg-zinc-900/30 border border-white/[0.05] hover:border-white/[0.12] hover:bg-zinc-900/50 rounded-2xl p-6 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/15 transition-colors duration-300">
                  {feature.icon}
                </div>
                <span className="text-xs font-mono font-semibold text-zinc-700">
                  0{index + 1}
                </span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">{feature.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{feature.description}</p>
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
    <section className="relative py-24 px-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[500px] h-[300px] bg-violet-600/8 blur-[80px] rounded-full" />
      </div>

      <div className="relative max-w-2xl mx-auto text-center space-y-6 border border-white/[0.06] bg-zinc-900/20 backdrop-blur-sm rounded-3xl p-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 tracking-tight">
          Ready to stop being stuck?
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
          Join learners who are already connecting with peer mentors to move faster and understand deeper.
        </p>
        <Link
          to="/register"
          className="group inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-7 py-3 rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(124,58,237,0.35)] hover:shadow-[0_0_40px_rgba(124,58,237,0.55)] hover:-translate-y-0.5"
        >
          Create a free account
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-5 py-6 flex items-center justify-between">
        <span className="text-xs font-medium tracking-tight bg-gradient-to-r from-zinc-300 to-zinc-600 bg-clip-text text-transparent">
          PeerTutor
        </span>
        <p className="text-xs text-zinc-700">
          Built for learners, by learners.
        </p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-13">
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}