import React from 'react';

const ROLES = [
  'Athlete',
  'Coach',
  'Physiotherapist',
  'Sports Scientist',
  'Administrator'
];

export default function Navbar({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  user,
  onOpenAuth,
  onLogout
}) {
  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">⚡</div>
        <div>
          <h1 className="brand-title">Sports Injury Intelligence</h1>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>
            AI BIOMECHANICS & PREDICTIVE ANALYTICS (MILESTONES 1, 2 & 3)
          </span>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'athletes' ? 'active' : ''}`}
          onClick={() => setActiveTab('athletes')}
        >
          Athletes
        </button>
        <button
          className={`nav-tab ${activeTab === 'intelligence' ? 'active' : ''}`}
          onClick={() => setActiveTab('intelligence')}
        >
          Risk Intelligence
        </button>
        <button
          className={`nav-tab ${activeTab === 'team_heatmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('team_heatmap')}
        >
          Team Heatmap
        </button>
        <button
          className={`nav-tab ${activeTab === 'pose_studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('pose_studio')}
        >
          Pose Studio
        </button>
        <button
          className={`nav-tab ${activeTab === 'role_dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('role_dashboard')}
        >
          Role Views
        </button>
        <button
          className={`nav-tab ${activeTab === 'datasets' ? 'active' : ''}`}
          onClick={() => setActiveTab('datasets')}
        >
          Datasets
        </button>
        <button
          className={`nav-tab ${activeTab === 'architecture' ? 'active' : ''}`}
          onClick={() => setActiveTab('architecture')}
        >
          Architecture
        </button>
      </nav>

      <div className="nav-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role Switcher:</span>
          <select
            className="form-select"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <span className={`role-badge ${currentRole.replace(/\s+/g, '')}`}>
          ● {currentRole}
        </span>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {user.full_name}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={onOpenAuth}>
            Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
}
