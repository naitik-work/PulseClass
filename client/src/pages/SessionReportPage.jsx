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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
          Dashboard
        </Link>
        <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
        <Link
          to={`/classrooms/${report.session.classroom?._id || report.session.classroom}`}
          className="hover:text-indigo-600 transition-colors truncate max-w-[160px]"
        >
          {report.session.classroom?.name || 'Classroom'}
        </Link>
        <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
        <span className="text-slate-900 font-semibold">Executive Session Report</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Session Engagement Report</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              Archived
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
            <span>Classroom: {report.session.classroom?.name || 'Classroom'}</span>
            <span>·</span>
            <span>{formatDate(report.session.startedAt)}</span>
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          Export / Print
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-10">
        {[
          { label: 'Session Duration', value: formatDuration(report.session.duration) },
          { label: 'Total Students in Room', value: report.participantCount },
          { label: 'Pulses Conducted', value: report.totalPolls },
          { label: 'Avg Engagement Rate', value: `${report.avgParticipation}%` },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
            <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pulse-by-pulse breakdown */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">Question-by-Question Breakdown</h2>
        <span className="text-xs text-slate-400">{report.polls.length} total questions</span>
      </div>

      {report.polls.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-6 h-6 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title="No pulses were launched"
          description="This session was opened and closed without any pulse questions being launched."
        />
      ) : (
        <div className="space-y-4">
          {report.polls.map((poll, index) => {
            const total = poll.responseCount || 0;

            return (
              <div key={poll._id} className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">{poll.question}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                    <span className="capitalize px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wider">
                      {poll.category}
                    </span>
                    <span>·</span>
                    <span className="font-mono">{formatTime(poll.launchedAt)}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-800">{total} vote{total !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Distribution bars */}
                <div className="space-y-2.5 bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  {Object.entries(poll.distribution).map(([label, count]) => {
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-700 w-24 text-right truncate">
                          {poll.responseType === 'rating' ? `${label} ★ Rating` : label}
                        </span>
                        <div className="flex-1 h-4 bg-slate-200/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-medium text-slate-600 w-16 text-right">
                          {pct}% <span className="text-slate-400">({count})</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
