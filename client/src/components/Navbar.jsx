import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Button from './ui/Button';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#080B12]/85 backdrop-blur-md border-b border-[#1E293B] sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-[#22D3EE] rounded-lg flex items-center justify-center shadow-xs text-[#061018] group-hover:bg-[#06B6D4] transition-colors">
              <span className="text-[#061018] text-sm font-bold tracking-tight">P</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#F1F5F9] text-base tracking-tight group-hover:text-[#22D3EE] transition-colors">
                PulseClass
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#151C27] text-[#94A3B8] border border-[#1E293B]">
                SaaS
              </span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle is always available */}
            <ThemeToggle size="sm" />

            {isAuthenticated ? (
              <>
                {/* Connection status */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F141D] border border-[#1E293B] text-xs text-[#94A3B8] font-medium">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      connected ? 'bg-[#34D399] ring-2 ring-[#34D399]/20' : 'bg-[#FB7185] ring-2 ring-[#FB7185]/20'
                    }`}
                  />
                  <span>{connected ? 'Live Sync' : 'Offline'}</span>
                </div>

                {/* User info */}
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0F141D] border border-[#1E293B] text-xs text-[#F1F5F9]">
                  <div className="w-5 h-5 rounded-full bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30 font-bold flex items-center justify-center text-[10px]">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium truncate max-w-[110px] sm:max-w-[150px]">{user?.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/25">
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
