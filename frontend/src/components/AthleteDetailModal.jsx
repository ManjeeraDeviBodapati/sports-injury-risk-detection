import React, { useState } from 'react';

export default function AthleteDetailModal({ athlete, onClose, onRefresh, onShowToast }) {
  const [activeTab, setActiveTab] = useState('assessments'); // 'assessments', 'injuries', 'risk_factors'
  const [showAddInjury, setShowAddInjury] = useState(false);
  const [showAddAssessment, setShowAddAssessment] = useState(false);

  // Injury Form
  const [injuryName, setInjuryName] = useState('');
  const [affectedBodyPart, setAffectedBodyPart] = useState('');
  const [injuryDate, setInjuryDate] = useState(new Date().toISOString().split('T')[0]);
  const [recoveryStatus, setRecoveryStatus] = useState('Rehab In Progress');
  const [severity, setSeverity] = useState('Moderate');
  const [injuryNotes, setInjuryNotes] = useState('');

  // Assessment Form
  const [flexibility, setFlexibility] = useState(75);
  const [strength, setStrength] = useState(80);
  const [endurance, setEndurance] = useState(78);
  const [assessmentNotes, setAssessmentNotes] = useState('');
  const [assessedBy, setAssessedBy] = useState('Dr. Sarah (Physio)');

  if (!athlete) return null;

  const handleAddInjury = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://127.0.0.1:8000/athletes/${athlete.id}/injuries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          injury_name: injuryName,
          affected_body_part: affectedBodyPart,
          injury_date: injuryDate,
          recovery_status: recoveryStatus,
          severity,
          notes: injuryNotes
        })
      });

      if (!res.ok) throw new Error('Failed to log injury record');
      onShowToast(`Injury record '${injuryName}' added successfully!`);
      setShowAddInjury(false);
      onRefresh();
    } catch (err) {
      onShowToast(`Error: ${err.message}`);
    }
  };

  const handleAddAssessment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://127.0.0.1:8000/athletes/${athlete.id}/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessment_date: new Date().toISOString().split('T')[0],
          flexibility_score: parseFloat(flexibility),
          strength_score: parseFloat(strength),
          endurance_score: parseFloat(endurance),
          movement_screening_notes: assessmentNotes,
          assessed_by: assessedBy
        })
      });

      if (!res.ok) throw new Error('Failed to record physical assessment');
      onShowToast('Physical assessment recorded successfully!');
      setShowAddAssessment(false);
      onRefresh();
    } catch (err) {
      onShowToast(`Error: ${err.message}`);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
              {athlete.athlete_code}
            </span>
            <h2 style={{ fontSize: '1.4rem' }}>{athlete.full_name}</h2>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Athlete Overview Box */}
          <div className="card" style={{ background: 'rgba(0,0,0,0.3)', marginBottom: '1.5rem' }}>
            <div className="grid-4" style={{ gap: '1rem', fontSize: '0.9rem' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Sport Domain:</span> <div><strong style={{ color: '#fff' }}>{athlete.sport_type}</strong></div></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Position:</span> <div><strong style={{ color: '#fff' }}>{athlete.position}</strong></div></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Age / Ht / Wt:</span> <div><strong style={{ color: '#fff' }}>{athlete.age}y / {athlete.height}cm / {athlete.weight}kg</strong></div></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Training Load:</span> <div><span className="role-badge Athlete">{athlete.training_load}</span></div></div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', pb: '0.5rem' }}>
            <button
              className={`nav-tab ${activeTab === 'assessments' ? 'active' : ''}`}
              onClick={() => setActiveTab('assessments')}
            >
              Physical Assessments ({athlete.assessments ? athlete.assessments.length : 0})
            </button>
            <button
              className={`nav-tab ${activeTab === 'injuries' ? 'active' : ''}`}
              onClick={() => setActiveTab('injuries')}
            >
              Injury History ({athlete.injury_history ? athlete.injury_history.length : 0})
            </button>
            <button
              className={`nav-tab ${activeTab === 'risk_factors' ? 'active' : ''}`}
              onClick={() => setActiveTab('risk_factors')}
            >
              Biomechanical Risk Weighting
            </button>
          </div>

          {/* Tab 1: Physical Assessments */}
          {activeTab === 'assessments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--primary)' }}>Physical & Functional Assessment Records</h4>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddAssessment(!showAddAssessment)}>
                  {showAddAssessment ? 'Cancel' : '+ Record New Assessment'}
                </button>
              </div>

              {showAddAssessment && (
                <form onSubmit={handleAddAssessment} className="card" style={{ marginBottom: '1rem', background: 'rgba(6, 182, 212, 0.05)' }}>
                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Flexibility (0-100)</label>
                      <input type="number" className="form-input" value={flexibility} onChange={(e) => setFlexibility(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Strength (0-100)</label>
                      <input type="number" className="form-input" value={strength} onChange={(e) => setStrength(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Endurance (0-100)</label>
                      <input type="number" className="form-input" value={endurance} onChange={(e) => setEndurance(e.target.value)} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Evaluator Specialist</label>
                    <input type="text" className="form-input" value={assessedBy} onChange={(e) => setAssessedBy(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Movement Screening Notes</label>
                    <textarea className="form-textarea" rows="2" placeholder="Functional movement screening notes (e.g. Valgus angle drop)" value={assessmentNotes} onChange={(e) => setAssessmentNotes(e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm">Save Assessment Record</button>
                </form>
              )}

              {!athlete.assessments || athlete.assessments.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No physical assessment records logged yet.</p>
              ) : (
                athlete.assessments.map((ass) => (
                  <div key={ass.id} className="card" style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date: <strong style={{ color: '#fff' }}>{ass.assessment_date}</strong></span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--emerald)' }}>Evaluated by: {ass.assessed_by}</span>
                    </div>

                    <div className="grid-3" style={{ margin: '0.75rem 0' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                          <span>Flexibility:</span> <strong>{ass.flexibility_score}%</strong>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${ass.flexibility_score}%`, background: 'var(--primary)' }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                          <span>Strength:</span> <strong>{ass.strength_score}%</strong>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${ass.strength_score}%`, background: 'var(--purple)' }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                          <span>Endurance:</span> <strong>{ass.endurance_score}%</strong>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${ass.endurance_score}%`, background: 'var(--emerald)' }} />
                        </div>
                      </div>
                    </div>

                    {ass.movement_screening_notes && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.5rem' }}>
                        "{ass.movement_screening_notes}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Injury History */}
          {activeTab === 'injuries' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--rose)' }}>Historical & Active Injury Logs</h4>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddInjury(!showAddInjury)}>
                  {showAddInjury ? 'Cancel' : '+ Log Injury Record'}
                </button>
              </div>

              {showAddInjury && (
                <form onSubmit={handleAddInjury} className="card" style={{ marginBottom: '1rem', background: 'rgba(244, 63, 94, 0.05)' }}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Injury Title</label>
                      <input type="text" className="form-input" placeholder="e.g. ACL Tear, Ankle Sprain" value={injuryName} onChange={(e) => setInjuryName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Affected Body Part</label>
                      <input type="text" className="form-input" placeholder="e.g. Left Knee, Right Ankle" value={affectedBodyPart} onChange={(e) => setAffectedBodyPart(e.target.value)} required />
                    </div>
                  </div>
                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Injury Date</label>
                      <input type="date" className="form-input" value={injuryDate} onChange={(e) => setInjuryDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Recovery Status</label>
                      <select className="form-select" value={recoveryStatus} onChange={(e) => setRecoveryStatus(e.target.value)}>
                        <option value="Rehab In Progress">Rehab In Progress</option>
                        <option value="Active Pain">Active Pain</option>
                        <option value="Fully Recovered">Fully Recovered</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Severity</label>
                      <select className="form-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Clinical / Rehab Notes</label>
                    <textarea className="form-textarea" rows="2" placeholder="Rehab progress notes or surgical history..." value={injuryNotes} onChange={(e) => setInjuryNotes(e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm">Save Injury Record</button>
                </form>
              )}

              {!athlete.injury_history || athlete.injury_history.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No historical injuries reported for this athlete.</p>
              ) : (
                athlete.injury_history.map((inj) => (
                  <div key={inj.id} className="card" style={{ marginBottom: '0.75rem', borderLeft: `4px solid ${inj.recovery_status === 'Fully Recovered' ? 'var(--emerald)' : 'var(--rose)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ color: '#fff' }}>{inj.injury_name}</h4>
                      <span className={`role-badge ${inj.recovery_status === 'Fully Recovered' ? 'Physiotherapist' : 'Administrator'}`}>
                        {inj.recovery_status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.3rem 0' }}>
                      <span>Body Part: <strong style={{ color: '#fff' }}>{inj.affected_body_part}</strong></span> | <span>Date: {inj.injury_date}</span> | <span>Severity: <strong style={{ color: 'var(--amber)' }}>{inj.severity}</strong></span>
                    </div>
                    {inj.notes && <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.5rem' }}>{inj.notes}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Risk Model Weighting */}
          {activeTab === 'risk_factors' && (
            <div>
              <h4 style={{ color: 'var(--amber)', marginBottom: '1rem' }}>Weighted Injury Risk Scoring Model</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Calculated dynamically using the platform's multi-factor biomechanical intelligence formula:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <span>Biomechanical Deviations (Knee Valgus, Trunk Lean):</span>
                    <strong>35% Weight</strong>
                  </div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '35%', background: 'var(--rose)' }} /></div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <span>Historical Injury Factors (Prior ACL / Ankle Sprains):</span>
                    <strong>20% Weight</strong>
                  </div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '20%', background: 'var(--amber)' }} /></div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <span>Movement Asymmetry (Single-leg Landing Diff):</span>
                    <strong>20% Weight</strong>
                  </div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '20%', background: 'var(--purple)' }} /></div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <span>Training Load Indicators (Volume & Intensity):</span>
                    <strong>15% Weight</strong>
                  </div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '15%', background: 'var(--primary)' }} /></div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <span>Fatigue Indicators (Deceleration / Power Decline):</span>
                    <strong>10% Weight</strong>
                  </div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '10%', background: 'var(--emerald)' }} /></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
