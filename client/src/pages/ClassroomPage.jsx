import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { classroomService, sessionService } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/Spinner';

export default function ClassroomPage() {
  const { id } = useParams();
  const { user, isInstructor } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingSession, setStartingSession] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [clsData, sessData] = await Promise.all([
        classroomService.getById(id),
        classroomService.getSessions(id),
      ]);
      setClassroom(clsData.classroom);
      setSessions(sessData.sessions);
      setPagination(sessData.pagination);
    } catch (error) {
      toast.error(error.message);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    setStartingSession(true);
    try {
      const data = await sessionService.start(id);
      toast.success('Session started!');
      navigate(`/session/${data.session._id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setStartingSession(false);
    }
  };

  const handleLoadMore = async () => {
    try {
      const nextPage = pagination.page + 1;
      const data = await classroomService.getSessions(id, nextPage);
      setSessions((prev) => [...prev, ...data.sessions]);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to load more sessions');
    }
  };

  if (loading) return <PageLoader />;
  if (!classroom) return null;

  const isClassInstructor =
    (classroom.instructor?._id || classroom.instructor) === user?._id;
  const hasActiveSession =
    classroom.activeSession && classroom.activeSession.isActive !== false;

  const formatDuration = (seconds) => {
    if (!seconds) return '—';
    const mins = Math.floor(seconds / 60);
    return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return 'Today';
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
          Dashboard
        </Link>
        <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
        <Link to={`/institutes/${classroom.institute?._id || classroom.institute}`} className="hover:text-indigo-600 transition-colors truncate max-w-[150px]">
          {classroom.institute?.name || 'Institute'}
        </Link>
        <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
        <span className="text-slate-900 truncate max-w-xs">{classroom.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{classroom.name}</h1>
            {hasActiveSession && <Badge variant="live">LIVE</Badge>}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
            <span>Instructor: {classroom.instructor?.name || 'Instructor'}</span>
            <span>·</span>
            <span>{classroom.students?.length || 0} enrolled student{classroom.students?.length !== 1 ? 's' : ''}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {hasActiveSession ? (
            <Link to={`/session/${classroom.activeSession._id || classroom.activeSession}`}>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500">
                Join Active Session
              </Button>
            </Link>
          ) : (
            isClassInstructor && (
              <Button size="sm" onClick={handleStartSession} loading={startingSession}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 3a1 1 0 00-1 1v8a1 1 0 001.52.85l7-4a1 1 0 000-1.7l-7-4A1 1 0 004 3z" />
                </svg>
                Launch Live Session
              </Button>
            )
          )}
        </div>
      </div>

      {/* Session History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">Past & Active Sessions</h2>
          <span className="text-xs text-slate-400">{sessions.length} recorded</span>
        </div>

        {sessions.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-6 h-6 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="No sessions hosted yet"
            description={
              isClassInstructor
                ? 'Launch your first live interactive session to start polling students with real-time feedback.'
                : 'The instructor has not hosted any live sessions in this classroom yet.'
            }
            actionLabel={isClassInstructor ? 'Launch Session' : undefined}
            onAction={isClassInstructor ? handleStartSession : undefined}
          />
        ) : (
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            {sessions.map((session) => {
              const duration = session.endedAt
                ? Math.round(
                    (new Date(session.endedAt) - new Date(session.startedAt)) / 1000
                  )
                : null;

              return (
                <div key={session._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      session.isActive ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 tracking-tight">
                          Session · {formatDate(session.startedAt)}
                        </span>
                        {session.isActive && <Badge variant="live">LIVE</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span>{session.pollCount || 0} pulse{session.pollCount !== 1 ? 's' : ''}</span>
                        <span>·</span>
                        <span>{session.participantCount || 0} student{session.participantCount !== 1 ? 's' : ''}</span>
                        {duration && (
                          <>
                            <span>·</span>
                            <span>{formatDuration(duration)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {session.isActive ? (
                      <Link to={`/session/${session._id}`}>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500">Join</Button>
                      </Link>
                    ) : (
                      isClassInstructor && (
                        <Link to={`/session/${session._id}/report`}>
                          <Button variant="secondary" size="sm">
                            View Report
                          </Button>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pagination.page < pagination.pages && (
          <div className="text-center pt-4">
            <Button variant="ghost" size="sm" onClick={handleLoadMore}>
              Load earlier sessions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
