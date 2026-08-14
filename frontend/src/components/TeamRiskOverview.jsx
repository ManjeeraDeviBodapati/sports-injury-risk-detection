import React, { useState, useEffect } from 'react';

export default function TeamRiskOverview({ onShowToast, onSelectAthlete }) {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTeamOverview = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/risk/team-overview')
      .then((res) => res.json())
      .then((data) => {
        setTeamData(data);
        setLoading(false);
      })
      .catch((e) => {
        onShowToast(`Team Overview Error: ${e.message}`);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTeamOverview();
  }, []);

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Coach & Squad Risk Heatmap Overview</h2>
          <p className="section-subtitle">Team-wide injury risk distribution, squad workload management, and high-risk alerts.</p>
        </div>

        <button className="btn btn-primary" onClick={fetchTeamOverview}>
          🔄 Refresh Team Heatmap
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading Team Risk Heatmap...</div>
      ) : !teamData ? null : (
        <div>
          {/* Risk Category Distribution Cards */}
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <div className="card" style={{ borderLeft: '4px solid var(--emerald)' }}>
              <span className="role-badge Physiotherapist">Low Risk</span>
              <h2 style={{ fontSize: '2rem', margin: '0.4rem 0 0.1rem', color: 'var(--emerald)' }}>
                {teamData.risk_distribution?.['Low Risk'] || 0} Athletes
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score 0.0 - 25.0 (Optimal)</span>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--amber)' }}>
              <span className="role-badge Coach">Moderate Risk</span>
              <h2 style={{ fontSize: '2rem', margin: '0.4rem 0 0.1rem', color: 'var(--amber)' }}>
                {teamData.risk_distribution?.['Moderate Risk'] || 0} Athletes
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score 25.1 - 50.0 (Monitor)</span>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--rose)' }}>
              <span className="role-badge Administrator">High Risk</span>
              <h2 style={{ fontSize: '2rem', margin: '0.4rem 0 0.1rem', color: 'var(--rose)' }}>
                {teamData.risk_distribution?.['High Risk'] || 0} Athletes
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score 50.1 - 75.0 (Modify Load)</span>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #991b1b' }}>
              <span className="role-badge Administrator">Critical Risk</span>
              <h2 style={{ fontSize: '2rem', margin: '0.4rem 0 0.1rem', color: '#f43f5e' }}>
                {teamData.risk_distribution?.['Critical Risk'] || 0} Athletes
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score 75.1 - 100.0 (Rest / Rehab)</span>
            </div>
          </div>

          {/* Squad Heatmap Table */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Squad Risk Assessment Matrix</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Athlete Name</th>
                    <th>Sport & Position</th>
                    <th>Training Load</th>
                    <th>Weighted Risk Score</th>
                    <th>Risk Category</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teamData.athletes.map((ath) => {
                    const isHigh = ath.risk_category === 'High Risk' || ath.risk_category === 'Critical Risk';
                    return (
                      <tr key={ath.athlete_id} style={{ background: isHigh ? 'rgba(244,63,94,0.04)' : 'transparent' }}>
                        <td><strong style={{ color: 'var(--primary)' }}>{ath.athlete_code}</strong></td>
                        <td><strong style={{ color: '#fff' }}>{ath.full_name}</strong></td>
                        <td>{ath.sport_type} ({ath.position})</td>
                        <td><span className="role-badge Athlete">{ath.training_load}</span></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong style={{ color: isHigh ? 'var(--rose)' : 'var(--emerald)', fontSize: '1.05rem' }}>
                              {ath.risk_score}
                            </strong>
                            <div className="progress-bar-bg" style={{ width: '80px' }}>
                              <div className="progress-bar-fill" style={{ width: `${ath.risk_score}%`, background: isHigh ? 'var(--rose)' : 'var(--emerald)' }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge ${ath.risk_category === 'Low Risk' ? 'Physiotherapist' : ath.risk_category === 'Moderate Risk' ? 'Coach' : 'Administrator'}`}>
                            ● {ath.risk_category}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => onSelectAthlete(ath)}>
                            View Analytics
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
