import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import { PageLoader } from '../components/ui/Spinner';

export default function StudentSessionPage() {
  const { id: sessionId } = useParams();
  const { emit, on, connected } = useSocket();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activePoll, setActivePoll] = useState(null);
  const [hasResponded, setHasResponded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [participantCount, setParticipantCount] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);

  const timerRef = useRef(null);

  // Join session
  useEffect(() => {
    if (!connected || !sessionId) return;

    emit('join-session', { sessionId }, (response) => {
      if (response.success) {
        setParticipantCount(response.sessionState.participantCount);
        if (response.sessionState.activePoll) {
          setActivePoll(response.sessionState.activePoll);
          setHasResponded(response.sessionState.hasResponded);
          setRemainingTime(Math.ceil(response.sessionState.activePoll.remainingTime));
        }
      } else {
        toast.error(response.message);
        navigate('/dashboard');
      }
      setLoading(false);
    });
  }, [connected, sessionId]);

  // Socket events
  useEffect(() => {
    if (!connected) return;

    const unsubs = [
      on('participant-update', ({ count }) => setParticipantCount(count)),
      on('pulse-launched', (poll) => {
        setActivePoll(poll);
        setHasResponded(false);
        setRemainingTime(poll.timer);
      }),
      on('pulse-closed', () => {
        setActivePoll((prev) => prev ? { ...prev, isActive: false } : null);
        setRemainingTime(0);
      }),
      on('response-submitted', () => {
        setHasResponded(true);
        setSubmitting(false);
      }),
      on('response-error', ({ message }) => {
        toast.error(message);
        setSubmitting(false);
      }),
      on('session-ended', () => {
        setSessionEnded(true);
      }),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [connected, on]);

  // Timer countdown (presentation only)
  useEffect(() => {
    clearInterval(timerRef.current);
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

  const handleSubmitResponse = (answer) => {
    if (submitting || hasResponded || remainingTime <= 0) return;
    setSubmitting(true);

    emit('submit-response', { pollId: activePoll._id, answer }, (response) => {
      if (!response?.success) {
        toast.error(response?.message || 'Failed to submit response');
        setSubmitting(false);
      }
    });
  };

  if (loading) return <PageLoader />;

  // Session ended
  if (sessionEnded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
        <div className="text-center animate-fade-in-up max-w-sm w-full bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">Session Ended</h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            The instructor has concluded this live classroom session. All anonymous responses have been recorded.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Active pulse - responded
  if (activePoll && hasResponded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
        <div className="text-center animate-fade-in-up max-w-sm w-full bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">Response Submitted</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
            Your answer is 100% anonymous and has been aggregated in real-time.
          </p>
          {remainingTime > 0 ? (
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500 font-medium">
              Waiting for remaining answers · <span className="font-mono text-indigo-600 font-semibold">{remainingTime}s remaining</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400">Pulse window closed. Ready for next check.</div>
          )}
        </div>
      </div>
    );
  }

  // Active pulse - needs response
  if (activePoll && remainingTime > 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-6 px-4">
        {/* Top Context Bar */}
        <div className="max-w-md w-full mx-auto flex items-center justify-between text-xs text-slate-500 pb-4">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
            <span>Classroom Active</span>
          </div>
          <Badge variant="live">LIVE</Badge>
        </div>

        {/* Question Card */}
        <div className="w-full max-w-md mx-auto animate-fade-in-up bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          {/* Category & Timer Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60">
              {activePoll.category || 'Quick Check'}
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
              remainingTime > 3 ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700 animate-pulse'
            }`}>
              {remainingTime}s left
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                remainingTime > 3 ? 'bg-indigo-600' : 'bg-rose-500'
              }`}
              style={{ width: `${(remainingTime / (activePoll.timer || 10)) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 text-center mb-6 leading-snug tracking-tight">
            {activePoll.question}
          </h2>

          {/* Response Buttons */}
          <div className="space-y-3">
            {activePoll.responseType === 'yesno' && (
              <div className="grid grid-cols-2 gap-3">
                {['Yes', 'No'].map((answer) => (
                  <button
                    key={answer}
                    onClick={() => handleSubmitResponse(answer)}
                    disabled={submitting}
                    className={`py-4 px-4 rounded-xl text-base font-bold transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50
                      ${answer === 'Yes'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 shadow-2xs'
                      }
                    `}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            )}

            {activePoll.responseType === 'rating' && (
              <div>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {['1', '2', '3', '4', '5'].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleSubmitResponse(num)}
                      disabled={submitting}
                      className="py-4 rounded-xl bg-white border-2 border-slate-200 text-base font-bold text-slate-800
                        hover:border-indigo-600 hover:bg-indigo-50/50 active:scale-[0.97] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
                  <span>Lowest</span>
                  <span>Highest</span>
                </div>
              </div>
            )}

            {activePoll.responseType === 'choice' && (
              <div className="space-y-2.5">
                {activePoll.options?.map((option, i) => (
                  <button
                    key={option}
                    onClick={() => handleSubmitResponse(option)}
                    disabled={submitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-white border border-slate-200 text-left text-sm
                      font-medium text-slate-800 hover:border-indigo-600 hover:bg-indigo-50/40
                      active:scale-[0.99] transition-all disabled:opacity-50 flex items-center gap-3 cursor-pointer group shadow-2xs"
                  >
                    <span className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-xs font-bold text-slate-500 transition-colors">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 font-medium">{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Anonymous footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
            <span>Your response is strictly anonymous to the instructor</span>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 py-2">
          PulseClass Student Cockpit
        </div>
      </div>
    );
  }

  // Pulse closed or waiting
  if (activePoll && remainingTime <= 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
        <div className="text-center animate-fade-in max-w-sm w-full bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4 text-slate-600">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1 tracking-tight">Pulse Window Closed</h2>
          <p className="text-xs sm:text-sm text-slate-500">Waiting for the instructor to launch the next question...</p>
        </div>
      </div>
    );
  }

  // No active pulse — waiting in room
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="text-center animate-fade-in max-w-sm w-full bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Badge variant="live">LIVE</Badge>
          <span className="text-xs text-slate-500 font-medium">
            {participantCount} in room
          </span>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4 text-indigo-600">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-1 tracking-tight">Connected to Live Session</h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
          The instructor has not launched a question yet. Questions will automatically appear on this screen.
        </p>
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
