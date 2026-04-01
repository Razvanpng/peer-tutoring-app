import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05090f]/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tighter bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          PeerTutor
        </span>
        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="group text-sm font-medium text-black bg-zinc-50 hover:bg-white px-5 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            Get Started <span className="text-black/50 group-hover:pl-1 transition-all pr-0.5">→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-left px-6 overflow-hidden">
      {/* Glow-ul vizual: Scăpăm de centrare, îl mutăm în dreapta-sus */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full bg-teal-600/10 blur-[130px] animate-glow-pulse"
      />
      
      {/* Layout asimetric: Mielești textul în stânga, lași spațiu în dreapta */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 w-full max-w-6xl">
        <div className="lg:col-span-8 flex flex-col gap-6 items-start">
          <div className="inline-flex items-center gap-2.5 border border-white/10 bg-white/[0.03] rounded-full px-5 py-2 text-xs text-zinc-400 backdrop-blur-sm shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Now in open beta — free to join
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-zinc-50 tracking-tighter leading-[0.98]">
            Clarity comes
            <br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              one-to-one
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-500 leading-relaxed max-w-xl">
            Skip the generic advice. Connect with mentors who understand your specific material and guide you through difficulties — live, collaborative, and human.
          </p>

          <div className="flex items-center gap-3.5 mt-2">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-8 py-3 rounded-2xl transition-all duration-300 shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.35)] hover:-translate-y-1"
            >
              Get Started Free
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/login"
              className="text-sm text-zinc-400 hover:text-zinc-100 border border-white/5 hover:border-white/10 bg-white/[0.02] px-8 py-3 rounded-2xl transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        {/* Dreapta asimetrică goală pentru "spațiu negativ", vital pentru look uman */}
        <div className="lg:col-span-4" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05090f] to-transparent"
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
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    title: 'Request a session',
    description:
      "Describe your topic and exactly where you're stuck. Your mentor accepts and you connect in a dedicated live workspace.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Learn together',
    description:
      "Chat in real-time, share code in a collaborative editor, attach files, and close the loop with a review when you're done.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

function FeaturesSection() {
  return (
    <section className="relative py-28 px-6 bg-zinc-950 bg-opacity-40">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-teal-400">
              How it works
            </p>
            <h2 className="text-4xl font-bold text-zinc-50 tracking-tighter max-w-xl leading-[1.02]">
              Getting help should be simpler than the actual subject. It is.
            </h2>
          </div>
          <div className="lg:col-span-4 text-left lg:text-right">
             <p className="text-sm text-zinc-600 max-w-xs ml-auto leading-relaxed">
               No complicated scheduling apps, no endless back-and-forth emails. Three steps to clarity.
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative flex flex-col gap-5 border border-white/5 bg-white/[0.01] hover:border-teal-500/20 hover:bg-teal-950/20 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-teal-500/10 group-hover:border-teal-500/20 group-hover:text-teal-400 transition-colors duration-300">
                  {feature.icon}
                </div>
                <span className="text-xs font-mono font-semibold text-zinc-700">
                  0{index + 1}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-zinc-100 tracking-tight">{feature.title}</h3>
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
    <section className="relative py-28 px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-600/5 blur-[90px] rounded-full"
      />

      <div className="relative max-w-3xl mx-auto text-center space-y-8 border border-white/5 bg-black/10 backdrop-blur-sm rounded-3xl p-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-zinc-50 tracking-tighter leading-[1.02]">
          Ready to stop being stuck?
        </h2>
        <p className="text-base text-zinc-400 leading-relaxed max-w-md mx-auto">
          Join learners who are already connecting with peer mentors to move faster and understand deeper.
        </p>
        <Link
          to="/register"
          className="group inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-9 py-3.5 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.4)] hover:-translate-y-1"
        >
          Create a free account <span className="text-white/70">→</span>
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <span className="text-xs font-medium tracking-tight bg-gradient-to-r from-zinc-300 to-zinc-600 bg-clip-text text-transparent">
          PeerTutor
        </span>
        <p className="text-xs text-zinc-700">
          Built by learners, for learners. © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#05090f] bg-grain flex flex-col">
      <Navbar />
      <main className="flex-1 pt-14">
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}