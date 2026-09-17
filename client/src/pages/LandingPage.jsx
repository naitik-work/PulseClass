import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant 200ms Reflex',
    description: 'Ask a question and get anonymous responses from the entire room in seconds. No waiting around.',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400',
  },
  {
    icon: '📚',
    title: 'Curated Pulse Library',
    description: '15+ pre-built pedagogical checks like "Should I move ahead?" ready to fire with a single keypress.',
    color: 'from-indigo-500/20 to-blue-500/20 text-indigo-600 dark:text-indigo-400',
  },
  {
    icon: '🔒',
    title: '100% Anonymous Voting',
    description: 'Students answer honestly. Instructors see real-time aggregate charts, never individual student identities.',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: '📊',
    title: 'Live Streaming Analytics',
    description: 'Watch bar charts animate in real-time with participation percentage and response velocity trackers.',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400',
  },
  {
    icon: '⌨️',
    title: 'Keyboard-First Velocity',
    description: 'Press Q to trigger the Quick Pulse palette, select a question with 1-9, hit Enter. Zero mouse clicks.',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-600 dark:text-cyan-400',
  },
  {
    icon: '📱',
    title: 'Frictionless Mobile Vote',
    description: 'No apps or extensions needed. Students join on phone or laptop, tap their choice, and return to focus.',
    color: 'from-rose-500/20 to-red-500/20 text-rose-600 dark:text-rose-400',
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
  const [openFaq, setOpenFaq] = useState(0);

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
    <div className="bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white theme-transition">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-slate-50/50 dark:bg-[#0c1220]/60 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 ring-2 ring-indigo-600/20" />
            <span>Instant Classroom Engagement for Higher-Ed & Bootcamps</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-5 max-w-4xl mx-auto">
            Know what your classroom is thinking,{' '}
            <span className="text-indigo-600 dark:text-indigo-400">in real time.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Ask check-in questions and collect 100% anonymous feedback from your entire room in under 10 seconds.
            Zero awkward silences. No app downloads. Keyboard-first.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
                <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Explore Workflow
              </Button>
            </a>
          </div>

          {/* Interactive Hero Demo Preview */}
          <div className="max-w-xl mx-auto text-left">
            <div className="rounded-2xl bg-[#0f172a] dark:bg-[#111827] p-5 sm:p-7 border border-slate-800 shadow-2xl relative overflow-hidden">
              {/* Window header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">CS101 · Interactive Live Studio</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/60 text-rose-300 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  LIVE DEMO
                </div>
              </div>

              {/* Pulse Content */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
                  <span className="uppercase tracking-wider text-indigo-400 font-semibold text-[10px]">💡 Comprehension Check</span>
                  <span className="font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded text-[11px]">8s window</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 tracking-tight">
                  Should I move ahead to Raft consensus algorithms?
                </h3>
                <p className="text-xs text-slate-400">Vote below to see real-time streaming aggregation:</p>
              </div>

              {/* Vote Buttons (Interactive Demo) */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <button
                  onClick={() => handleDemoVote('Yes')}
                  className={`py-2.5 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    demoAnswer === 'Yes'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>Yes (Move ahead)</span>
                  <span className="font-mono opacity-80">({demoVotes.Yes})</span>
                </button>
                <button
                  onClick={() => handleDemoVote('No')}
                  className={`py-2.5 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    demoAnswer === 'No'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>Need Recap</span>
                  <span className="font-mono opacity-80">({demoVotes.No})</span>
                </button>
              </div>

              {/* Live Distribution Bars */}
              <div className="space-y-2.5 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1 font-semibold">
                    <span>Yes (Ready to advance)</span>
                    <span className="font-mono text-emerald-400">{yesPct}% ({demoVotes.Yes})</span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${yesPct}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1 font-semibold">
                    <span>No (Spend 5 mins recapping)</span>
                    <span className="font-mono text-slate-400">{noPct}% ({demoVotes.No})</span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-600 rounded-full transition-all duration-300"
                      style={{ width: `${noPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-4 pt-2.5 border-t border-slate-800/80 font-medium">
                <span>{totalVotes} total responses collected</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                  100% Anonymous
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white dark:bg-[#090d16] border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
            The Silent Classroom Dilemma
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto mb-12">
            Asking <i>"Does everyone understand?"</i> consistently produces dead silence.
            Unsure students hesitate to raise hands, instructors lose situational awareness, and classes move ahead disconnected.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 text-left">
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-sm mb-4">
                ✕
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Traditional Polling & Asking</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Awkward 15-second silences. Only the top 2 confident students speak. Third-party polling apps take 4 minutes to share QR codes, fragmenting lecture focus.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold text-sm mb-4">
                ✓
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 tracking-tight">With PulseClass Reflex</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tap <b>Q</b> on keyboard → hit Enter → 100% of the room responds in 8 seconds. Safe anonymous answers let instructors pace lectures with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-[#090d16]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-3">
              Frictionless Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Designed for Velocity
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto mt-2">
              Teaching flow is sacred. PulseClass takes less than 10 seconds from thought to aggregate answer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-none hover:shadow-md dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">{item.step}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-indigo-600 text-white font-mono text-xs font-bold shadow-sm">
                      {item.key}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 dark:bg-[#0c1220]/70 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Engineered for Modern Classrooms
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto mt-2">
              Every detail is calibrated to eliminate latency, friction, and anxiety.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-none hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:-translate-y-1 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-white dark:bg-[#090d16]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Wherever People Learn Together
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto mt-2">
              From coding bootcamps to medical amphitheaters.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {USE_CASES.map((uc) => (
              <div
                key={uc.title}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#111827]/70 hover:bg-white dark:hover:bg-[#111827] hover:shadow-md transition-all flex items-start gap-4"
              >
                <span className="text-3xl shrink-0 p-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-100 dark:border-slate-700">{uc.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{uc.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{uc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ with Interactive Accordion */}
      <section className="py-24 bg-slate-50 dark:bg-[#0c1220]/70 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base max-w-md mx-auto mt-2">
              Everything you need to know about anonymous real-time pulses.
            </p>
          </div>

          <div className="space-y-3.5">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-white dark:bg-[#111827] border-indigo-300 dark:border-indigo-500/60 shadow-sm'
                      : 'bg-white/80 dark:bg-[#111827]/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none"
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                      {item.q}
                    </h3>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'rotate-180 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3 animate-fade-in">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 bg-white dark:bg-[#090d16]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 text-white p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl border border-slate-800/80">
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
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-10 bg-slate-50 dark:bg-[#090d16] text-slate-500 dark:text-slate-400 text-xs transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              P
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">PulseClass</span>
            <span>— Real-Time Classroom Engagement</span>
          </div>
          <p>© {new Date().getFullYear()} PulseClass. Built for high-velocity educators.</p>
        </div>
      </footer>
    </div>
  );
}
