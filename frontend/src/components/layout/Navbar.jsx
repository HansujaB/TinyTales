import { NavLink, Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useUiStore from '../../store/uiStore';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUiStore();

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          📚 TinyTales
        </Link>

        <div className="navbar__links">
          {!isAuthenticated && (
            <NavLink to="/" end className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>
              Home
            </NavLink>
          )}
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>
                Dashboard
              </NavLink>
              <NavLink to="/generate" className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>
                Create Story
              </NavLink>
              <NavLink to="/library" className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>
                Library
              </NavLink>
              <NavLink to="/emotions" className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>
                Emotions
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => 'navbar__link' + (isActive ? ' navbar__link--active' : '')}>
                Settings
              </NavLink>
            </>
          )}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {user?.photoURL && (
                <Link to="/settings">
                  <img className="navbar__avatar" src={user.photoURL} alt={user.displayName} />
                </Link>
              )}
              <button className="btn btn-outline btn-sm" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={login}>
              Login ✨
            </button>
          )}
        </div>

        <button className="navbar__mobile-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
