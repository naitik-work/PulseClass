import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { instituteService, classroomService } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/Spinner';

export default function InstitutePage() {
  const { id } = useParams();
  const { user, isInstructor } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [institute, setInstitute] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classroomName, setClassroomName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [instData, classData] = await Promise.all([
        instituteService.getById(id),
        instituteService.getClassrooms(id),
      ]);
      setInstitute(instData.institute);
      setClassrooms(classData.classrooms);
    } catch (error) {
      toast.error(error.message);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    if (!classroomName.trim()) return;
    setSubmitting(true);
    try {
      await classroomService.create({ name: classroomName.trim(), instituteId: id });
      toast.success('Classroom created!');
      setShowCreateModal(false);
      setClassroomName('');
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinClassroom = async (classroomId) => {
    try {
      await classroomService.join(classroomId);
      toast.success('Joined classroom!');
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <PageLoader />;
  if (!institute) return null;

  const isOwner = institute.owner?._id === user?._id || institute.owner === user?._id;

  const copyCode = () => {
    if (!institute?.code) return;
    navigator.clipboard.writeText(institute.code);
    toast.success(`Copied institute code: ${institute.code}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          Dashboard
        </Link>
        <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
        <span className="text-slate-900 dark:text-white truncate max-w-xs">{institute.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{institute.name}</h1>
            <button
              onClick={copyCode}
              title="Click to copy code"
              className="cursor-pointer group flex items-center gap-1"
            >
              <Badge variant="code">
                {institute.code}
              </Badge>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                (Click to copy)
              </span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>{institute.members?.length || 0} enrolled member{institute.members?.length !== 1 ? 's' : ''}</span>
            <span>·</span>
            <span>{classrooms.length} classroom{classrooms.length !== 1 ? 's' : ''}</span>
          </p>
        </div>
        {isOwner && (
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z" />
            </svg>
            New Classroom
          </Button>
        )}
      </div>

      {/* Classrooms Section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Available Classrooms</h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">{classrooms.length} active</span>
      </div>

      {classrooms.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-6 h-6 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          title="No classrooms in this institute yet"
          description={
            isOwner
              ? 'Create your first classroom/batch (e.g. "MERN Batch 1", "Algorithms Section A") to begin hosting interactive sessions.'
              : 'No classrooms have been launched yet by the institute instructor. Check back soon.'
          }
          actionLabel={isOwner ? 'Create Classroom' : undefined}
          onAction={isOwner ? () => setShowCreateModal(true) : undefined}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((cls) => {
            const isClassInstructor = (cls.instructor?._id || cls.instructor) === user?._id;
            const isEnrolled = cls.students?.some(
              (s) => (s._id || s) === user?._id || s.toString?.() === user?._id
            );
            const hasActiveSession = cls.activeSession && cls.activeSession.isActive !== false;

            return (
              <Card key={cls._id} className="flex flex-col justify-between p-5 border-slate-200/80 dark:border-slate-800">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base tracking-tight">{cls.name}</h3>
                    {hasActiveSession && <Badge variant="live">LIVE</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-4">
                    <span>{cls.instructor?.name || 'Instructor'}</span>
                    <span>·</span>
                    <span>
                      {cls.students?.length || 0} student{cls.students?.length !== 1 ? 's' : ''}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {isClassInstructor || isEnrolled ? (
                    <div className="flex items-center gap-2">
                      <Link to={`/classrooms/${cls._id}`} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full">
                          Enter Classroom
                        </Button>
                      </Link>
                      {hasActiveSession && (
                        <Link
                          to={`/session/${cls.activeSession._id || cls.activeSession}`}
                          className="flex-1"
                        >
                          <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500">
                            Join Pulse
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => handleJoinClassroom(cls._id)}
                    >
                      Join Classroom
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Classroom Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Classroom"
        size="sm"
      >
        <form onSubmit={handleCreateClassroom} className="space-y-4">
          <Input
            id="classroom-name"
            label="Classroom Name"
            placeholder="e.g. MERN Batch"
            value={classroomName}
            onChange={(e) => setClassroomName(e.target.value)}
            required
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
