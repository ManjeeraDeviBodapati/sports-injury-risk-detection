import React from 'react';

export default function ArchitectureViewer() {
  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">System Architecture & Milestone 1 Roadmap</h2>
          <p className="section-subtitle">Multi-tier microservices architecture for AI-powered sports injury risk detection.</p>
        </div>
      </div>

      {/* Layer breakdown cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--primary)' }}>Layer 1: API Gateway (FastAPI Engine)</h3>
            <span className="role-badge Administrator">Active & Online</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Request routing, OAuth2 & JWT Bearer token authentication, CORS header management, and Pydantic schema validation.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--purple)' }}>Layer 2: Microservices Layer</h3>
            <span className="role-badge SportsScientist">Core Setup Complete</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            User & Athlete Management Service, Video Processing, Pose Estimation Service, Biomechanical Analysis Engine, and Injury Risk Prediction Engine.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--amber)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--amber)' }}>Layer 3: AI / ML & Biomechanics Intelligence Layer</h3>
            <span className="role-badge Coach">Model Pipelines Prepared</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            2D/3D Pose Estimation models (MediaPipe / YOLOV8-Pose / HRNet), action recognition, knee valgus regression models, and anomaly autoencoders.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--emerald)' }}>Layer 4: Data Layer & Persistence</h3>
            <span className="role-badge Physiotherapist">Relational DB Seeded</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            SQLAlchemy ORM supporting SQLite with PostgreSQL fallback for Users, Athletes, Injury Histories, Physical Assessments, and Datasets.
          </p>
        </div>
      </div>

      {/* Milestone 1 Checklist */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Milestone 1 Verification & Requirements Checklist</h3>
        <div className="grid-2">
          <div className="card" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <h4 style={{ color: 'var(--emerald)', marginBottom: '0.5rem' }}>✓ System Setup & Documentation</h4>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
              <li>Project objectives & injury detection workflows defined</li>
              <li>System Architecture & Database Schema designed</li>
              <li>UI wireframes and role workflows documented</li>
              <li>Frontend (Vite + React) & Backend (FastAPI + SQLAlchemy) environments initialized</li>
            </ul>
          </div>
          <div className="card" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <h4 style={{ color: 'var(--emerald)', marginBottom: '0.5rem' }}>✓ Authentication & Datasets</h4>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
              <li>JWT authentication & OAuth2 SSO simulation implemented</li>
              <li>Role-based access control (Athlete, Coach, Physio, Scientist, Admin) enforced</li>
              <li>Athlete Profile, Injury History & Physical Assessment management workflows built</li>
              <li>Human3.6M, MPII, COCO, SportsPose, FIFA Injury datasets catalog integrated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
