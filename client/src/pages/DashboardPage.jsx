import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { instituteService } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/Spinner';

export default function DashboardPage() {
  const { user, isInstructor } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createName, setCreateName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const data = await instituteService.getAll();
      setInstitutes(data.institutes);
    } catch (error) {
      toast.error('Failed to load institutes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createName.trim()) return;
    setSubmitting(true);
    try {
      await instituteService.create({ name: createName.trim() });
      toast.success('Institute created!');
      setShowCreateModal(false);
      setCreateName('');
      fetchInstitutes();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setSubmitting(true);
    try {
      await instituteService.join(joinCode.trim());
      toast.success('Joined institute!');
      setShowJoinModal(false);
      setJoinCode('');
      fetchInstitutes();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isInstructor
              ? 'Manage your institutes and classrooms'
              : 'Your institutes and classrooms'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowJoinModal(true)}>
            Join Institute
          </Button>
          {isInstructor && (
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              Create Institute
            </Button>
          )}
        </div>
      </div>

      {/* Institute list */}
      {institutes.length === 0 ? (
        <EmptyState
          icon="🏫"
          title="No institutes yet"
          description={
            isInstructor
              ? 'Create your first institute to start organizing classrooms.'
              : 'Join an institute using a code from your instructor.'
          }
          actionLabel={isInstructor ? 'Create Institute' : 'Join Institute'}
          onAction={() =>
            isInstructor ? setShowCreateModal(true) : setShowJoinModal(true)
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {institutes.map((inst) => (
            <Link key={inst._id} to={`/institutes/${inst._id}`}>
              <Card className="hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {inst.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {inst.members?.length || 0} member{inst.members?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge variant="primary">{inst.code}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Create Institute Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Institute"
        size="sm"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            id="institute-name"
            label="Institute Name"
            placeholder="e.g. Sheryians Coding School"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
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

      {/* Join Institute Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Join Institute"
        size="sm"
      >
        <form onSubmit={handleJoin} className="space-y-4">
          <Input
            id="join-code"
            label="Institute Code"
            placeholder="e.g. PCLS7A"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            required
            autoFocus
            maxLength={8}
          />
          <p className="text-xs text-gray-400">
            Enter the code provided by your instructor to join their institute.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowJoinModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Join
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
