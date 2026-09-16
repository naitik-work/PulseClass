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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/dashboard" className="hover:text-indigo-500">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-gray-900">{institute.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">{institute.name}</h1>
            <Badge variant="primary">{institute.code}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {institute.members?.length || 0} member{institute.members?.length !== 1 ? 's' : ''}
          </p>
        </div>
        {isOwner && (
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            Create Classroom
          </Button>
        )}
      </div>

      {/* Classrooms */}
      {classrooms.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No classrooms yet"
          description={
            isOwner
              ? 'Create your first classroom to start teaching.'
              : 'No classrooms are available yet. Check back soon.'
          }
          actionLabel={isOwner ? 'Create Classroom' : undefined}
          onAction={isOwner ? () => setShowCreateModal(true) : undefined}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {classrooms.map((cls) => {
            const isClassInstructor = (cls.instructor?._id || cls.instructor) === user?._id;
            const isEnrolled = cls.students?.some(
              (s) => (s._id || s) === user?._id || s.toString?.() === user?._id
            );
            const hasActiveSession = cls.activeSession && cls.activeSession.isActive !== false;

            return (
              <Card key={cls._id} className="relative group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{cls.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {cls.instructor?.name || 'Instructor'} · {cls.students?.length || 0} student
                      {cls.students?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {hasActiveSession && <Badge variant="live">🔴 LIVE</Badge>}
                </div>

                <div className="flex gap-2 mt-4">
                  {isClassInstructor || isEnrolled ? (
                    <>
                      <Link to={`/classrooms/${cls._id}`} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full">
                          View
                        </Button>
                      </Link>
                      {hasActiveSession && (
                        <Link
                          to={`/session/${cls.activeSession._id || cls.activeSession}`}
                          className="flex-1"
                        >
                          <Button size="sm" className="w-full">
                            Join Session
                          </Button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
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
