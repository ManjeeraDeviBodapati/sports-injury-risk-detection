import React, { useState } from 'react';

const ROLES = [
  'Athlete',
  'Coach',
  'Physiotherapist',
  'Sports Scientist',
  'Administrator'
];

export default function AuthModal({ isOpen, onClose, onLoginSuccess, onShowToast }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Athlete');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const body = mode === 'login' 
        ? { email, password } 
        : { full_name: fullName, email, password, role };

      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      onLoginSuccess(data);
      onShowToast(`Successfully ${mode === 'login' ? 'signed in' : 'registered'} as ${data.user.full_name}!`);
      onClose();
    } catch (err) {
      onShowToast(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/auth/oauth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          token: `mock_oauth_token_${Date.now()}`,
          role: role
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'OAuth SSO failed');

      onLoginSuccess(data);
      onShowToast(`Signed in via ${provider.toUpperCase()} SSO as ${data.role}!`);
      onClose();
    } catch (err) {
      onShowToast(`OAuth Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem' }}>
            {mode === 'login' ? 'User Authentication' : 'Create System Account'}
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem', borderRadius: '8px' }}>
            <button
              style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: 'none', background: mode === 'login' ? 'var(--primary)' : 'transparent', color: mode === 'login' ? '#000' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button
              style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: 'none', background: mode === 'register' ? 'var(--primary)' : 'transparent', color: mode === 'register' ? '#000' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@sportsinjury.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Select System Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In with JWT' : 'Register Account'}
            </button>
          </form>

          <div style={{ margin: '1.5rem 0 1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem', position: 'relative' }}>
            <span style={{ background: 'var(--bg-card)', padding: '0 0.5rem' }}>OR SINGLE SIGN-ON (OAuth2)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => handleOAuth('google')}>
              🌐 Google SSO
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => handleOAuth('azure')}>
              🔷 Azure AD SSO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
