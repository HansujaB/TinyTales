import { NavLink } from 'react-router-dom';
import useUiStore from '../../store/uiStore';
import useAuth from '../../hooks/useAuth';
import { BookOpen, PenTool, Library, Heart, Settings, Smile } from 'lucide-react';

const links = [
  { to: '/dashboard', icon: <BookOpen size={20} />, label: 'Dashboard' },
  { to: '/generate', icon: <PenTool size={20} />, label: 'Create Story' },
  { to: '/library', icon: <Library size={20} />, label: 'My Library' },
  { to: '/emotions', icon: <Smile size={20} />, label: 'Emotion Corner' },
  { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const { isAuthenticated, user, login, logout } = useAuth();

  return (
    <>
      <div
        className={`sidebar__overlay ${sidebarOpen ? 'sidebar__overlay--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__logo">📚 TinyTales</div>
        <nav className="sidebar__nav">
          {!isAuthenticated ? (
            <>
              <NavLink to="/" end className={({ isActive }) => 'sidebar__link' + (isActive ? ' sidebar__link--active' : '')} onClick={() => setSidebarOpen(false)}>
                <BookOpen size={20} /> Home
              </NavLink>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={login}>
                Login ✨
              </button>
            </>
          ) : (
            <>
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) => 'sidebar__link' + (isActive ? ' sidebar__link--active' : '')}
                  onClick={() => setSidebarOpen(false)}
                >
                  {l.icon} {l.label}
                </NavLink>
              ))}
              <hr style={{ border: '1px solid var(--color-border)', margin: '1rem 0' }} />
              {user?.photoURL && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <img className="navbar__avatar" src={user.photoURL} alt={user.displayName} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.displayName}</span>
                </div>
              )}
              <button className="btn btn-outline btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
