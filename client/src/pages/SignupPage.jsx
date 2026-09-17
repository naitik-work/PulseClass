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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.08),rgba(255,255,255,0))]">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-indigo-500/25">
              <span className="text-white text-xl font-black">P</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h1>
            <p className="text-sm text-slate-500 mt-1.5">Get started with real-time classroom engagement</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="you@example.com"
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
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-sm font-semibold text-slate-700">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', label: 'Student', icon: '🎓', sub: 'Join & Vote' },
                  { value: 'instructor', label: 'Instructor', icon: '👨‍🏫', sub: 'Create & Teach' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: option.value })}
                    className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      form.role === option.value
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-base mb-1">
                      <span>{option.icon}</span>
                      <span className="font-bold text-slate-900 text-sm">{option.label}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-normal">{option.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {errors.general && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs font-medium text-rose-600 text-center">
                {errors.general}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full mt-2 shadow-lg shadow-indigo-600/25" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
