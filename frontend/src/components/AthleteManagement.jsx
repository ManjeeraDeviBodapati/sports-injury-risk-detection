import React, { useState, useEffect } from 'react';

export default function AthleteManagement({ onSelectAthlete, onShowToast }) {
  const [athletes, setAthletes] = useState([]);
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [loadFilter, setLoadFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form fields for registering athlete
  const [fullName, setFullName] = useState('');
  const [sportType, setSportType] = useState('Football');
  const [position, setPosition] = useState('Forward');
  const [age, setAge] = useState(24);
  const [height, setHeight] = useState(180);
  const [weight, setWeight] = useState(75);
  const [trainingLoad, setTrainingLoad] = useState('Moderate');

  const fetchAthletes = async () => {
    setLoading(true);
    try {
      let url = 'http://127.0.0.1:8000/athletes/';
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (sportFilter) params.append('sport_type', sportFilter);
      if (loadFilter) params.append('training_load', loadFilter);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch athletes');
      const data = await res.json();
      setAthletes(data);
    } catch (err) {
      onShowToast(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, [search, sportFilter, loadFilter]);

  const handleRegisterAthlete = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/athletes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          sport_type: sportType,
          position,
          age: parseInt(age),
          height: parseFloat(height),
          weight: parseFloat(weight),
          training_load: trainingLoad
        })
      });

      if (!res.ok) throw new Error('Failed to create athlete');
      const newAth = await res.json();
      onShowToast(`Registered Athlete ${newAth.full_name} (${newAth.athlete_code})!`);
      setShowAddModal(false);
      fetchAthletes();

      // Reset form
      setFullName('');
    } catch (err) {
      onShowToast(`Error registering athlete: ${err.message}`);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Athlete Profile & Movement Intelligence</h2>
          <p className="section-subtitle">Manage athlete physical attributes, sport positions, injury logs, and assessment benchmarks.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Register New Athlete
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--primary)' }}>🏃</div>
          <div>
            <div className="stat-val">{athletes.length}</div>
            <div className="stat-lbl">Registered Athletes</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--rose)' }}>🩹</div>
          <div>
            <div className="stat-val">
              {athletes.reduce((acc, a) => acc + (a.injury_history ? a.injury_history.filter(i => i.recovery_status !== 'Fully Recovered').length : 0), 0)}
            </div>
            <div className="stat-lbl">Active Rehab Cases</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--amber)' }}>🔥</div>
          <div>
            <div className="stat-val">
              {athletes.filter(a => a.training_load === 'High' || a.training_load === 'Very High').length}
            </div>
            <div className="stat-lbl">High Training Load</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)' }}>📈</div>
          <div>
            <div className="stat-val">84.2%</div>
            <div className="stat-lbl">Movement Benchmark</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '220px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search athlete name or code (e.g. ATH-1001)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <select className="form-select" style={{ width: '100%' }} value={sportFilter} onChange={(e) => setSportFilter(e.target.value)}>
            <option value="">All Sports</option>
            <option value="Football">Football</option>
            <option value="Track & Field">Track & Field</option>
            <option value="Basketball">Basketball</option>
            <option value="Gymnastics">Gymnastics</option>
            <option value="Swimming">Swimming</option>
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <select className="form-select" style={{ width: '100%' }} value={loadFilter} onChange={(e) => setLoadFilter(e.target.value)}>
            <option value="">All Training Loads</option>
            <option value="Low">Low Load</option>
            <option value="Moderate">Moderate Load</option>
            <option value="High">High Load</option>
            <option value="Very High">Very High Load</option>
          </select>
        </div>
      </div>

      {/* Athletes Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Athletes...</div>
      ) : athletes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No athlete records found matching your query.</p>
        </div>
      ) : (
        <div className="grid-3">
          {athletes.map((ath) => (
            <div key={ath.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>{ath.athlete_code}</span>
                    <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>{ath.full_name}</h3>
                  </div>
                  <span className="role-badge Athlete">{ath.sport_type}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', margin: '0.75rem 0', fontSize: '0.85rem' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Position:</span> <strong style={{ color: '#fff' }}>{ath.position}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Age:</span> <strong style={{ color: '#fff' }}>{ath.age} yrs</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Height:</span> <strong style={{ color: '#fff' }}>{ath.height} cm</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Weight:</span> <strong style={{ color: '#fff' }}>{ath.weight} kg</strong></div>
                </div>

                <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Training Load:</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    background: ath.training_load === 'Very High' || ath.training_load === 'High' ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)',
                    color: ath.training_load === 'Very High' || ath.training_load === 'High' ? 'var(--rose)' : 'var(--emerald)'
                  }}>
                    {ath.training_load}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => onSelectAthlete(ath)}>
                  View Full Profile & Records
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Athlete Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Register New Athlete</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleRegisterAthlete}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Athlete Full Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Erling Haaland" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Sport Domain</label>
                    <input type="text" className="form-input" placeholder="Football, Track, etc." value={sportType} onChange={(e) => setSportType(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Playing Position</label>
                    <input type="text" className="form-input" placeholder="Striker, Guard, etc." value={position} onChange={(e) => setPosition(e.target.value)} required />
                  </div>
                </div>
                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Age (years)</label>
                    <input type="number" className="form-input" value={age} onChange={(e) => setAge(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Height (cm)</label>
                    <input type="number" className="form-input" value={height} onChange={(e) => setHeight(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input type="number" className="form-input" value={weight} onChange={(e) => setWeight(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Training Load</label>
                  <select className="form-select" value={trainingLoad} onChange={(e) => setTrainingLoad(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Very High">Very High</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Athlete Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
