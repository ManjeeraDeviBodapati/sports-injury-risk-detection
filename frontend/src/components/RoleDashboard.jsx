import React, { useState } from 'react';

export default function RoleDashboard({ currentRole }) {
  const [selectedRoleView, setSelectedRoleView] = useState(currentRole);

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Role-Based Intelligence Dashboards</h2>
          <p className="section-subtitle">Tailored views for Coaches, Physiotherapists, Sports Scientists, and Administrators.</p>
        </div>

        {/* Role View Switcher */}
        <div className="nav-tabs">
          {['Coach', 'Physiotherapist', 'Sports Scientist', 'Administrator'].map((r) => (
            <button
              key={r}
              className={`nav-tab ${selectedRoleView === r ? 'active' : ''}`}
              onClick={() => setSelectedRoleView(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Coach Dashboard */}
      {selectedRoleView === 'Coach' && (
        <div>
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div className="card">
              <span className="role-badge Coach">Team Squad Overview</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0.2rem', color: '#fff' }}>24 Athletes</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active squad members under monitoring</p>
            </div>
            <div className="card">
              <span className="role-badge Athlete">Overall Squad Health</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0.2rem', color: 'var(--emerald)' }}>88.4 / 100</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Low overall squad injury risk</p>
            </div>
            <div className="card">
              <span className="role-badge Administrator">High-Risk Warnings</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0.2rem', color: 'var(--rose)' }}>2 Athletes</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Require workload reduction</p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Coach Recommendations & Training Load Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="card" style={{ background: 'rgba(244,63,94,0.05)', borderLeft: '4px solid var(--rose)' }}>
                <strong style={{ color: 'var(--rose)' }}>⚠ High Risk Alert: Marcus Rashford (ATH-1001)</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Post-ACL rehab. High training load detected. Recommended 30% reduction in high-speed decel drills.
                </p>
              </div>
              <div className="card" style={{ background: 'rgba(245,158,11,0.05)', borderLeft: '4px solid var(--amber)' }}>
                <strong style={{ color: 'var(--amber)' }}>⚠ Moderate Risk Warning: Kobe Bryant (ATH-1003)</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Patellar tendonitis strain. Limit jump takeoff repetitions in upcoming tactical scrimmage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Physiotherapist Dashboard */}
      {selectedRoleView === 'Physiotherapist' && (
        <div>
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div className="card">
              <span className="role-badge Physiotherapist">Active Rehab Queue</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0.2rem', color: '#fff' }}>3 Athletes</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Undergoing active physical therapy</p>
            </div>
            <div className="card">
              <span className="role-badge Athlete">Symmetry Improvement</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0.2rem', color: 'var(--emerald)' }}>+14.2%</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average quad strength restoration</p>
            </div>
            <div className="card">
              <span className="role-badge Coach">Pending Assessments</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0.2rem', color: 'var(--amber)' }}>5 Scheduled</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Functional Movement Screenings</p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--emerald)' }}>Physiotherapy Rehabilitation Tracker</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Athlete</th>
                    <th>Injury Case</th>
                    <th>Affected Joint</th>
                    <th>Rehab Phase</th>
                    <th>Recovery Progress</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Marcus Rashford</strong> (ATH-1001)</td>
                    <td>ACL Reconstruction</td>
                    <td>Left Knee</td>
                    <td>Phase 3 (Neuromuscular Control)</td>
                    <td>
                      <div className="progress-bar-bg" style={{ width: '120px' }}>
                        <div className="progress-bar-fill" style={{ width: '65%', background: 'var(--emerald)' }} />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Elena Rostova</strong> (ATH-1002)</td>
                    <td>Lateral Ankle Sprain</td>
                    <td>Right Ankle</td>
                    <td>Phase 2 (Mobility & Balance)</td>
                    <td>
                      <div className="progress-bar-bg" style={{ width: '120px' }}>
                        <div className="progress-bar-fill" style={{ width: '80%', background: 'var(--emerald)' }} />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Sports Scientist Dashboard */}
      {selectedRoleView === 'Sports Scientist' && (
        <div>
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <div className="card">
              <span className="role-badge SportsScientist">Knee Valgus Peak</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0.2rem', color: 'var(--rose)' }}>14.8°</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Avg landing inward deviation</p>
            </div>
            <div className="card">
              <span className="role-badge SportsScientist">Hip Stability Index</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0.2rem', color: 'var(--emerald)' }}>86.5 / 100</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pelvic drop containment</p>
            </div>
            <div className="card">
              <span className="role-badge SportsScientist">Trunk Lean Symmetry</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0.2rem', color: 'var(--primary)' }}>92.1%</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lateral spine balance</p>
            </div>
            <div className="card">
              <span className="role-badge SportsScientist">Stride Length Variance</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0.2rem', color: 'var(--purple)' }}>3.4 cm</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gait symmetry tolerance</p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--purple)' }}>Biomechanical Metrics & Motion Intelligence Pipeline</h3>
            <div className="grid-2">
              <div className="card" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <h4>Key Biomechanical Indicators Evaluated</h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.8', marginTop: '0.5rem' }}>
                  <li><strong>Knee Valgus Angle:</strong> Measures medial knee collapse during landing and cutting.</li>
                  <li><strong>Hip Stability:</strong> Tracks contralateral pelvic drop during single-leg stance.</li>
                  <li><strong>Trunk Lateral Lean:</strong> Evaluates compensation strategies in jump takeoffs.</li>
                  <li><strong>Landing Mechanics:</strong> Ground reaction force asymmetry estimation.</li>
                </ul>
              </div>
              <div className="card" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <h4>AI / ML Predictive Model Metrics</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.8', marginTop: '0.5rem' }}>
                  <div>Pose Estimation Precision: <strong style={{ color: 'var(--emerald)' }}>94.6% mAP</strong></div>
                  <div>ACL Injury Risk AUC Score: <strong style={{ color: 'var(--primary)' }}>0.912</strong></div>
                  <div>Anomaly Detection Autoencoder Loss: <strong style={{ color: 'var(--purple)' }}>0.0142</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Administrator Dashboard */}
      {selectedRoleView === 'Administrator' && (
        <div>
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div className="card">
              <span className="role-badge Administrator">Registered Accounts</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0.2rem', color: '#fff' }}>5 Accounts</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Covering all 5 system roles</p>
            </div>
            <div className="card">
              <span className="role-badge Athlete">Database Engine</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0.2rem', color: 'var(--primary)' }}>SQLite / Postgres</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ORM tables auto-initialized</p>
            </div>
            <div className="card">
              <span className="role-badge Coach">API Server Status</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0.2rem', color: 'var(--emerald)' }}>200 OK (FastAPI)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CORS & JWT Bearer Active</p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--rose)' }}>System User Accounts Management</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Assigned Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#1</td>
                    <td>Admin User</td>
                    <td>admin@sportsinjury.org</td>
                    <td><span className="role-badge Administrator">Administrator</span></td>
                    <td><span style={{ color: 'var(--emerald)' }}>● Active</span></td>
                  </tr>
                  <tr>
                    <td>#2</td>
                    <td>Head Coach John</td>
                    <td>coach@sportsinjury.org</td>
                    <td><span className="role-badge Coach">Coach</span></td>
                    <td><span style={{ color: 'var(--emerald)' }}>● Active</span></td>
                  </tr>
                  <tr>
                    <td>#3</td>
                    <td>Dr. Sarah (Physio)</td>
                    <td>physio@sportsinjury.org</td>
                    <td><span className="role-badge Physiotherapist">Physiotherapist</span></td>
                    <td><span style={{ color: 'var(--emerald)' }}>● Active</span></td>
                  </tr>
                  <tr>
                    <td>#4</td>
                    <td>Dr. Alex (Scientist)</td>
                    <td>scientist@sportsinjury.org</td>
                    <td><span className="role-badge SportsScientist">Sports Scientist</span></td>
                    <td><span style={{ color: 'var(--emerald)' }}>● Active</span></td>
                  </tr>
                  <tr>
                    <td>#5</td>
                    <td>Alex Morgan</td>
                    <td>athlete@sportsinjury.org</td>
                    <td><span className="role-badge Athlete">Athlete</span></td>
                    <td><span style={{ color: 'var(--emerald)' }}>● Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
