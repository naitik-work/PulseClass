import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant Feedback',
    description: 'Ask a question and get anonymous responses from the entire room in seconds.',
  },
  {
    icon: '📚',
    title: 'Quick Pulse Library',
    description: 'Pre-built questions like "Should I move ahead?" ready to launch with one keystroke.',
  },
  {
    icon: '🔒',
    title: 'Anonymous Responses',
    description: 'Students answer honestly. The instructor only sees aggregate results, never individual names.',
  },
  {
    icon: '📊',
    title: 'Live Analytics',
    description: 'Watch responses flow in real-time with visual distribution bars and participation rates.',
  },
  {
    icon: '⌨️',
    title: 'Keyboard-First',
    description: 'Press Q to open the pulse launcher, pick a question, hit Enter. Done. No clicking around.',
  },
  {
    icon: '📱',
    title: 'Mobile-Optimized',
    description: 'Students answer with one tap on their phone. See question → tap answer → done.',
  },
];

const HOW_IT_WORKS = [
  { step: '1', title: 'Press Q', description: 'Open the Quick Pulse command palette' },
  { step: '2', title: 'Pick a Question', description: 'Choose from the FAQ library or create your own' },
  { step: '3', title: 'Press Enter', description: 'Question appears on every student\'s screen' },
  { step: '4', title: 'See Results', description: 'Watch anonymous responses stream in real-time' },
];

const USE_CASES = [
  { icon: '🏫', title: 'Schools', description: 'Check comprehension during lectures' },
  { icon: '🎓', title: 'Universities', description: 'Engage large lecture halls' },
  { icon: '💻', title: 'Coding Bootcamps', description: 'Pace check during live coding sessions' },
  { icon: '🏢', title: 'Corporate Training', description: 'Real-time feedback during workshops' },
  { icon: '📖', title: 'Coaching Institutes', description: 'Quick revision checks between topics' },
  { icon: '🎤', title: 'Workshops', description: 'Audience engagement for any live session' },
];

const FAQ_ITEMS = [
  {
    q: 'Is PulseClass free?',
    a: 'PulseClass is currently free to use during the early access period.',
  },
  {
    q: 'How do students join?',
    a: 'Students sign up, enter the institute join code, and join classrooms. When a session is live, they can join instantly.',
  },
  {
    q: 'Are responses really anonymous?',
    a: 'Yes. The instructor only sees aggregate results (e.g., 74% Yes, 26% No). Individual student responses are never shown to the instructor.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes. The student interface is optimized for mobile — see a question, tap an answer, done.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. PulseClass is a web application. No downloads or plugins required.',
  },
];

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            Real-time classroom engagement
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Know what your room
            <br />
            <span className="text-indigo-500">is thinking.</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Ask instant questions and receive anonymous, real-time feedback from your entire classroom.
            PulseClass makes interaction feel effortless — for teachers and students.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="xl">Start a Session</Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="secondary" size="xl">
                See How It Works
              </Button>
            </a>
          </div>

          {/* Demo visual */}
          <div className="mt-16 max-w-lg mx-auto">
            <div className="bg-gray-950 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-400 mb-3">Quick Pulse</p>
                <p className="text-white text-lg font-medium mb-6">Should I move ahead?</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-8">Yes</span>
                    <div className="flex-1 h-6 bg-gray-800 rounded overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded" style={{ width: '84%' }} />
                    </div>
                    <span className="text-sm text-gray-400 w-10">84%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-8">No</span>
                    <div className="flex-1 h-6 bg-gray-800 rounded overflow-hidden">
                      <div className="h-full bg-gray-600 rounded" style={{ width: '16%' }} />
                    </div>
                    <span className="text-sm text-gray-400 w-10">16%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-4">42 / 50 responses · Anonymous</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            The silent classroom problem
          </h2>
          <p className="text-gray-500 leading-relaxed">
            "Does everyone understand?" leads to silence. Students don't want to speak up.
            Instructors can't tell if the room is lost or bored. Teaching continues without feedback.
            PulseClass gives every student a voice — anonymously, instantly, without interrupting the flow.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            How PulseClass works
          </h2>
          <div className="grid sm:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            Built for the classroom
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            For every teaching environment
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {USE_CASES.map((uc) => (
              <div key={uc.title} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100">
                <span className="text-2xl">{uc.icon}</span>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{uc.title}</h3>
                  <p className="text-xs text-gray-500">{uc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-medium text-gray-900 mb-1">{item.q}</h3>
                <p className="text-sm text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Start engaging your classroom today.
          </h2>
          <p className="text-gray-500 mb-8">
            Set up in minutes. No credit card required.
          </p>
          <Link to="/signup">
            <Button size="xl">Get Started — Free</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-sm font-medium text-gray-700">PulseClass</span>
          </div>
          <p className="text-xs text-gray-400">
            Real-time classroom engagement.
          </p>
        </div>
      </footer>
    </div>
  );
}
