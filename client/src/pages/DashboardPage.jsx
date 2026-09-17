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

  const copyCode = (e, code) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toast.success(`Copied institute code: ${code}`);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F5F9]">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/25">
              {user?.role}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            {isInstructor
              ? 'Manage your institutes, configure classrooms, and host live engagement sessions.'
              : 'Access your enrolled institutes, explore classrooms, and participate in active pulses.'}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button variant="secondary" size="sm" onClick={() => setShowJoinModal(true)}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z" />
            </svg>
            Join Institute
          </Button>
          {isInstructor && (
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z" />
              </svg>
              New Institute
            </Button>
          )}
        </div>
      </div>

      {/* Overview Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-8">
        <div className="p-4 rounded-2xl bg-[#0F141D] border border-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Affiliated Institutes</span>
          <p className="text-2xl font-bold text-[#F1F5F9] mt-1 tracking-tight">{institutes.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0F141D] border border-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Account Privilege</span>
          <p className="text-2xl font-bold text-[#F1F5F9] mt-1 capitalize tracking-tight">{user?.role}</p>
        </div>
        <div className="hidden sm:block p-4 rounded-2xl bg-[#0F141D] border border-[#1E293B]">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Session Readiness</span>
          <p className="text-2xl font-bold text-[#34D399] mt-1 tracking-tight">Active</p>
        </div>
      </div>

      {/* Institutes Section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#94A3B8]">Your Institutes</h2>
        <span className="text-xs text-[#64748B]">{institutes.length} total</span>
      </div>

      {institutes.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-6 h-6 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          title="No institutes registered yet"
          description={
            isInstructor
              ? 'Create your institute hub to organize batches, launch live questions, and review engagement analytics.'
              : 'Enter the unique 6-8 character code provided by your instructor to join their institute.'
          }
          actionLabel={isInstructor ? 'Create Institute' : 'Join with Code'}
          onAction={() =>
            isInstructor ? setShowCreateModal(true) : setShowJoinModal(true)
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {institutes.map((inst) => (
            <Link key={inst._id} to={`/institutes/${inst._id}`} className="group">
              <Card interactive className="h-full flex flex-col justify-between p-5 border-[#1E293B] hover:border-[#22D3EE]/40">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#151C27] border border-[#1E293B] flex items-center justify-center text-[#22D3EE]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <button
                      onClick={(e) => copyCode(e, inst.code)}
                      title="Copy code"
                      className="cursor-pointer"
                    >
                      <Badge variant="code">
                        {inst.code}
                      </Badge>
                    </button>
                  </div>
                  <h3 className="font-semibold text-[#F1F5F9] group-hover:text-[#22D3EE] transition-colors text-base tracking-tight">
                    {inst.name}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#64748B]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.47 7.47 0 0114.5 16z" />
                    </svg>
                    {inst.members?.length || 0} member{inst.members?.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs text-[#22D3EE] font-semibold group-hover:text-[#06B6D4]">
                  <span>Open Institute</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
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
