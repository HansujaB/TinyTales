import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
