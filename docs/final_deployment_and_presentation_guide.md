# Sports Injury Risk Detection Platform - Final Production Deployment & Presentation Guide

This document provides step-by-step instructions for running, deploying, and presenting the **Sports Injury Risk Detection Platform** covering all **Milestones 1 through 4**.

---

## 1. System Overview & Technology Stack

The platform is an AI-powered sports injury intelligence solution built using:
- **API Gateway & Backend Engine**: FastAPI, Pydantic, Python 3.10, PyJWT, Passlib (Bcrypt), NumPy, OpenCV.
- **Data Persistence**: SQLAlchemy ORM (PostgreSQL with SQLite local fallback).
- **Computer Vision & Biomechanics**: 17-Keypoint Pose Estimation Engine, Vector Geometry Joint Angle Calculations, Movement Quality Scoring, and 5-Component Weighted Injury Risk Prediction.
- **Frontend Presentation**: React.js, Vite, Vanilla CSS Design System with dark mode, glassmorphism, responsive grids, interactive SVG skeleton motion scrubbers, and executive analytics.
- **Containerization & Cloud**: Docker multi-stage containers, Nginx web server, Docker Compose orchestration.

---

## 2. Quick Local Execution & Seeding

### 2.1 Backend Engine
```bash
cd backend
# 1. Install dependencies
.\venv\Scripts\pip install -r requirements.txt

# 2. Seed system users, athletes, injury logs, assessments, and datasets
.\venv\Scripts\python seed_data.py

# 3. Run FastAPI server
.\venv\Scripts\uvicorn app.main:app --reload --port 8000
```
- API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`

### 2.2 Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
- Web Application Portal: `http://localhost:5173`

---

## 3. Production Docker Deployment

### 3.1 Docker Compose One-Click Launch
```bash
# Windows
deploy.bat

# Linux / macOS
chmod +x deploy.sh
./deploy.sh
```

### 3.2 Docker Architecture
- `sports_injury_frontend`: Nginx web server serving production React SPA on port `5173` / `80`.
- `sports_injury_backend`: FastAPI ASGI server running on port `8000`.
- `sports_injury_postgres`: PostgreSQL 15 database container running on port `5432` with volume persistence.

---

## 4. End-to-End System Demonstration Script (For Instructor Evaluation)

When presenting to your ma'am or evaluation committee, follow this sequence:

### **Step 1: System Initialization & Roles (Milestone 1)**
- Show top navigation bar and active role indicator badge (`Administrator`, `Coach`, `Physiotherapist`, `Sports Scientist`, `Athlete`).
- Demonstrate role switching to showcase role-based access control (RBAC).
- Show the **Athletes Management** tab with search, filters (Sport, Training Load), and registration modal.

### **Step 2: Pose Estimation & Skeleton Tracking (Milestone 2)**
- Navigate to the **Pose Studio** tab.
- Select an athletic activity (`Squatting`, `Landing`, `Sprinting`, `Jumping`).
- Click **▶ Play Motion** or scrub the timeline to display the live **17-Keypoint Skeleton** animating dynamically over video frames.
- Show live joint angle gauges for **Knee Valgus**, **Hip Stability**, **Trunk Lean**, and **Stride Length**.
- Click **📄 View Clinical Report** to open the printable HTML Biomechanics Report.

### **Step 3: Predictive Injury Risk & Corrective Workflows (Milestone 3)**
- Navigate to **Risk Intelligence**.
- Show the **Overall Injury Risk Score Ring** (e.g. `69.6 - High Risk`).
- Explain the 5-component weighted scoring formula:
  `35% Biometrics + 20% History + 20% Asymmetry + 15% Training Load + 10% Fatigue`.
- Review the 6 Injury Category Cards (`ACL`, `Hamstring`, `Ankle`, `Shoulder`, `Lower Back`, `Overuse`).
- Show the personalized **Corrective Exercise & Recovery Workflows** generated automatically by the recommendation engine.
- Show the **Team Heatmap** tab detailing squad risk distribution.

### **Step 4: Executive Analytics & Data Exporter (Milestone 4)**
- Navigate to **Executive Analytics**.
- Show platform KPIs, total cohort health index, and system performance metrics.
- Demonstrate CSV dataset exports (`Athletes CSV`, `Risk Analytics CSV`, `Pose Analytics CSV`).
- Highlight Docker containerization status.

---

## 5. End-to-End Test Suite Execution
To demonstrate 100% automated system verification:
```bash
cd backend
.\venv\Scripts\python test_end_to_end.py
```
Outputs `ALL END-TO-END SYSTEM INTEGRATION TESTS PASSED 100%!`.
