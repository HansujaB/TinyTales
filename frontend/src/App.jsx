import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StoryGenerator from './pages/StoryGenerator';
import Library from './pages/Library';
import EmotionCorner from './pages/EmotionCorner';
import Settings from './pages/Settings';

import useAuth from './hooks/useAuth';

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="splash-loader">
        <div className="splash-loader__inner">
          <span className="splash-loader__emoji">📚</span>
          <div className="splash-loader__dots">
            <span></span><span></span><span></span>
          </div>
          <p className="splash-loader__text">Loading TinyTales...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Sidebar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/generate" element={<ProtectedRoute><StoryGenerator /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/emotions" element={<ProtectedRoute><EmotionCorner /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        © 2026 <span>TinyTales</span> – Imagination Unleashed ✨
      </footer>
    </Router>
  );
}