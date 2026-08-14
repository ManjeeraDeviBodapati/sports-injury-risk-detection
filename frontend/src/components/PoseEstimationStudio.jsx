import React, { useState, useEffect } from 'react';

const ACTIVITIES = [
  'Squatting', 'Landing', 'Sprinting', 'Jumping', 'Cutting', 'Running', 'Throwing'
];

const CONNECTIONS = [
  [0, 1], [0, 2], [1, 3], [2, 4],
  [5, 6], [5, 7], [7, 9], [6, 8], [8, 10],
  [5, 11], [6, 12], [11, 12],
  [11, 13], [13, 15], [12, 14], [14, 16]
];

export default function PoseEstimationStudio({ onShowToast, onViewReport }) {
  const [selectedActivity, setSelectedActivity] = useState('Squatting');
  const [athletes, setAthletes] = useState([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch athletes list for selection
  useEffect(() => {
    fetch('http://127.0.0.1:8000/athletes/')
      .then((res) => res.json())
      .then((data) => {
        setAthletes(data);
        if (data.length > 0) setSelectedAthleteId(data[0].id);
      })
      .catch((e) => console.error(e));
  }, []);

  // Run analysis when activity or athlete changes
  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/pose/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athlete_id: selectedAthleteId ? parseInt(selectedAthleteId) : null,
          activity_type: selectedActivity,
          frame_count: 30
        })
      });

      if (!res.ok) throw new Error('Pose estimation failed');
      const data = await res.json();
      setAnalysisData(data);
      setCurrentFrameIdx(0);
      onShowToast(`Pose analysis completed for '${selectedActivity}'!`);
    } catch (err) {
      onShowToast(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [selectedActivity, selectedAthleteId]);

  // Frame animation loop
  useEffect(() => {
    let interval = null;
    if (isPlaying && analysisData && analysisData.trajectory_json) {
      interval = setInterval(() => {
        setCurrentFrameIdx((prev) => (prev + 1) % analysisData.trajectory_json.length);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, analysisData]);

  const currentFrame = analysisData?.trajectory_json?.[currentFrameIdx] || null;
  const jointAngles = currentFrame?.joint_angles || {};
  const keypointsMap = currentFrame?.keypoints || {};

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Pose Estimation & Motion Intelligence Studio</h2>
          <p className="section-subtitle">Real-time 17-keypoint skeleton tracking, joint angle gauges, and technique assessment.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            value={selectedAthleteId}
            onChange={(e) => setSelectedAthleteId(e.target.value)}
          >
            <option value="">Select Athlete Target</option>
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.full_name} ({a.athlete_code})
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
          >
            {ACTIVITIES.map((act) => (
              <option key={act} value={act}>
                Activity: {act}
              </option>
            ))}
          </select>

          {analysisData && (
            <button
              className="btn btn-primary"
              onClick={() => onViewReport(analysisData.id)}
            >
              📄 View Clinical Report
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Running Pose Estimation & Biomechanics Engine...</div>
      ) : !analysisData ? null : (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Left Column: Canvas 17-Keypoint Motion Scrubber */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ color: 'var(--primary)', fontSize: '1.15rem' }}>
                Motion Trajectory Stream ({selectedActivity})
              </h3>
              <span className="role-badge SportsScientist">
                Frame {currentFrameIdx + 1} / {analysisData.frame_count} ({currentFrame?.timestamp_ms}ms)
              </span>
            </div>

            {/* Skeleton Canvas */}
            <div style={{ background: '#050811', padding: '1rem', borderRadius: '12px', display: 'inline-block', border: '1px solid var(--border-color)', position: 'relative' }}>
              <svg width="400" height="420" viewBox="0 0 400 420">
                {/* Connections */}
                {CONNECTIONS.map(([startIdx, endIdx], i) => {
                  const kp1 = keypointsMap[startIdx];
                  const kp2 = keypointsMap[endIdx];
                  if (!kp1 || !kp2) return null;
                  return (
                    <line
                      key={i}
                      x1={kp1.x * 400}
                      y1={kp1.y * 420}
                      x2={kp2.x * 400}
                      y2={kp2.y * 420}
                      stroke="var(--primary)"
                      strokeWidth="3"
                      strokeOpacity="0.8"
                    />
                  );
                })}

                {/* Keypoint Nodes */}
                {Object.values(keypointsMap).map((kp) => (
                  <circle
                    key={kp.id}
                    cx={kp.x * 400}
                    cy={kp.y * 420}
                    r={kp.id === 13 || kp.id === 14 ? 8 : 5}
                    fill={kp.id === 13 || kp.id === 14 ? 'var(--rose)' : 'var(--emerald)'}
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>
            </div>

            {/* Playback Scrubber Controls */}
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play Motion'}
              </button>

              <input
                type="range"
                min="0"
                max={(analysisData.trajectory_json?.length || 1) - 1}
                value={currentFrameIdx}
                onChange={(e) => setCurrentFrameIdx(parseInt(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--primary)' }}
              />
            </div>
          </div>

          {/* Right Column: Live Joint Angle Gauges & Deviation Alerts */}
          <div>
            {/* Executive Quality Card */}
            <div className="card" style={{ marginBottom: '1.25rem', background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall Movement Quality</span>
                  <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', lineHeight: 1 }}>
                    {analysisData.movement_quality_score} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
                  </h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Limb Symmetry Index</span>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--emerald)' }}>
                    {analysisData.symmetry_index_percent}%
                  </h3>
                </div>
              </div>
            </div>

            {/* Live Joint Gauges Grid */}
            <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="card">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Knee Valgus (Inward Drop)</span>
                <h3 style={{ fontSize: '1.5rem', color: (jointAngles.left_knee_valgus || 0) > 10 ? 'var(--rose)' : 'var(--emerald)' }}>
                  L: {jointAngles.left_knee_valgus || 0}° | R: {jointAngles.right_knee_valgus || 0}°
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Peak: {analysisData.max_knee_valgus_deg}°</span>
              </div>

              <div className="card">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hip Stability (Pelvic Tilt)</span>
                <h3 style={{ fontSize: '1.5rem', color: (jointAngles.hip_stability_angle || 0) > 8 ? 'var(--amber)' : 'var(--emerald)' }}>
                  {jointAngles.hip_stability_angle || 0}°
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Peak: {analysisData.max_hip_tilt_deg}°</span>
              </div>

              <div className="card">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trunk Lateral Lean</span>
                <h3 style={{ fontSize: '1.5rem', color: (jointAngles.trunk_lean_angle || 0) > 10 ? 'var(--amber)' : 'var(--primary)' }}>
                  {jointAngles.trunk_lean_angle || 0}°
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Peak: {analysisData.max_trunk_lean_deg}°</span>
              </div>

              <div className="card">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Knee Flexion Angle</span>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--purple)' }}>
                  L: {jointAngles.left_knee_angle || 0}° | R: {jointAngles.right_knee_angle || 0}°
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Stride: {jointAngles.stride_length_cm || 0} cm</span>
              </div>
            </div>

            {/* Technique Deviations Box */}
            <div className="card">
              <h4 style={{ color: 'var(--rose)', marginBottom: '0.75rem' }}>
                Technique Deviations ({analysisData.deviations_json?.length || 0})
              </h4>

              {!analysisData.deviations_json || analysisData.deviations_json.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--emerald)' }}>
                  ✓ Movement biomechanics are within optimal safety thresholds.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {analysisData.deviations_json.map((dev, idx) => (
                    <div key={idx} style={{ background: 'rgba(244,63,94,0.08)', borderLeft: '3px solid var(--rose)', padding: '0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ color: 'var(--rose)' }}>{dev.code}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--amber)' }}>{dev.metric}</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{dev.finding}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
