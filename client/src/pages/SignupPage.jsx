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
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg font-bold">P</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Get started with PulseClass</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            name="name"
            label="Full Name"
            placeholder="John Doe"
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
            label="Email"
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
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'student', label: 'Student', icon: '🎓' },
                { value: 'instructor', label: 'Instructor', icon: '👨‍🏫' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: option.value })}
                  className={`flex items-center gap-2 px-4 py-3 border rounded-lg text-sm font-medium transition-all
                    ${
                      form.role === option.value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {errors.general && (
            <p className="text-sm text-red-500 text-center">{errors.general}</p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-500 font-medium hover:text-indigo-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
