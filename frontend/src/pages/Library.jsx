import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLibrary, getFavorites, searchStories } from '../api/libraryApi';
import { deleteStory, toggleFavorite } from '../api/storyApi';
import useTTS from '../hooks/useTTS';

const EMOJIS = ['📖', '🐉', '🦄', '🚀', '🌈', '🧙‍♂️', '🦁', '🌸', '🐻', '🌟'];

export default function Library() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { speak, stop, isSpeaking } = useTTS();

  const fetchStories = async () => {
    setLoading(true);
    try {
      let data;
      if (filter === 'favorites') {
        const res = await getFavorites();
        data = res.data;
        setStories(data.stories || []);
      } else if (searchQuery.trim()) {
        const res = await searchStories({ q: searchQuery });
        data = res.data;
        setStories(data.stories || []);
      } else {
        const res = await getLibrary(page, 20);
        data = res.data;
        setStories(data.stories || []);
        setTotalPages(data.pages || 1);
      }
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [filter, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStories();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this story? 🗑️')) return;
    try {
      await deleteStory(id);
      setStories((s) => s.filter((st) => st._id !== id));
    } catch {}
  };

  const handleFavorite = async (id) => {
    try {
      const { data } = await toggleFavorite(id);
      setStories((s) =>
        s.map((st) => (st._id === id ? { ...st, isFavorite: data.isFavorite } : st))
      );
    } catch {}
  };

  return (
    <div className="library-page container page-enter">
      <div className="library-page__header">
        <h1 className="library-page__title">📚 My Library</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            className="input"
            style={{ width: '250px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories..."
          />
          <button type="submit" className="btn btn-primary btn-sm">🔍</button>
        </form>
      </div>

      <div className="library-filters" style={{ marginBottom: '1.5rem' }}>
        {['all', 'favorites'].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'filter-btn--active' : ''}`}
            onClick={() => { setFilter(f); setPage(1); }}
          >
            {f === 'all' ? '📖 All' : '❤️ Favorites'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-state__stars">
            <span className="loading-state__star">⭐</span>
            <span className="loading-state__star">✨</span>
            <span className="loading-state__star">🌟</span>
          </div>
          <p className="loading-state__label">Loading your stories…</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__emoji">📭</span>
          <div className="empty-state__title">No stories found!</div>
          <p className="empty-state__desc">
            {searchQuery ? 'Try a different search term.' : 'Create your first story to see it here.'}
          </p>
          <Link to="/generate"><button className="btn btn-primary">✨ Create a Story</button></Link>
        </div>
      ) : (
        <>
          <div className="stories-grid stagger">
            {stories.map((story, i) => (
              <div key={story._id} className="story-card" style={{ animation: 'fadeUp 0.4s ease both' }}>
                <div className="story-card__header">
                  <span className="story-card__emoji">{EMOJIS[i % EMOJIS.length]}</span>
                  <span className="story-card__title">{story.title || `Story #${i + 1}`}</span>
                </div>
                <p className="story-card__preview">{story.content}</p>
                {(story.theme || story.language) && (
                  <div className="story-card__tags">
                    {story.theme && <span className="badge">{story.theme}</span>}
                    {story.language && story.language !== 'English' && (
                      <span className="badge badge-blue">{story.language}</span>
                    )}
                  </div>
                )}
                <div className="story-card__actions">
                  <button
                    className="btn btn-blue btn-sm"
                    onClick={() => isSpeaking ? stop() : speak(story.content)}
                  >
                    {isSpeaking ? '⏹' : '🔊'}
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ background: story.isFavorite ? 'var(--color-pink)' : 'var(--color-white)', color: story.isFavorite ? '#fff' : 'inherit' }}
                    onClick={() => handleFavorite(story._id)}
                  >
                    {story.isFavorite ? '❤️' : '🤍'}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(story._id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && filter === 'all' && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              <button className="btn btn-outline btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                ← Prev
              </button>
              <span className="badge">{page} / {totalPages}</span>
              <button className="btn btn-outline btn-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
