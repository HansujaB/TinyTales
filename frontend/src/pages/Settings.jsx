import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { updatePreferences, getCurrentUser } from '../api/authApi';
import { AGE_GROUPS, LANGUAGES, THEMES } from '../lib/constants';

export default function Settings() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [defaultLanguage, setDefaultLanguage] = useState('English');
  const [ageGroup, setAgeGroup] = useState('3-5');
  const [defaultTheme, setDefaultTheme] = useState('kindness');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(({ data }) => {
        setProfile(data);
        setName(data.name || '');
        setSchool(data.school || '');
        setDefaultLanguage(data.preferences?.defaultLanguage || 'English');
        setAgeGroup(data.preferences?.ageGroup || '3-5');
        setDefaultTheme(data.preferences?.defaultTheme || 'kindness');
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updatePreferences({
        name,
        school,
        defaultLanguage,
        ageGroup,
        defaultTheme,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page container page-enter">
      <h1 className="settings-page__title">⚙️ Settings</h1>

      {/* Profile */}
      <div className="card-static settings-section">
        <h3 className="settings-section__title">👤 Profile</h3>
        <div className="settings-section__body">
          {user?.photoURL && (
            <img className="profile-avatar-lg" src={user.photoURL} alt={user.displayName} />
          )}
          <div className="form-group">
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="form-group">
            <label className="label">School / Organization</label>
            <input className="input" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Sunshine Preschool" />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card-static settings-section">
        <h3 className="settings-section__title">🎨 Preferences</h3>
        <div className="settings-section__body">
          <div className="form-row">
            <div className="form-group">
              <label className="label">Default Language</label>
              <select className="select" value={defaultLanguage} onChange={(e) => setDefaultLanguage(e.target.value)}>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Age Group</label>
              <select className="select" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                {AGE_GROUPS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="label">Default Theme</label>
            <select className="select" value={defaultTheme} onChange={(e) => setDefaultTheme(e.target.value)}>
              {THEMES.map((t) => (
                <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? '⏳ Saving…' : saved ? '✅ Saved!' : '💾 Save Changes'}
        </button>
        <button className="btn btn-danger" onClick={logout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
