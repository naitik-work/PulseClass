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
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="font-semibold text-gray-900 text-base">PulseClass</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Connection status */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      connected ? 'bg-emerald-400' : 'bg-gray-300'
                    }`}
                  />
                  {connected ? 'Connected' : 'Offline'}
                </div>

                {/* User info */}
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <span>{user?.name}</span>
                  <span className="text-xs text-gray-400 capitalize">({user?.role})</span>
                </div>

                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
