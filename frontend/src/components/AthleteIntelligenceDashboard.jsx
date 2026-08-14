import React, { useState, useEffect } from 'react';

export default function AthleteIntelligenceDashboard({ onShowToast }) {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState('');
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/athletes/')
      .then((res) => res.json())
      .then((data) => {
        setAthletes(data);
        if (data.length > 0) {
          setSelectedAthleteId(data[0].id);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const fetchAthleteRisk = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/risk/athlete/${id}`);
      if (!res.ok) throw new Error('Failed to fetch risk assessment');
      const data = await res.json();
      setRiskData(data);
    } catch (err) {
      onShowToast(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const runReassessment = async () => {
    if (!selectedAthleteId) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/risk/assess/${selectedAthleteId}`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Reassessment failed');
      const data = await res.json();
      setRiskData(data);
      onShowToast('Predictive Risk Assessment Re-Calculated Successfully!');
    } catch (err) {
      onShowToast(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAthleteId) {
      fetchAthleteRisk(selectedAthleteId);
    }
  }, [selectedAthleteId]);

  const selectedAthleteObj = athletes.find((a) => a.id === parseInt(selectedAthleteId));

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Athlete Intelligence & Predictive Risk Engine</h2>
          <p className="section-subtitle">Multi-factor weighted risk scoring, specific injury category probabilities, and corrective exercise workflows.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            className="form-select"
            value={selectedAthleteId}
            onChange={(e) => setSelectedAthleteId(e.target.value)}
          >
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.full_name} ({a.athlete_code})
              </option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={runReassessment} disabled={loading}>
            ⚡ Run Predictive Risk Assessment
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Calculating Predictive Injury Risk Scores...</div>
      ) : !riskData ? null : (
        <div>
          {/* Executive Risk Scorecard & Weighted Formula */}
          <div className="grid-2" style={{ marginBottom: '1.5rem', alignItems: 'stretch' }}>
            {/* Left: Score Gauge */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Overall Injury Risk Score
              </span>
              <h1 style={{
                fontSize: '3.5rem',
                margin: '0.5rem 0',
                color: riskData.risk_category === 'Critical Risk' || riskData.risk_category === 'High Risk' ? 'var(--rose)' : riskData.risk_category === 'Moderate Risk' ? 'var(--amber)' : 'var(--emerald)'
              }}>
                {riskData.overall_risk_score} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ 100</span>
              </h1>
              <div>
                <span className={`role-badge ${riskData.risk_category === 'Low Risk' ? 'Physiotherapist' : riskData.risk_category === 'Moderate Risk' ? 'Coach' : 'Administrator'}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
                  ● {riskData.risk_category}
                </span>
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Overall Health Score: <strong style={{ color: 'var(--emerald)' }}>{riskData.overall_health_score} / 100</strong>
              </div>
            </div>

            {/* Right: 5-Component Weighted Breakdown */}
            <div className="card">
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                5-Component Weighted Risk Scoring Formula
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <span>1. Biomechanical Deviations (35% Weight):</span>
                    <strong>{riskData.weighted_scores_json?.biomechanical_deviations_weighted || 0} pts</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${(riskData.weighted_scores_json?.biomechanical_deviations_weighted / 35.0) * 100}%`, background: 'var(--rose)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <span>2. Historical Injury Factors (20% Weight):</span>
                    <strong>{riskData.weighted_scores_json?.historical_injury_weighted || 0} pts</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${(riskData.weighted_scores_json?.historical_injury_weighted / 20.0) * 100}%`, background: 'var(--amber)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <span>3. Movement Asymmetry (20% Weight):</span>
                    <strong>{riskData.weighted_scores_json?.movement_asymmetry_weighted || 0} pts</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${(riskData.weighted_scores_json?.movement_asymmetry_weighted / 20.0) * 100}%`, background: 'var(--purple)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <span>4. Training Load Indicators (15% Weight):</span>
                    <strong>{riskData.weighted_scores_json?.training_load_weighted || 0} pts</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${(riskData.weighted_scores_json?.training_load_weighted / 15.0) * 100}%`, background: 'var(--primary)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <span>5. Fatigue Indicators (10% Weight):</span>
                    <strong>{riskData.weighted_scores_json?.fatigue_indicators_weighted || 0} pts</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${(riskData.weighted_scores_json?.fatigue_indicators_weighted / 10.0) * 100}%`, background: 'var(--emerald)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Specific Injury Category Probability Cards */}
          <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.25rem' }}>
            6 Specific Injury Category Risk Probabilities
          </h3>

          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div className="card" style={{ borderTop: '4px solid var(--rose)' }}>
              <span className="role-badge Administrator">Knee Joint</span>
              <h4 style={{ margin: '0.4rem 0 0.2rem', color: '#fff' }}>ACL Injury Risk</h4>
              <h2 style={{ fontSize: '1.8rem', color: riskData.acl_risk_percent > 40 ? 'var(--rose)' : 'var(--emerald)' }}>
                {riskData.acl_risk_percent}%
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Evaluates medial knee valgus collapse & quad symmetry.</p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--amber)' }}>
              <span className="role-badge Coach">Posterior Thigh</span>
              <h4 style={{ margin: '0.4rem 0 0.2rem', color: '#fff' }}>Hamstring Strain Risk</h4>
              <h2 style={{ fontSize: '1.8rem', color: riskData.hamstring_risk_percent > 40 ? 'var(--amber)' : 'var(--emerald)' }}>
                {riskData.hamstring_risk_percent}%
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Evaluates hamstring flexibility & high-speed decel load.</p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
              <span className="role-badge Athlete">Distal Joint</span>
              <h4 style={{ margin: '0.4rem 0 0.2rem', color: '#fff' }}>Ankle Sprain Risk</h4>
              <h2 style={{ fontSize: '1.8rem', color: riskData.ankle_risk_percent > 40 ? 'var(--primary)' : 'var(--emerald)' }}>
                {riskData.ankle_risk_percent}%
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Evaluates pelvic tilt & lateral landing stability.</p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--purple)' }}>
              <span className="role-badge SportsScientist">Upper Body</span>
              <h4 style={{ margin: '0.4rem 0 0.2rem', color: '#fff' }}>Shoulder Injury Risk</h4>
              <h2 style={{ fontSize: '1.8rem', color: riskData.shoulder_risk_percent > 40 ? 'var(--purple)' : 'var(--emerald)' }}>
                {riskData.shoulder_risk_percent}%
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Evaluates scapular dyskinesia in overhead throwing.</p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--rose)' }}>
              <span className="role-badge Administrator">Spinal Axis</span>
              <h4 style={{ margin: '0.4rem 0 0.2rem', color: '#fff' }}>Lower Back Injury Risk</h4>
              <h2 style={{ fontSize: '1.8rem', color: riskData.lower_back_risk_percent > 40 ? 'var(--rose)' : 'var(--emerald)' }}>
                {riskData.lower_back_risk_percent}%
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Evaluates trunk lateral lean & core anti-rotational stiffness.</p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--amber)' }}>
              <span className="role-badge Physiotherapist">Systemic Fatigue</span>
              <h4 style={{ margin: '0.4rem 0 0.2rem', color: '#fff' }}>Overuse Injury Risk</h4>
              <h2 style={{ fontSize: '1.8rem', color: riskData.overuse_risk_percent > 40 ? 'var(--amber)' : 'var(--emerald)' }}>
                {riskData.overuse_risk_percent}%
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Evaluates consecutive high training load & fatigue spikes.</p>
            </div>
          </div>

          {/* Corrective Exercise Recommendations */}
          <div className="card">
            <h3 style={{ color: 'var(--emerald)', marginBottom: '1rem', fontSize: '1.2rem' }}>
              Personalized Corrective Exercise & Recovery Workflows ({riskData.recommendations?.length || 0})
            </h3>

            {!riskData.recommendations || riskData.recommendations.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No corrective protocols required at this time.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {riskData.recommendations.map((rec) => (
                  <div key={rec.id} className="card" style={{ background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid var(--emerald)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="role-badge Physiotherapist">{rec.category}</span>
                      <span className={`role-badge ${rec.priority === 'Critical' || rec.priority === 'High' ? 'Administrator' : 'Coach'}`}>
                        {rec.priority} Priority
                      </span>
                    </div>

                    <h4 style={{ color: '#fff', margin: '0.4rem 0 0.2rem' }}>{rec.title}</h4>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      <strong>Exercise:</strong> {rec.exercise}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginTop: '0.2rem' }}>
                      <strong>Dosage:</strong> {rec.dosage}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                      Focus: {rec.focus}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
