import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
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
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'instructor') {
      setForm({ email: 'nethic@pulseclass.dev', password: 'password123' });
    } else {
      setForm({ email: 'bhusra@pulseclass.dev', password: 'password123' });
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
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Sign in to PulseClass</h1>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">Real-time classroom engagement platform</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            {errors.general && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-[#FB7185]/10 border border-rose-200 dark:border-[#FB7185]/20 text-xs font-medium text-rose-600 dark:text-[#FB7185] text-center">
                {errors.general}
              </div>
            )}

            <Button type="submit" size="md" className="w-full mt-2" loading={loading}>
              Sign In
            </Button>
          </form>

          {/* Quick Demo Login Fill */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#1E293B] text-center">
            <span className="text-[11px] text-slate-400 dark:text-[#64748B] font-medium block mb-2">Demo Credentials</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fillDemo('instructor')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#151C27] hover:bg-slate-200 dark:hover:bg-[#1E293B] text-[11px] font-semibold text-slate-700 dark:text-[#F1F5F9] cursor-pointer transition-colors border border-slate-200/60 dark:border-[#1E293B]"
              >
                Instructor
              </button>
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#151C27] hover:bg-slate-200 dark:hover:bg-[#1E293B] text-[11px] font-semibold text-slate-700 dark:text-[#F1F5F9] cursor-pointer transition-colors border border-slate-200/60 dark:border-[#1E293B]"
              >
                Student
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-[#94A3B8] mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#22D3EE] font-semibold hover:text-[#06B6D4] transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
