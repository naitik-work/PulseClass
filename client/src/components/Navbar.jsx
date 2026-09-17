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
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-2xs group-hover:bg-indigo-700 transition-colors">
              <span className="text-white text-sm font-bold tracking-tight">P</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900 text-base tracking-tight group-hover:text-indigo-600 transition-colors">
                PulseClass
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/80">
                SaaS
              </span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {isAuthenticated ? (
              <>
                {/* Connection status */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/70 text-xs text-slate-600 font-medium">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      connected ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-rose-400 ring-2 ring-rose-400/20'
                    }`}
                  />
                  <span>{connected ? 'Live Sync' : 'Offline'}</span>
                </div>

                {/* User info */}
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50/80 border border-slate-200/70 text-xs text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium truncate max-w-[110px] sm:max-w-[150px]">{user?.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60">
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
                    Sign In
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
