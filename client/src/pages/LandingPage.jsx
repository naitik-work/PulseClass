import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant 200ms Reflex',
    description: 'Ask a question and get anonymous responses from the entire room in seconds. No waiting around.',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-600',
  },
  {
    icon: '📚',
    title: 'Curated Pulse Library',
    description: '15+ pre-built pedagogical checks like "Should I move ahead?" ready to fire with a single keypress.',
    color: 'from-indigo-500/20 to-blue-500/20 text-indigo-600',
  },
  {
    icon: '🔒',
    title: '100% Anonymous Voting',
    description: 'Students answer honestly. Instructors see real-time aggregate charts, never individual student identities.',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-600',
  },
  {
    icon: '📊',
    title: 'Live Streaming Analytics',
    description: 'Watch bar charts animate in real-time with participation percentage and response velocity trackers.',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-600',
  },
  {
    icon: '⌨️',
    title: 'Keyboard-First Velocity',
    description: 'Press Q to trigger the Quick Pulse palette, select a question with 1-9, hit Enter. Zero mouse clicks.',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-600',
  },
  {
    icon: '📱',
    title: 'Frictionless Mobile Vote',
    description: 'No apps or extensions needed. Students join on phone or laptop, tap their choice, and return to focus.',
    color: 'from-rose-500/20 to-red-500/20 text-rose-600',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    key: 'Q',
    title: 'Tap "Q"',
    description: 'Press Q on your keyboard to instantly open the Quick Pulse command palette.',
  },
  {
    step: '02',
    key: '1-9',
    title: 'Pick a Question',
    description: 'Select from 15+ curated templates or tap C to create a custom poll.',
  },
  {
    step: '03',
    key: '↵',
    title: 'Press Enter',
    description: 'The question appears simultaneously on all student screens within 200ms.',
  },
  {
    step: '04',
    key: '📊',
    title: 'See Live Results',
    description: 'Watch anonymous responses stream into aggregate distribution bars.',
  },
];

const USE_CASES = [
  { icon: '🏫', title: 'Universities & Colleges', desc: 'Engage 200+ students in large lecture halls without awkward silence.' },
  { icon: '💻', title: 'Coding Bootcamps', desc: 'Continuous pace check during complex live coding and debugging modules.' },
  { icon: '🏢', title: 'Corporate Training', desc: 'Gauge real-time comprehension during technical workshops and onboarding.' },
  { icon: '📖', title: 'Coaching Institutes', desc: 'Fast revision checks between topics to make sure no student falls behind.' },
  { icon: '🎤', title: 'Keynotes & Seminars', desc: 'Instant audience polling without clunky browser tab switching.' },
  { icon: '🔬', title: 'STEM Laboratories', desc: 'Quick check-ins on lab procedures and experimental findings.' },
];

const FAQ_ITEMS = [
  {
    q: 'How does PulseClass keep student responses anonymous?',
    a: 'Student user IDs are only used on the server for duplicate prevention (ensuring one vote per person). The instructor view only receives statistical aggregations (e.g. 78% Yes, 22% No) without any personal identifiers.',
  },
  {
    q: 'Do students need to install an app or extension?',
    a: 'No. PulseClass is 100% browser-based. Students can join from any phone, tablet, or laptop using the classroom link or institute code.',
  },
  {
    q: 'How fast is the real-time polling?',
    a: 'PulseClass uses persistent WebSockets powered by Socket.io. Pulse broadcast and response streaming typical latency is under 150 milliseconds.',
  },
  {
    q: 'Can instructors launch custom questions?',
    a: 'Yes. In addition to the 17 pre-built templates, you can press "C" to launch single-choice, rating (1-5), or custom binary questions with configurable timers (3s to 30s).',
  },
  {
    q: 'Is there session history and analytics?',
    a: 'Yes. Every session automatically saves an executive summary report with pulse-by-pulse distributions, participation rates, and duration data.',
  },
];

