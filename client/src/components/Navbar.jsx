import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Button from './ui/Button';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/85 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white text-base font-black tracking-tighter">P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                PulseClass
              </span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <>
                {/* Connection status */}
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs text-slate-500 font-medium">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connected ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-rose-400'
                    }`}
                  />
                  {connected ? 'Realtime Connected' : 'Offline'}
                </div>

                {/* User info */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 font-medium">
                  <span className="truncate max-w-[120px] sm:max-w-[160px]">{user?.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                    {user?.role}
                  </span>
                </div>

                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
