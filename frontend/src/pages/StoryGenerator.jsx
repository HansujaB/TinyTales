import { useState } from 'react';
import { generateStory, extractMoral, saveStory, continueStory } from '../api/storyApi';
import { generateQuiz } from '../api/quizApi';
import useTTS from '../hooks/useTTS';
import { THEMES, TOPIC_SUGGESTIONS, AGE_GROUPS, STORY_LENGTHS, LANGUAGES, CHARACTER_TYPES } from '../lib/constants';

const loadingMessages = [
  '📖 Writing your story…',
  '✨ Sprinkling some magic…',
  '🐉 Training the dragons…',
  '🌟 Almost there…',
  '🦄 The unicorn is editing…',
];

export default function StoryGenerator() {
  // Form state
  const [topic, setTopic] = useState('');
  const [theme, setTheme] = useState('kindness');
  const [ageGroup, setAgeGroup] = useState('3-5');
  const [length, setLength] = useState('short');
  const [language, setLanguage] = useState('English');
  const [characters, setCharacters] = useState([{ name: '', type: 'animal' }]);

  // Output state
  const [story, setStory] = useState(null);
  const [moral, setMoral] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [saved, setSaved] = useState(false);

  // Continuation
  const [showContinue, setShowContinue] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [continuing, setContinuing] = useState(false);

  const { speak, stop, isSpeaking } = useTTS();

  const addCharacter = () => {
    if (characters.length < 4) {
      setCharacters([...characters, { name: '', type: 'animal' }]);
    }
  };

  const removeCharacter = (i) => {
    setCharacters(characters.filter((_, idx) => idx !== i));
  };

  const updateCharacter = (i, field, value) => {
    const updated = [...characters];
    updated[i] = { ...updated[i], [field]: value };
    setCharacters(updated);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setStory(null);
    setMoral(null);
    setQuiz(null);
    setSaved(false);
    setLoading(true);
    setShowContinue(false);

    const interval = setInterval(() => {
      setLoadingMsg((i) => (i + 1) % loadingMessages.length);
    }, 2000);

    try {
      const charNames = characters.map((c) => c.name).filter((n) => n.trim());
      const { data } = await generateStory({
        topic,
        characters: charNames.length > 0 ? charNames : ['Bunny'],
        theme,
        age_group: ageGroup,
        length,
        language,
      });

      setStory(data);

      // Auto-extract moral
      if (data.story) {
        try {
          const { data: moralData } = await extractMoral({ story: data.story });
          setMoral(moralData);
        } catch {}
      }
    } catch {
      setStory({ story: 'Oops! The story wizard is resting. Please try again later. 🧙‍♂️' });
    } finally {
      setLoading(false);
      clearInterval(interval);
    }
  };

  const handleSave = async () => {
    if (!story?.story || saved) return;
    try {
      await saveStory({
        title: story.story.split('\n')[0]?.replace(/^Title:\s*/i, '') || topic,
        content: story.story,
        topic: story.topic || topic,
        theme: story.theme || theme,
        characters: story.characters || characters.map((c) => c.name),
        moral: moral?.moral || '',
        language: story.language || language,
        tags: [topic, theme],
      });
      setSaved(true);
    } catch {}
  };

  const handleContinue = async () => {
    if (!suggestion.trim()) return;
    setContinuing(true);
    try {
      const { data } = await continueStory({
        story_so_far: story.story,
        children_suggestion: suggestion,
      });
      setStory((prev) => ({
        ...prev,
        story: prev.story + '\n\n' + (data.continuation || data.story || ''),
      }));
      setSuggestion('');
      setShowContinue(false);
    } catch {} finally {
      setContinuing(false);
    }
  };

  const handleQuiz = async () => {
    if (!story?.story) return;
    try {
      const { data } = await generateQuiz({ story: story.story, num_questions: 5 });
      setQuiz(data);
    } catch {}
  };

  return (
    <div className="story-gen container page-enter">
      <h1 className="story-gen__title">✨ Create a New Story</h1>
      <p className="story-gen__sub">Set the stage for a magical tale!</p>

      {!story && !loading && (
        <div className="card-static" style={{ marginBottom: '1.5rem' }}>
          <div className="story-form">
            {/* Topic */}
            <div className="form-group">
              <label className="label">📖 Topic</label>
              <input
                className="input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. A dragon who loves baking cookies"
              />
              <div className="topic-chips">
                {TOPIC_SUGGESTIONS.map((t) => (
                  <button
                    key={t}
                    className={`topic-chip ${topic === t ? 'topic-chip--active' : ''}`}
                    onClick={() => setTopic(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Characters */}
            <div className="form-group">
              <label className="label">🧸 Characters (up to 4)</label>
              <div className="character-inputs">
                {characters.map((c, i) => (
                  <div key={i} className="character-row">
                    <input
                      className="input"
                      placeholder={`Character ${i + 1} name`}
                      value={c.name}
                      onChange={(e) => updateCharacter(i, 'name', e.target.value)}
                    />
                    <select
                      className="select"
                      value={c.type}
                      onChange={(e) => updateCharacter(i, 'type', e.target.value)}
                    >
                      {CHARACTER_TYPES.map((ct) => (
                        <option key={ct.value} value={ct.value}>{ct.emoji} {ct.label}</option>
                      ))}
                    </select>
                    {characters.length > 1 && (
                      <button className="btn btn-ghost btn-sm" onClick={() => removeCharacter(i)}>✕</button>
                    )}
                  </div>
                ))}
                {characters.length < 4 && (
                  <button className="btn btn-outline btn-sm" onClick={addCharacter}>+ Add Character</button>
                )}
              </div>
            </div>

            {/* Theme */}
            <div className="form-group">
              <label className="label">💛 Theme / Moral Direction</label>
              <div className="theme-picker">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    className={`theme-option ${theme === t.value ? 'theme-option--active' : ''}`}
                    onClick={() => setTheme(t.value)}
                  >
                    <span className="theme-option__emoji">{t.emoji}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Length + Age Group Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="label">📏 Story Length</label>
                <div className="length-picker">
                  {STORY_LENGTHS.map((l) => (
                    <button
                      key={l.value}
                      className={`length-option ${length === l.value ? 'length-option--active' : ''}`}
                      onClick={() => setLength(l.value)}
                    >
                      <span className="length-option__emoji">{l.emoji}</span>
                      <span className="length-option__name">{l.label}</span>
                      <span className="length-option__time">{l.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="label">👶 Age Group</label>
                <select className="select" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                  {AGE_GROUPS.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
                <label className="label" style={{ marginTop: '1rem' }}>🌍 Language</label>
                <select className="select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              className="btn btn-primary btn-lg"
              onClick={handleGenerate}
              disabled={!topic.trim()}
              style={{ alignSelf: 'center', marginTop: '0.5rem' }}
            >
              🚀 Generate Story
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="card-static" style={{ marginBottom: '1.5rem' }}>
          <div className="loading-state">
            <div className="loading-state__stars">
              <span className="loading-state__star">⭐</span>
              <span className="loading-state__star">✨</span>
              <span className="loading-state__star">🌟</span>
            </div>
            <p className="loading-state__label">{loadingMessages[loadingMsg]}</p>
          </div>
        </div>
      )}

      {/* Story Output */}
      {story && !loading && (
        <div className="card-static story-output" style={{ marginBottom: '1.5rem' }}>
          <div className="story-output__toolbar">
            <button className="btn btn-blue btn-sm" onClick={() => isSpeaking ? stop() : speak(story.story)}>
              {isSpeaking ? '⏹ Stop' : '🔊 Read Aloud'}
            </button>
            <button className="btn btn-accent btn-sm" onClick={handleSave} disabled={saved}>
              {saved ? '✅ Saved!' : '💾 Save'}
            </button>
            <button className="btn btn-purple btn-sm" onClick={handleQuiz}>
              📝 Generate Quiz
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowContinue(!showContinue)}>
              ➕ Continue Story
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => { setStory(null); setMoral(null); setQuiz(null); setSaved(false); }}>
              🔄 New Story
            </button>
          </div>

          <p className="story-output__text">{story.story}</p>

          {moral && (
            <div className="moral-box">
              <div className="moral-box__title">💡 Moral Lesson</div>
              <p className="moral-box__text">{moral.moral || JSON.stringify(moral)}</p>
            </div>
          )}

          {/* Continuation Panel */}
          {showContinue && (
            <div className="card-static" style={{ marginTop: '1rem', background: 'var(--color-bg-soft)' }}>
              <label className="label">💬 What did the children suggest?</label>
              <input
                className="input"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="e.g. The bunny found a secret cave!"
              />
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: '0.75rem' }}
                onClick={handleContinue}
                disabled={continuing || !suggestion.trim()}
              >
                {continuing ? '⏳ Continuing…' : '✨ Continue'}
              </button>
            </div>
          )}

          {/* Quiz inline */}
          {quiz && quiz.questions && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>🎯 Quiz Time!</h3>
              {quiz.questions.map((q, i) => (
                <div key={i} className="card-static" style={{ marginBottom: '0.75rem', padding: '1rem' }}>
                  <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{i + 1}. {q.question}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {q.options.map((opt, j) => (
                      <span key={j} style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: j === q.correct ? 'var(--color-accent)' : 'transparent',
                        color: j === q.correct ? '#fff' : 'inherit',
                        fontWeight: j === q.correct ? 700 : 400,
                      }}>
                        {String.fromCharCode(65 + j)}. {opt}
                      </span>
                    ))}
                  </div>
                  {q.explanation && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-soft)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
