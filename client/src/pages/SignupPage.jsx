import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await signup(form);
      toast.success('Account created! Welcome to PulseClass.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-12 bg-slate-50/60 dark:bg-[#080B12] theme-transition">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Card */}
        <div className="bg-white dark:bg-[#0F141D] rounded-2xl p-7 sm:p-8 border border-slate-200/90 dark:border-[#1E293B] shadow-xs dark:shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-9 h-9 bg-[#22D3EE] rounded-lg flex items-center justify-center mx-auto mb-3 text-[#061018] font-black text-base shadow-[0_0_15px_rgba(34,211,238,0.25)]">
              P
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Create your account</h1>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">Get started with real-time classroom engagement</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              id="name"
              name="name"
              label="Full Name"
              placeholder="Prof. Vikram Sharma"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              required
              autoComplete="name"
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="name@institution.edu"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
              minLength={6}
              autoComplete="new-password"
            />

            {/* Role selector */}
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-[#94A3B8]">Account Role</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { value: 'student', label: 'Student', sub: 'Join & Vote' },
                  { value: 'instructor', label: 'Instructor', sub: 'Create & Poll' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: option.value })}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      form.role === option.value
                        ? 'border-[#22D3EE] bg-[#22D3EE]/10 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                        : 'border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#151C27]'
                    }`}
                  >
                    <span className={`font-bold text-xs tracking-tight ${form.role === option.value ? 'text-[#22D3EE]' : 'text-slate-900 dark:text-white'}`}>{option.label}</span>
                    <span className="text-[11px] text-slate-500 dark:text-[#94A3B8] font-normal">{option.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {errors.general && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-[#FB7185]/10 border border-rose-200 dark:border-[#FB7185]/20 text-xs font-medium text-rose-600 dark:text-[#FB7185] text-center">
                {errors.general}
              </div>
            )}

            <Button type="submit" size="md" className="w-full mt-2" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-[#94A3B8] mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-[#22D3EE] font-semibold hover:text-[#06B6D4] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
