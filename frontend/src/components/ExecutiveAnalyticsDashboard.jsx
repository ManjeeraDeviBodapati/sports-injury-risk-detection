import React, { useState, useEffect } from 'react';

export default function ExecutiveAnalyticsDashboard({ onShowToast }) {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchKpis = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/analytics/executive-kpis')
      .then((res) => res.json())
      .then((data) => {
        setKpis(data);
        setLoading(false);
      })
      .catch((e) => {
        onShowToast(`Analytics Error: ${e.message}`);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  const handleDownloadCSV = (endpoint, filename) => {
    window.open(`http://127.0.0.1:8000${endpoint}`, '_blank');
    onShowToast(`Downloading dataset ${filename}...`);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Executive Analytics & Data Export Center</h2>
          <p className="section-subtitle">High-level platform KPIs, cohort health analytics, multi-format report exports, and system monitoring.</p>
        </div>

        <button className="btn btn-primary" onClick={fetchKpis}>
          🔄 Refresh KPIs
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading Executive Analytics...</div>
      ) : !kpis ? null : (
        <div>
          {/* Executive Stat Widgets */}
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.15)', color: 'var(--primary)' }}>🏆</div>
              <div>
                <div className="stat-val">{kpis.cohort_average_health_score}</div>
                <div className="stat-lbl">Cohort Health Score</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--emerald)' }}>🏃</div>
              <div>
                <div className="stat-val">{kpis.total_athletes}</div>
                <div className="stat-lbl">Athletes Monitored</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--purple)' }}>🦴</div>
              <div>
                <div className="stat-val">{kpis.total_pose_analyses}</div>
                <div className="stat-lbl">Pose Analyses Run</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--amber)' }}>📈</div>
              <div>
                <div className="stat-val">{kpis.assessment_completion_rate}</div>
                <div className="stat-lbl">Assessment Rate</div>
              </div>
            </div>
          </div>

          {/* Multi-Format Dataset Export Center */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>📥 Multi-Format Reports & Dataset Spreadsheet Exporter</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Export full platform data into downloadable CSV spreadsheets or generate printable PDF/HTML clinical reports.
            </p>

            <div className="grid-3">
              <div className="card" style={{ background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ color: '#fff' }}>Athletes Profile Dataset</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.4rem 0' }}>
                    CSV file containing physical attributes, sport domains, positions, and training loads.
                  </p>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '0.75rem' }}
                  onClick={() => handleDownloadCSV('/exports/athletes/csv', 'athletes_dataset.csv')}
                >
                  ⬇ Download Athletes CSV
                </button>
              </div>

              <div className="card" style={{ background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ color: '#fff' }}>Injury Risk Analytics Dataset</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.4rem 0' }}>
                    CSV spreadsheet of weighted risk scores, health index, and 6 category probabilities.
                  </p>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '0.75rem' }}
                  onClick={() => handleDownloadCSV('/exports/risk-reports/csv', 'risk_analytics.csv')}
                >
                  ⬇ Download Risk Analytics CSV
                </button>
              </div>

              <div className="card" style={{ background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ color: '#fff' }}>Pose & Biomechanics Dataset</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.4rem 0' }}>
                    CSV file of joint angles, knee valgus peaks, pelvic drop, trunk lean, and symmetry indices.
                  </p>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '0.75rem' }}
                  onClick={() => handleDownloadCSV('/exports/biomechanics/csv', 'pose_analytics.csv')}
                >
                  ⬇ Download Pose Analytics CSV
                </button>
              </div>
            </div>
          </div>

          {/* System Deployment & Infrastructure Status */}
          <div className="card">
            <h3 style={{ color: 'var(--emerald)', marginBottom: '0.75rem' }}>🐳 Docker & Production Deployment Status</h3>
            <div className="grid-3" style={{ fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Backend Container:</span>
                <div><strong style={{ color: 'var(--emerald)' }}>● FastAPI ASGI (Port 8000)</strong></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Frontend Container:</span>
                <div><strong style={{ color: 'var(--emerald)' }}>● React Nginx SPA (Port 5173/80)</strong></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Database Container:</span>
                <div><strong style={{ color: 'var(--emerald)' }}>● PostgreSQL 15 Volume Engine</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
