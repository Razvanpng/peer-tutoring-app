import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900 tracking-tight">PeerTutor</span>
        <Link
          to="/login"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center gap-6">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-slate-400 border border-slate-200 rounded-full px-3.5 py-1">
          Peer Learning Platform
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight max-w-2xl">
          Master any subject with expert peer mentors
        </h1>
        <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl">
          Connect with senior students and subject-matter experts who can guide you through
          difficult material at your own pace, on your own schedule.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <Link
            to="/register"
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
          >
            Sign In
          </Link>
        </div>
        <p className="text-xs text-slate-400 mt-1">Free to join. No credit card required.</p>
      </div>
    </section>
  );
}

function FeatureIcon({ children }) {
  return (
    <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
      {children}
    </div>
  );
}

const FEATURES = [
  {
    title: 'Find a Mentor',
    description:
      'Browse profiles of verified peer mentors. Filter by subject, read bios, and find someone whose expertise matches your needs.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: 'Request a Session',
    description:
      'Submit a help request describing your topic and where you are stuck. Your mentor will accept and connect with you directly.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Learn Together',
    description:
      'Collaborate in a dedicated session chat. Work through problems, share resources, and leave a review when you are done.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

function FeaturesSection() {
  return (
    <section className="bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How it works
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Getting help is simple. Three steps stand between you and a clearer understanding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-3">
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <span className="text-xs font-semibold text-slate-400 tabular-nums">
                  0{index + 1}
                </span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-800">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium tracking-tight">PeerTutor</span>
        <p className="text-xs text-slate-400">
          Built for learners, by learners.
        </p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}