export default function LandingPage() {
  const [demoAnswer, setDemoAnswer] = useState('Yes');
  const [demoVotes, setDemoVotes] = useState({ Yes: 42, No: 8 });

  const handleDemoVote = (choice) => {
    if (demoAnswer === choice) return;
    setDemoAnswer(choice);
    setDemoVotes((prev) => ({
      ...prev,
      [choice]: prev[choice] + 1,
      [choice === 'Yes' ? 'No' : 'Yes']: Math.max(0, prev[choice === 'Yes' ? 'No' : 'Yes'] - 1),
    }));
  };

  const totalVotes = demoVotes.Yes + demoVotes.No;
  const yesPct = Math.round((demoVotes.Yes / totalVotes) * 100);
  const noPct = 100 - yesPct;

  return (
    <div className="bg-white text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(99,102,241,0.12),rgba(255,255,255,0))]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs sm:text-sm font-semibold mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-indigo-600 -ml-4" />
            <span>Instant Classroom Engagement Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.1] mb-6">
            Know what your room
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              is really thinking.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Ask instant questions and receive 100% anonymous feedback from your entire lecture hall in under 10 seconds.
            Zero awkward silences. No app downloads. Keyboard-first.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="xl" className="w-full sm:w-auto shadow-xl shadow-indigo-600/30">
                Start a Session Free →
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </a>
          </div>

          {/* Interactive Hero Demo Preview */}
          <div className="max-w-xl mx-auto">
            <div className="rounded-3xl p-1 bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-slate-900 shadow-2xl">
              <div className="bg-slate-950 rounded-[22px] p-6 sm:p-8 text-left border border-slate-800/80 shadow-2xl relative overflow-hidden">
                {/* Window header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-xs font-mono text-slate-400">CS101 · Live Session</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE PULSE
                  </div>
                </div>

                {/* Pulse Content */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                    <span className="uppercase tracking-wider text-indigo-400 font-semibold">💡 Understanding Check</span>
                    <span className="font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">⏱️ 8s remaining</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Should I move ahead to Raft consensus?
                  </h3>
                  <p className="text-xs text-slate-400">Try voting below to see real-time distribution update:</p>
                </div>

                {/* Vote Buttons (Interactive Demo) */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => handleDemoVote('Yes')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      demoAnswer === 'Yes'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-[1.02]'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>👍 Yes</span>
                    <span className="text-xs opacity-75 font-mono">({demoVotes.Yes})</span>
                  </button>
                  <button
                    onClick={() => handleDemoVote('No')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      demoAnswer === 'No'
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-[1.02]'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>✋ Need Recap</span>
                    <span className="text-xs opacity-75 font-mono">({demoVotes.No})</span>
                  </button>
                </div>

                {/* Live Distribution Bars */}
                <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/60">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1 font-semibold">
                      <span>Yes (Move ahead)</span>
                      <span>{yesPct}% ({demoVotes.Yes})</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${yesPct}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1 font-semibold">
                      <span>No (Need recap)</span>
                      <span>{noPct}% ({demoVotes.No})</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-600 rounded-full transition-all duration-500"
                        style={{ width: `${noPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-800/80 font-medium">
                  <span>👥 {totalVotes} student responses</span>
                  <span>🔒 100% Anonymous to Instructor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 mb-4 tracking-tight">
            The Silent Classroom Problem
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-12">
            Asking <i>"Does everyone understand?"</i> reliably produces dead silence.
            Hesitant students stay quiet, instructors lose situational awareness, and lectures move ahead disconnected.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 text-left">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-rose-100 shadow-sm relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl mb-4">
                ❌
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Without PulseClass</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Awkward 15-second silences. Only 2 confident students speak up. Confused students fall behind. Polling tools require 5 tabs, sharing QR codes, and take 4 minutes to set up.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-indigo-100 shadow-sm relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mb-4">
                ✅
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">With PulseClass</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Press <b>Q</b> on keyboard → hit Enter → 100% of the room votes in 8 seconds. Safe, anonymous answers let teachers adjust pacing in real time without breaking momentum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
              Frictionless Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Designed for Velocity
            </h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto mt-2">
              Teaching flow is sacred. PulseClass takes less than 10 seconds from thought to aggregate answer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400">{item.step}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold shadow-sm">
                      {item.key}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Engineered for Modern Classrooms
            </h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto mt-2">
              Every detail is calibrated to eliminate latency, friction, and anxiety.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Wherever People Learn Together
            </h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto mt-2">
              From coding bootcamps to medical amphitheaters.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {USE_CASES.map((uc) => (
              <div
                key={uc.title}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex items-start gap-4"
              >
                <span className="text-3xl shrink-0 p-1.5 bg-white rounded-xl shadow-xs border border-slate-100">{uc.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{uc.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{uc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-base max-w-md mx-auto mt-2">
              Everything you need to know about anonymous real-time pulses.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.q}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm"
              >
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 text-white p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
                Transform Your Classroom in 60 Seconds
              </h2>
              <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                Create a free account, start a session, press Q, and never teach to an unresponsive room again.
              </p>
              <Link to="/signup">
                <Button size="xl" className="shadow-xl shadow-indigo-500/30">
                  Get Started — Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-10 bg-slate-50 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              P
            </div>
            <span className="font-bold text-slate-900 text-sm">PulseClass</span>
            <span>— Real-Time Classroom Engagement</span>
          </div>
          <p>© {new Date().getFullYear()} PulseClass. Built for high-velocity educators.</p>
        </div>
      </footer>
    </div>
  );
}
