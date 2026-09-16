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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Session Ended</h2>
          <p className="text-sm text-gray-500 mb-6">Thanks for participating!</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Active pulse - responded
  if (activePoll && hasResponded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up max-w-sm">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Response submitted</h2>
          <p className="text-sm text-gray-500">Your response is anonymous to the instructor.</p>
          {remainingTime > 0 && (
            <p className="text-xs text-gray-400 mt-3">
              Waiting for others... <span className="font-mono">{remainingTime}s</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // Active pulse - needs response
  if (activePoll && remainingTime > 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm animate-fade-in-up">
          {/* Timer */}
          <div className="text-center mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              {remainingTime}s remaining
            </span>
          </div>

          {/* Timer bar */}
          <div className="w-full h-1 bg-gray-200 rounded-full mb-8">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(remainingTime / (activePoll.timer || 10)) * 100}%` }}
            />
          </div>

          {/* Question */}
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-8 leading-tight">
            {activePoll.question}
          </h2>

          {/* Response buttons */}
          <div className="space-y-3">
            {activePoll.responseType === 'yesno' && (
              <div className="grid grid-cols-2 gap-3">
                {['Yes', 'No'].map((answer) => (
                  <button
                    key={answer}
                    onClick={() => handleSubmitResponse(answer)}
                    disabled={submitting}
                    className={`py-5 rounded-xl text-lg font-semibold transition-all active:scale-95 disabled:opacity-50
                      ${answer === 'Yes'
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                      }
                    `}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            )}

            {activePoll.responseType === 'rating' && (
              <div className="grid grid-cols-5 gap-2">
                {['1', '2', '3', '4', '5'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleSubmitResponse(num)}
                    disabled={submitting}
                    className="py-5 rounded-xl bg-white border-2 border-gray-200 text-lg font-bold text-gray-700
                      hover:border-indigo-500 hover:bg-indigo-50 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}

            {activePoll.responseType === 'choice' && (
              <div className="space-y-2.5">
                {activePoll.options?.map((option, i) => (
                  <button
                    key={option}
                    onClick={() => handleSubmitResponse(option)}
                    disabled={submitting}
                    className="w-full py-4 px-4 rounded-xl bg-white border-2 border-gray-200 text-left text-base
                      font-medium text-gray-700 hover:border-indigo-500 hover:bg-indigo-50
                      active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-3"
                  >
                    <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Anonymous indicator */}
          {activePoll.isAnonymous && (
            <p className="text-center text-xs text-gray-400 mt-6">
              🔒 Your response is anonymous to the instructor
            </p>
          )}
        </div>
      </div>
    );
  }

  // Pulse closed or waiting
  if (activePoll && remainingTime <= 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="text-4xl mb-4">⏱️</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Pulse closed</h2>
          <p className="text-sm text-gray-500">Waiting for the next question...</p>
        </div>
      </div>
    );
  }

  // No active pulse — waiting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Badge variant="live">🔴 LIVE</Badge>
          <span className="text-xs text-gray-400">
            {participantCount} participant{participantCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="text-5xl mb-4">📡</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Session is live</h2>
        <p className="text-sm text-gray-500">
          Waiting for the instructor to launch a pulse...
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
