import React, { useState, useEffect } from 'react';

export default function BiomechanicsReportView({ analysisId, onClose, onShowToast }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!analysisId) return;
    setLoading(true);
    fetch(`http://127.0.0.1:8000/reports/biomechanics/${analysisId}`)
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((e) => {
        onShowToast(`Report Error: ${e.message}`);
        setLoading(false);
      });
  }, [analysisId]);

  if (!analysisId) return null;

  const handleExportHTML = () => {
    window.open(`http://127.0.0.1:8000/reports/biomechanics/${analysisId}/export`, '_blank');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog" style={{ maxWidth: '850px' }}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
              {report?.report_id || 'BIOMECHANICS REPORT'}
            </span>
            <h2 style={{ fontSize: '1.4rem' }}>Clinical Biomechanics Assessment Report</h2>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Generating Clinical Biomechanics Report...</div>
          ) : !report ? (
            <p>Report unavailable.</p>
          ) : (
            <div>
              {/* Header Details */}
              <div className="card" style={{ background: 'rgba(0,0,0,0.3)', marginBottom: '1.25rem' }}>
                <div className="grid-3" style={{ fontSize: '0.85rem' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Athlete Name:</span> <div><strong style={{ color: '#fff' }}>{report.athlete_name} ({report.athlete_code})</strong></div></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Activity Evaluated:</span> <div><strong style={{ color: 'var(--primary)' }}>{report.activity_type}</strong></div></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Assessment Date:</span> <div><strong style={{ color: '#fff' }}>{new Date(report.created_at).toLocaleDateString()}</strong></div></div>
                </div>
              </div>

              {/* Scorecard Widgets */}
              <div className="grid-4" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.15)', color: 'var(--primary)' }}>📊</div>
                  <div>
                    <div className="stat-val">{report.movement_quality_score}</div>
                    <div className="stat-lbl">Quality Score</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--purple)' }}>⚡</div>
                  <div>
                    <div className="stat-val">{report.biomechanical_efficiency_score}</div>
                    <div className="stat-lbl">Efficiency</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--emerald)' }}>⚖</div>
                  <div>
                    <div className="stat-val">{report.metrics?.symmetry_index_percent}%</div>
                    <div className="stat-lbl">Limb Symmetry</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(244,63,94,0.15)', color: 'var(--rose)' }}>📉</div>
                  <div>
                    <div className="stat-val">{report.metrics?.max_knee_valgus_deg}°</div>
                    <div className="stat-lbl">Peak Knee Valgus</div>
                  </div>
                </div>
              </div>

              {/* Measured Biomechanical Metrics Table */}
              <div className="card" style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Measured Kinematic & Joint Angle Ranges</h4>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Joint Metric</th>
                        <th>Measured Angle</th>
                        <th>Safety Benchmark</th>
                        <th>Evaluation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Peak Knee Valgus (Inward Drop)</td>
                        <td><strong>{report.metrics?.max_knee_valgus_deg}°</strong></td>
                        <td>≤ 10.0°</td>
                        <td>
                          <span style={{ color: (report.metrics?.max_knee_valgus_deg || 0) > 10 ? 'var(--rose)' : 'var(--emerald)' }}>
                            {(report.metrics?.max_knee_valgus_deg || 0) > 10 ? '● High Risk' : '✓ Normal'}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Hip Stability (Pelvic Tilt)</td>
                        <td><strong>{report.metrics?.max_hip_tilt_deg}°</strong></td>
                        <td>≤ 5.0°</td>
                        <td>
                          <span style={{ color: (report.metrics?.max_hip_tilt_deg || 0) > 5 ? 'var(--amber)' : 'var(--emerald)' }}>
                            {(report.metrics?.max_hip_tilt_deg || 0) > 5 ? '⚠ Mild Tilt' : '✓ Stable'}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Trunk Lateral Lean</td>
                        <td><strong>{report.metrics?.max_trunk_lean_deg}°</strong></td>
                        <td>≤ 8.0°</td>
                        <td>
                          <span style={{ color: (report.metrics?.max_trunk_lean_deg || 0) > 8 ? 'var(--amber)' : 'var(--emerald)' }}>
                            {(report.metrics?.max_trunk_lean_deg || 0) > 8 ? '⚠ Lean Detected' : '✓ Balanced'}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Left Knee Range of Motion (ROM)</td>
                        <td><strong>{report.metrics?.left_knee_rom?.rom}°</strong></td>
                        <td>60.0° - 140.0°</td>
                        <td><span style={{ color: 'var(--emerald)' }}>✓ Normal ROM</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detected Technique Deviations & Risk Clinical Findings */}
              <div className="card">
                <h4 style={{ color: 'var(--rose)', marginBottom: '0.75rem' }}>Clinical Technique Deviations & Risk Findings</h4>
                {!report.metrics?.technique_deviations || report.metrics.technique_deviations.length === 0 ? (
                  <p style={{ color: 'var(--emerald)', fontSize: '0.85rem' }}>✓ No clinical technique deviations detected during movement analysis.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {report.metrics.technique_deviations.map((dev, i) => (
                      <div key={i} className="card" style={{ background: 'rgba(244,63,94,0.05)', borderLeft: '4px solid var(--rose)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong style={{ color: 'var(--rose)' }}>{dev.code}</strong>
                          <span className="role-badge Administrator">{dev.severity} Severity</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#fff', margin: '0.3rem 0' }}>{dev.finding}</p>
                        <small style={{ color: 'var(--text-muted)' }}>Associated Clinical Risk: {dev.associated_risk}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handleExportHTML}>
            🖨 Export / Print HTML Clinical Report
          </button>
        </div>
      </div>
    </div>
  );
}
