import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { getLibrary } from '../api/libraryApi';

const EMOJIS = ['📖', '🐉', '🦄', '🚀', '🌈', '🧙‍♂️', '🦁', '🌸', '🐻', '🌟'];

export default function Dashboard() {
  const { user } = useAuth();
  const [recentStories, setRecentStories] = useState([]);
  const [stats, setStats] = useState({ stories: 0, quizzes: 0, favorites: 0 });

  useEffect(() => {
    getLibrary(1, 6)
      .then(({ data }) => {
        setRecentStories(data.stories || []);
        setStats((s) => ({ ...s, stories: data.total || 0 }));
      })
      .catch(() => {});
  }, []);

  const displayName = user?.displayName?.split(' ')[0] || 'Teacher';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard container page-enter">
      {/* Greeting */}
      <div className="dashboard__greeting">
        <span className="dashboard__greeting-emoji">☀️</span>
        <div className="dashboard__greeting-text">
          <h1>{greeting}, {displayName}! ✨</h1>
          <p>Ready to tell a story today?</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions stagger">
        <Link to="/generate" className="quick-action">
          <span className="quick-action__emoji">✨</span>
          <span className="quick-action__title">Generate Story</span>
        </Link>
        <Link to="/library" className="quick-action">
          <span className="quick-action__emoji">📚</span>
          <span className="quick-action__title">My Library</span>
        </Link>
        <Link to="/emotions" className="quick-action">
          <span className="quick-action__emoji">💛</span>
          <span className="quick-action__title">Emotion Corner</span>
        </Link>
        <Link to="/settings" className="quick-action">
          <span className="quick-action__emoji">⚙️</span>
          <span className="quick-action__title">Settings</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card__value">{stats.stories}</div>
          <div className="stat-card__label">Stories Created</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.quizzes}</div>
          <div className="stat-card__label">Quizzes Run</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.favorites}</div>
          <div className="stat-card__label">Favorites</div>
        </div>
      </div>

      {/* Recent Stories */}
      <div className="recent-stories">
        <div className="recent-stories__header">
          <h2 className="recent-stories__title">📖 Recent Stories</h2>
          <Link to="/library" className="btn btn-outline btn-sm">View All →</Link>
        </div>
        {recentStories.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__emoji">📭</span>
            <div className="empty-state__title">No stories yet!</div>
            <p className="empty-state__desc">Create your first magical tale to see it here.</p>
            <Link to="/generate"><button className="btn btn-primary">✨ Create a Story</button></Link>
          </div>
        ) : (
          <div className="stories-grid stagger">
            {recentStories.map((story, i) => (
              <div key={story._id} className="story-card" style={{ animation: 'fadeUp 0.4s ease both' }}>
                <div className="story-card__header">
                  <span className="story-card__emoji">{EMOJIS[i % EMOJIS.length]}</span>
                  <span className="story-card__title">{story.title || `Story #${i + 1}`}</span>
                </div>
                <p className="story-card__preview">{story.content}</p>
                {story.theme && (
                  <div className="story-card__tags">
                    <span className="badge">{story.theme}</span>
                    {story.language && story.language !== 'English' && (
                      <span className="badge badge-blue">{story.language}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
