import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { sessionService } from '../services/api';
import Card from '../components/ui/Card';
import { PageLoader } from '../components/ui/Spinner';

export default function SessionReportPage() {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const data = await sessionService.getReport(id);
      setReport(data.report);
    } catch (error) {
      toast.error(error.message);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!report) return null;

  const formatDuration = (seconds) => {
    if (!seconds) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/dashboard" className="hover:text-indigo-500">Dashboard</Link>
        <span>/</span>
        <span className="text-gray-900">Session Report</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Session Report</h1>
        <p className="text-sm text-gray-500 mt-1">
          {report.session.classroom?.name || 'Classroom'} · {formatDate(report.session.startedAt)}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Duration', value: formatDuration(report.session.duration) },
          { label: 'Participants', value: report.participantCount },
          { label: 'Pulses', value: report.totalPolls },
          { label: 'Avg Participation', value: `${report.avgParticipation}%` },
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Pulse-by-pulse breakdown */}
      <h2 className="text-lg font-medium text-gray-900 mb-4">Pulse History</h2>

      {report.polls.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-500 text-center py-4">
            No pulses were launched during this session.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {report.polls.map((poll, index) => {
            const total = poll.responseCount || 0;

            return (
              <Card key={poll._id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 font-mono">#{index + 1}</span>
                      <h3 className="text-sm font-medium text-gray-900">{poll.question}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="capitalize">{poll.category}</span>
                      <span>·</span>
                      <span>{poll.responseType}</span>
                      <span>·</span>
                      <span>{formatTime(poll.launchedAt)}</span>
                      <span>·</span>
                      <span>{total} response{total !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Distribution bars */}
                <div className="space-y-2">
                  {Object.entries(poll.distribution).map(([label, count]) => {
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-20 text-right">
                          {poll.responseType === 'rating' ? `${label} ★` : label}
                        </span>
                        <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                          <div
                            className="h-full bg-indigo-400 rounded transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10">
                          {pct}% <span className="text-gray-300">({count})</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
