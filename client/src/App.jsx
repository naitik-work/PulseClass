import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import InstitutePage from './pages/InstitutePage';
import ClassroomPage from './pages/ClassroomPage';
import SessionPage from './pages/SessionPage';
import SessionReportPage from './pages/SessionReportPage';
import ProtectedRoute from './components/ProtectedRoute';

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ToastProvider>
            <Routes>
              {/* Standalone Live Session view (full screen, immersive) */}
              <Route
                path="/session/:id"
                element={
                  <ProtectedRoute>
                    <SessionPage />
                  </ProtectedRoute>
                }
              />

              {/* Standard App Layout routes */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <LoginPage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicOnlyRoute>
                      <SignupPage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/institutes/:id"
                  element={
                    <ProtectedRoute>
                      <InstitutePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/classrooms/:id"
                  element={
                    <ProtectedRoute>
                      <ClassroomPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/session/:id/report"
                  element={
                    <ProtectedRoute role="instructor">
                      <SessionReportPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </ToastProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
