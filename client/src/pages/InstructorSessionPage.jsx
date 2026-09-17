import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { pulseService } from '../services/api';
import CommandPalette from '../components/CommandPalette';
import CustomPulseBuilder from '../components/CustomPulseBuilder';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { PageLoader } from '../components/ui/Spinner';

export default function InstructorSessionPage() {
  const { id: sessionId } = useParams();
  const { user } = useAuth();
  const { emit, on, connected } = useSocket();
  const toast = useToast();
  const navigate = useNavigate();

  // State
  const [sessionState, setSessionState] = useState(null);
  const [activePoll, setActivePoll] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [showPalette, setShowPalette] = useState(false);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [endingSession, setEndingSession] = useState(false);

  const timerRef = useRef(null);

  // Load templates
  useEffect(() => {
    pulseService.getTemplates().then((data) => {
      setTemplates(data.templates);
      setCategories(data.categories);
    }).catch(() => {});
  }, []);

  // Join session
  useEffect(() => {
    if (!connected || !sessionId) return;

    emit('join-session', { sessionId }, (response) => {
      if (response.success) {
        setSessionState(response.sessionState);
        setParticipantCount(response.sessionState.participantCount);
        if (response.sessionState.activePoll) {
          setActivePoll(response.sessionState.activePoll);
          setAnalytics({
            distribution: response.sessionState.activePoll.distribution,
            responseCount: response.sessionState.activePoll.responseCount,
            totalParticipants: response.sessionState.activePoll.totalParticipants,
          });
          setRemainingTime(Math.ceil(response.sessionState.activePoll.remainingTime));
        }
      } else {
        toast.error(response.message);
        navigate('/dashboard');
      }
      setLoading(false);
    });
  }, [connected, sessionId]);

  // Socket event listeners
  useEffect(() => {
    if (!connected) return;

    const unsubs = [
      on('participant-update', ({ count }) => setParticipantCount(count)),
      on('pulse-launched', (poll) => {
        setActivePoll(poll);
        setRemainingTime(poll.timer);
        setAnalytics({
          distribution: {},
          responseCount: 0,
          totalParticipants: Math.max(0, participantCount - 1),
        });
      }),
      on('analytics-update', (data) => {
        setAnalytics({
          distribution: data.distribution,
          responseCount: data.responseCount,
          totalParticipants: data.totalParticipants,
        });
      }),
      on('pulse-closed', (data) => {
        setActivePoll((prev) => prev ? { ...prev, isActive: false } : null);
        setRemainingTime(0);
        setAnalytics({
          distribution: data.distribution,
          responseCount: data.responseCount,
          totalParticipants: data.totalParticipants,
        });
      }),
      on('session-ended', () => {
        navigate(`/session/${sessionId}/report`);
      }),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [connected, on, participantCount]);

  // Client-side countdown (presentation only)
  useEffect(() => {
    if (remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activePoll?._id, remainingTime > 0 ? 1 : 0]);

  // Launch pulse handler
  const handleLaunchPulse = useCallback(
    (pulseData) => {
      emit(
        'launch-pulse',
        {
          sessionId,
          question: pulseData.question,
          responseType: pulseData.responseType,
          options: pulseData.options,
          timer: pulseData.defaultTimer || pulseData.timer || 10,
          category: pulseData.category,
          isAnonymous: pulseData.isAnonymous !== false,
        },
        (response) => {
          if (!response.success) {
            toast.error(response.message);
          }
        }
      );
      setShowPalette(false);
    },
    [emit, sessionId, toast]
  );

  // End session handler
  const handleEndSession = useCallback(() => {
    setEndingSession(true);
    emit('end-session', { sessionId }, (response) => {
      setEndingSession(false);
      setShowEndConfirm(false);
      if (response.success) {
        navigate(`/session/${sessionId}/report`);
      } else {
        toast.error(response.message);
      }
    });
  }, [emit, sessionId, navigate, toast]);

  // Keyboard shortcuts
  useKeyboardShortcuts(
    {
      q: () => setShowPalette(true),
      Q: () => setShowPalette(true),
      c: () => { setShowPalette(false); setShowCustomBuilder(true); },
      C: () => { setShowPalette(false); setShowCustomBuilder(true); },
      '?': () => setShowShortcuts((prev) => !prev),
      e: () => setShowEndConfirm(true),
      E: () => setShowEndConfirm(true),
    },
    !showPalette && !showCustomBuilder && !showEndConfirm
  );

  if (loading) return <PageLoader />;

  const totalStudents = Math.max(0, participantCount - 1);

  // Calculate percentage distribution
  const getDistributionPercentages = () => {
    if (!analytics?.distribution) return {};
    const total = analytics.responseCount || 0;
    if (total === 0) return Object.fromEntries(
      Object.keys(analytics.distribution).map((k) => [k, 0])
    );
    const percentages = {};
    for (const [key, count] of Object.entries(analytics.distribution)) {
      percentages[key] = Math.round((count / total) * 100);
    }
    return percentages;
  };

  const percentages = getDistributionPercentages();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-30">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/60">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
              </span>
              STUDIO LIVE
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-400 hidden sm:inline-block">
              {sessionState?.sessionId ? 'Real-time broadcast active' : 'Connecting...'}
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 ring-2 ring-emerald-400/20' : 'bg-rose-400'}`} />
              <span className="hidden sm:inline">{connected ? 'Socket Connected' : 'Reconnecting...'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
              <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.47 7.47 0 0114.5 16z" />
              </svg>
              <span>{totalStudents} student{totalStudents !== 1 ? 's' : ''} in room</span>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowEndConfirm(true)}
            >
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        {/* Active Pulse View */}
        {activePoll ? (
          <div className="animate-fade-in-up bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            {/* Header tags */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                  {activePoll.category || 'General'}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400">
                  {activePoll.responseType}
                </span>
              </div>
              {activePoll.isAnonymous && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                  100% Anonymous
                </span>
              )}
            </div>

            {/* Question */}
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-6 tracking-tight">
              {activePoll.question}
            </h2>

            {/* Timer & Response Velocity */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Time Window</span>
                <div className={`text-2xl font-mono font-bold mt-0.5 ${
                  remainingTime > 3 ? 'text-indigo-400' : remainingTime > 0 ? 'text-amber-400' : 'text-slate-600'
                }`}>
                  {remainingTime > 0 ? `${remainingTime}s remaining` : 'Pulse Closed'}
                </div>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Responses Received</span>
                <div className="text-2xl font-mono font-bold text-white mt-0.5">
                  {analytics?.responseCount || 0}
                  <span className="text-sm font-normal text-slate-500"> / {analytics?.totalParticipants || totalStudents}</span>
                </div>
              </div>
            </div>

            {/* Response Distribution Bars */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Aggregation</span>
              {Object.entries(analytics?.distribution || {}).map(([label, count]) => {
                const pct = percentages[label] || 0;
                return (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-300">
                        {activePoll.responseType === 'rating' ? `Rating ${label} ★` : label}
                      </span>
                      <span className="text-slate-400 font-mono">{pct}% ({count} vote{count !== 1 ? 's' : ''})</span>
                    </div>
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick action bar */}
            <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
              <Button size="sm" onClick={() => setShowPalette(true)}>
                New Quick Pulse (Q)
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowCustomBuilder(true)} className="text-slate-400 hover:text-white">
                Custom Question (C)
              </Button>
            </div>
          </div>
        ) : (
          /* Ready state */
          <div className="text-center animate-fade-in py-12 px-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center mx-auto mb-5 text-indigo-400 shadow-lg shadow-indigo-950/50">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Live Session Active</h2>
            <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
              Ask quick pulse checks during lectures to immediately verify student comprehension without breaking presentation flow.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <Button
                onClick={() => setShowPalette(true)}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
              >
                Launch Quick Pulse <kbd className="ml-2 px-1.5 py-0.5 text-xs font-mono bg-indigo-700 rounded">Q</kbd>
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowCustomBuilder(true)}
                size="lg"
                className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                Create Custom <kbd className="ml-2 px-1.5 py-0.5 text-xs font-mono bg-slate-800 rounded">C</kbd>
              </Button>
            </div>

            {/* Fast Launch Suggested Checks */}
            {templates && templates.length > 0 && (
              <div className="max-w-lg mx-auto text-left">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block mb-2 text-center">
                  Instant One-Click Starters
                </span>
                <div className="grid gap-2">
                  {templates.slice(0, 3).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleLaunchPulse(t)}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900 transition-all text-left flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-400 group-hover:text-indigo-400">
                          ⚡
                        </span>
                        <span className="text-xs sm:text-sm text-slate-300 group-hover:text-white font-medium">
                          {t.question}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                        {t.responseType}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Dock */}
      <div className="border-t border-slate-900 bg-slate-950/90 px-4 py-2 text-center">
        <div className="max-w-xl mx-auto flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
          <span><kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-400 font-mono">Q</kbd> Quick Palette</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-400 font-mono">1–9</kbd> Fast Select</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-400 font-mono">C</kbd> Custom Poll</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-400 font-mono">E</kbd> End Session</span>
          <button onClick={() => setShowShortcuts(true)} className="text-slate-400 hover:text-indigo-400 underline cursor-pointer">
            All Shortcuts (?)
          </button>
        </div>
      </div>

      {/* Keyboard shortcuts overlay */}
      {showShortcuts && (
        <div className="fixed inset-0 z-40 flex items-center justify-center" onClick={() => setShowShortcuts(false)}>
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" />
          <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-xs animate-scale-in">
            <h3 className="font-semibold text-white mb-4 text-sm tracking-tight">Studio Keyboard Shortcuts</h3>
            <div className="space-y-2 text-xs">
              {[
                ['Q', 'Open Quick Pulse'],
                ['1–9', 'Select pulse option'],
                ['Enter', 'Launch selected'],
                ['C', 'Build custom pulse'],
                ['E', 'End live session'],
                ['?', 'Toggle shortcuts guide'],
                ['Esc', 'Close modal/palette'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center gap-3">
                  <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300 min-w-[36px] text-center">
                    {key}
                  </kbd>
                  <span className="text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette
        isOpen={showPalette}
        onClose={() => setShowPalette(false)}
        templates={templates}
        categories={categories}
        onSelectTemplate={handleLaunchPulse}
        onCreateCustom={() => {
          setShowPalette(false);
          setShowCustomBuilder(true);
        }}
      />

      {/* Custom Pulse Builder */}
      <CustomPulseBuilder
        isOpen={showCustomBuilder}
        onClose={() => setShowCustomBuilder(false)}
        onLaunch={handleLaunchPulse}
      />

      {/* End Session Confirm */}
      <ConfirmDialog
        isOpen={showEndConfirm}
        onClose={() => setShowEndConfirm(false)}
        onConfirm={handleEndSession}
        title="End Session?"
        message="This will close the live session for all participants. Active pulses will be closed."
        confirmLabel="End Session"
        loading={endingSession}
      />
    </div>
  );
}
