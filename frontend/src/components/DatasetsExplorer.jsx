import React, { useState, useEffect } from 'react';

const SKELETON_KEYPOINTS = [
  { id: 0, name: 'Nose', x: 200, y: 50 },
  { id: 1, name: 'Left Eye', x: 190, y: 40 },
  { id: 2, name: 'Right Eye', x: 210, y: 40 },
  { id: 3, name: 'Left Ear', x: 175, y: 45 },
  { id: 4, name: 'Right Ear', x: 225, y: 45 },
  { id: 5, name: 'Left Shoulder', x: 150, y: 110 },
  { id: 6, name: 'Right Shoulder', x: 250, y: 110 },
  { id: 7, name: 'Left Elbow', x: 120, y: 180 },
  { id: 8, name: 'Right Elbow', x: 280, y: 180 },
  { id: 9, name: 'Left Wrist', x: 95, y: 245 },
  { id: 10, name: 'Right Wrist', x: 305, y: 245 },
  { id: 11, name: 'Left Hip', x: 165, y: 240 },
  { id: 12, name: 'Right Hip', x: 235, y: 240 },
  { id: 13, name: 'Left Knee', x: 155, y: 340 },
  { id: 14, name: 'Right Knee', x: 245, y: 340 },
  { id: 15, name: 'Left Ankle', x: 150, y: 430 },
  { id: 16, name: 'Right Ankle', x: 250, y: 430 }
];

const CONNECTIONS = [
  [0, 1], [0, 2], [1, 3], [2, 4],
  [5, 6], [5, 7], [7, 9], [6, 8], [8, 10],
  [5, 11], [6, 12], [11, 12],
  [11, 13], [13, 15], [12, 14], [14, 16]
];

export default function DatasetsExplorer({ onShowToast }) {
  const [datasets, setDatasets] = useState([]);
  const [selectedJoint, setSelectedJoint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/datasets/')
      .then((res) => res.json())
      .then((data) => {
        setDatasets(data);
        setLoading(false);
      })
      .catch((err) => {
        onShowToast(`Dataset fetch notice: ${err.message}`);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Sports Biomechanics Datasets & Keypoint Topology</h2>
          <p className="section-subtitle">Explore academic motion benchmark datasets and 17-keypoint human skeleton joints.</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.5rem', alignItems: 'start' }}>
        {/* Left: Datasets Catalog */}
        <div>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Benchmark Datasets Catalog</h3>
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading Datasets...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {datasets.map((ds) => (
                <div key={ds.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>{ds.name}</h4>
                    <span className="role-badge SportsScientist">{ds.category}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>{ds.description}</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    <span>Keypoints: <strong style={{ color: 'var(--primary)' }}>{ds.keypoint_count > 0 ? `${ds.keypoint_count} Joints` : 'Epidemiological Data'}</strong></span>
                    <span>Samples: <strong style={{ color: 'var(--emerald)' }}>{ds.sample_count.toLocaleString()}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Interactive 17-Keypoint Skeleton Visualizer */}
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--emerald)', marginBottom: '0.5rem' }}>17-Keypoint Skeleton Topology</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Click on any body keypoint node to inspect joint angle calculations and biomechanical significance.
          </p>

          <div style={{ background: '#050811', padding: '1rem', borderRadius: '12px', display: 'inline-block', border: '1px solid var(--border-color)' }}>
            <svg width="400" height="480" viewBox="0 0 400 480" style={{ background: 'transparent' }}>
              {/* Draw Skeleton Connections */}
              {CONNECTIONS.map(([startIdx, endIdx], i) => {
                const p1 = SKELETON_KEYPOINTS[startIdx];
                const p2 = SKELETON_KEYPOINTS[endIdx];
                return (
                  <line
                    key={i}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="var(--primary)"
                    strokeWidth="3"
                    strokeOpacity="0.6"
                  />
                );
              })}

              {/* Draw Keypoint Nodes */}
              {SKELETON_KEYPOINTS.map((kp) => {
                const isSelected = selectedJoint && selectedJoint.id === kp.id;
                return (
                  <g key={kp.id} onClick={() => setSelectedJoint(kp)} style={{ cursor: 'pointer' }}>
                    <circle
                      cx={kp.x}
                      cy={kp.y}
                      r={isSelected ? 10 : 7}
                      fill={isSelected ? 'var(--rose)' : 'var(--emerald)'}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <text
                      x={kp.x + 12}
                      y={kp.y + 4}
                      fill={isSelected ? 'var(--rose)' : 'var(--text-muted)'}
                      fontSize="10"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      {kp.id}: {kp.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {selectedJoint && (
            <div className="card" style={{ marginTop: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid var(--emerald)', textAlign: 'left' }}>
              <h4 style={{ color: 'var(--emerald)' }}>Keypoint #{selectedJoint.id}: {selectedJoint.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.3rem' }}>
                Used in calculating joint angle trajectories (e.g., knee valgus angle during landing, hip stability tilt).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
