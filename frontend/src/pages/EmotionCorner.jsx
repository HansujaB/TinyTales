import { useState } from 'react';
import { generateEmotionStory } from '../api/emotionApi';
import useTTS from '../hooks/useTTS';
import { EMOTIONS } from '../lib/constants';

export default function EmotionCorner() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [context, setContext] = useState('');
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const { speak, stop, isSpeaking } = useTTS();

  const handleGenerate = async () => {
    if (!selectedEmotion) return;
    setLoading(true);
    setStory(null);
    try {
      const { data } = await generateEmotionStory({
        emotion: selectedEmotion,
        context,
      });
      setStory(data);
    } catch {
      setStory({ story: 'The comfort fairy is resting. Try again soon! 🧚' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emotion-corner container page-enter">
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>
        💛 Emotion Corner
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-soft)', fontWeight: 600, marginBottom: '2rem' }}>
        Select how the child is feeling, and we'll create a comforting story.
      </p>

      <div className="emotion-grid stagger">
        {EMOTIONS.map((e) => (
          <div
            key={e.value}
            className={`emotion-card ${selectedEmotion === e.value ? 'emotion-card--active' : ''}`}
            onClick={() => setSelectedEmotion(e.value)}
            style={{ animation: 'fadeUp 0.4s ease both' }}
          >
            <span className="emotion-card__emoji">{e.emoji}</span>
            <span className="emotion-card__label">{e.label}</span>
          </div>
        ))}
      </div>

      {selectedEmotion && !story && (
        <div className="card-static" style={{ marginBottom: '1.5rem' }}>
          <label className="label">💬 What happened? (optional)</label>
          <textarea
            className="textarea"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. A child lost their favorite toy…"
            style={{ minHeight: '80px' }}
          />
          <button
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? '⏳ Creating comfort story…' : '✨ Generate Comfort Story'}
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="loading-state__stars">
            <span className="loading-state__star">💛</span>
            <span className="loading-state__star">🧸</span>
            <span className="loading-state__star">🌈</span>
          </div>
          <p className="loading-state__label">Creating a comfort story…</p>
        </div>
      )}

      {story && !loading && (
        <div className="card-static story-output" style={{ marginTop: '1rem' }}>
          <div className="story-output__toolbar">
            <button className="btn btn-blue btn-sm" onClick={() => isSpeaking ? stop() : speak(story.story || JSON.stringify(story))}>
              {isSpeaking ? '⏹ Stop' : '🔊 Read Aloud'}
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => { setStory(null); setSelectedEmotion(null); setContext(''); }}>
              🔄 Try Another
            </button>
          </div>
          <p className="story-output__text">{story.story || JSON.stringify(story)}</p>
        </div>
      )}
    </div>
  );
}
