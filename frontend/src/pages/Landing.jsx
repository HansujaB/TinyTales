import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const features = [
  { icon: '✨', title: 'AI Story Generation', desc: 'Type a simple idea and our AI weaves a magical, age-appropriate tale in seconds.' },
  { icon: '💡', title: 'Moral Lessons', desc: 'Every story comes with embedded life lessons — values taught through adventure.' },
  { icon: '🎯', title: 'Interactive Quizzes', desc: 'Auto-generated comprehension quizzes with fun animations and confetti.' },
  { icon: '🔊', title: 'Read Aloud', desc: 'Built-in text-to-speech brings stories to life — perfect for circle time!' },
];

const steps = [
  { num: '1', emoji: '💬', title: 'Set the Stage', desc: 'Pick a topic, characters, theme, and age group for your story.' },
  { num: '2', emoji: '🤖', title: 'AI Creates Magic', desc: 'Our AI agents craft a unique, child-safe story with morals built in.' },
  { num: '3', emoji: '🎉', title: 'Read, Quiz & Save', desc: 'Listen aloud, run a quiz, save to your library, and export as PDF.' },
];

export default function Landing() {
  const { isAuthenticated, login } = useAuth();

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero__decorations">
          <div className="hero__shape hero__shape--1" />
          <div className="hero__shape hero__shape--2" />
          <div className="hero__shape hero__shape--3" />
          <div className="hero__shape hero__shape--4" />
        </div>
        <div className="container hero__content">
          <span className="hero__emoji">📚</span>
          <h1 className="hero__title">
            Where Little Imaginations<br />
            <span>Come to Life ✨</span>
          </h1>
          <p className="hero__subtitle">
            TinyTales is an AI‑powered storytelling companion for preschool teachers.
            Generate magical stories, moral lessons, quizzes, and more — all in one place.
          </p>
          <div className="hero__cta">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <button className="btn btn-secondary btn-lg">🚀 Go to Dashboard</button>
              </Link>
            ) : (
              <button className="btn btn-secondary btn-lg" onClick={login}>
                🚀 Start Free
              </button>
            )}
            <a href="#how-it-works">
              <button className="btn btn-outline btn-lg">How it works ↓</button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <p className="section-label">🌟 What TinyTales Offers</p>
          <h2 className="section-title">Everything a preschool teacher needs</h2>
          <p className="section-sub">From story creation to audio playback — everything in one magical platform.</p>
          <div className="features__grid stagger">
            {features.map((f) => (
              <div key={f.title} className="feature-card" style={{ animation: 'fadeUp 0.5s ease both' }}>
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <p className="section-label">🪄 Simple & Magical</p>
          <h2 className="section-title">How TinyTales Works</h2>
          <p className="section-sub" style={{ color: 'var(--color-text-soft)' }}>Three simple steps to spark a child's imagination.</p>
          <div className="steps-grid">
            {steps.map((s) => (
              <div key={s.num} className="step-card">
                <div className="step__num">{s.num}</div>
                <span className="step__emoji">{s.emoji}</span>
                <div className="step__title">{s.title}</div>
                <div className="step__desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container">
          <h2>Ready to tell your first tale? 🌈</h2>
          <p>Join educators already creating magical stories with TinyTales.</p>
          {isAuthenticated ? (
            <Link to="/dashboard">
              <button className="btn btn-secondary btn-lg">Start Creating ✨</button>
            </Link>
          ) : (
            <button className="btn btn-secondary btn-lg" onClick={login}>
              Get Started Free 🚀
            </button>
          )}
        </div>
      </section>
    </>
  );
}
