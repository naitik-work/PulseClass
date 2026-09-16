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
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/dashboard" className="hover:text-indigo-500">Dashboard</Link>
        <span>/</span>
        <Link to={`/institutes/${classroom.institute?._id || classroom.institute}`} className="hover:text-indigo-500">
          {classroom.institute?.name || 'Institute'}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{classroom.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">{classroom.name}</h1>
            {hasActiveSession && <Badge variant="live">🔴 LIVE</Badge>}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {classroom.students?.length || 0} student
            {classroom.students?.length !== 1 ? 's' : ''}
            {' · '}
            {classroom.instructor?.name || 'Instructor'}
          </p>
        </div>

        <div className="flex gap-2">
          {hasActiveSession ? (
            <Link to={`/session/${classroom.activeSession._id || classroom.activeSession}`}>
              <Button>Join Live Session</Button>
            </Link>
          ) : (
            isClassInstructor && (
              <Button onClick={handleStartSession} loading={startingSession}>
                Start Live Session
              </Button>
            )
          )}
        </div>
      </div>

      {/* Session History */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Session History</h2>

        {sessions.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No sessions yet"
            description={
              isClassInstructor
                ? 'Start your first live session to engage with your students.'
                : 'No sessions have been conducted yet.'
            }
            actionLabel={isClassInstructor ? 'Start Session' : undefined}
            onAction={isClassInstructor ? handleStartSession : undefined}
          />
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const duration = session.endedAt
                ? Math.round(
                    (new Date(session.endedAt) - new Date(session.startedAt)) / 1000
                  )
                : null;

              return (
                <Card key={session._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(session.startedAt)}
                        </span>
                        {session.isActive && <Badge variant="live">LIVE</Badge>}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{session.pollCount || 0} pulse{session.pollCount !== 1 ? 's' : ''}</span>
                        <span>·</span>
                        <span>{session.participantCount || 0} participant{session.participantCount !== 1 ? 's' : ''}</span>
                        {duration && (
                          <>
                            <span>·</span>
                            <span>{formatDuration(duration)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {session.isActive ? (
                    <Link to={`/session/${session._id}`}>
                      <Button size="sm">Join</Button>
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
                </Card>
              );
            })}

            {pagination.page < pagination.pages && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" onClick={handleLoadMore}>
                  Load more
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
