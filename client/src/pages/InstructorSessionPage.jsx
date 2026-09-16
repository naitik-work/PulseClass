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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Bar */}
      <div className="border-b border-gray-800 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Badge variant="live">🔴 LIVE</Badge>
            <span className="text-sm font-medium text-gray-300">
              {sessionState?.sessionId ? 'Session Active' : 'Session'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {connected ? 'Connected' : 'Reconnecting...'}
            </div>
            <div className="text-sm text-gray-400">
              👥 {totalStudents} student{totalStudents !== 1 ? 's' : ''}
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

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Active Pulse */}
        {activePoll ? (
          <div className="animate-fade-in-up">
            {/* Question */}
            <div className="text-center mb-8">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                {activePoll.category || 'Pulse'} · {activePoll.responseType}
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
                {activePoll.question}
              </h2>
              {activePoll.isAnonymous && (
                <p className="text-xs text-gray-500 mt-2">Anonymous responses</p>
              )}
            </div>

            {/* Timer */}
            <div className="flex justify-center mb-8">
              <div className={`text-4xl font-mono font-bold ${
                remainingTime > 0 ? 'text-indigo-400' : 'text-gray-600'
              }`}>
                {remainingTime > 0 ? `${remainingTime}s` : 'Closed'}
              </div>
            </div>

            {/* Response count */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-400">
                <span className="text-2xl font-bold text-white">
                  {analytics?.responseCount || 0}
                </span>
                {' / '}
                {analytics?.totalParticipants || totalStudents} responses
              </p>
              {totalStudents > 0 && (
                <div className="w-48 h-1.5 bg-gray-800 rounded-full mx-auto mt-2">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((analytics?.responseCount || 0) / Math.max(1, totalStudents)) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Distribution */}
            <div className="space-y-3 max-w-md mx-auto">
              {Object.entries(analytics?.distribution || {}).map(([label, count]) => {
                const pct = percentages[label] || 0;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-16 text-right font-medium">
                      {activePoll.responseType === 'rating' ? `${label} ★` : label}
                    </span>
                    <div className="flex-1 h-8 bg-gray-800 rounded-lg overflow-hidden relative">
                      <div
                        className="h-full bg-indigo-500/80 rounded-lg transition-all duration-500 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                      {pct > 0 && (
                        <span className="absolute inset-y-0 right-2 flex items-center text-xs text-gray-300 font-medium">
                          {pct}%
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* No active pulse — ready state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">You're ready.</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm">
              Launch a pulse when you want to check the room. Press{' '}
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs font-mono text-gray-400">
                Q
              </kbd>{' '}
              to open Quick Pulse.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowPalette(true)}
                size="lg"
              >
                Quick Pulse
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowCustomBuilder(true)}
                size="lg"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Custom Pulse
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts overlay */}
      {showShortcuts && (
        <div className="fixed inset-0 z-40 flex items-center justify-center" onClick={() => setShowShortcuts(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-xs animate-scale-in">
            <h3 className="font-semibold text-white mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-2 text-sm">
              {[
                ['Q', 'Open Quick Pulse'],
                ['1–9', 'Select pulse'],
                ['Enter', 'Launch selected'],
                ['C', 'Custom pulse'],
                ['E', 'End session'],
                ['?', 'Toggle shortcuts'],
                ['Esc', 'Close'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center gap-3">
                  <kbd className="px-2 py-0.5 bg-gray-800 rounded text-xs font-mono text-gray-400 min-w-[36px] text-center">
                    {key}
                  </kbd>
                  <span className="text-gray-400">{desc}</span>
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
