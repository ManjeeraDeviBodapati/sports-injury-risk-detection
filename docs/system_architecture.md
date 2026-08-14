# System Architecture & Technical Specifications

This document outlines the multi-tiered software architecture for the **Sports Injury Risk Detection Platform**, mapping directly to the System Architecture Diagram.

---

## 1. System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT CLIENTS                                   |
|   Web Application   |   Mobile Application   |   Coach/Physio/Science Dashboards |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|                               API GATEWAY (FASTAPI)                               |
|   Routing  |  JWT Auth & RBAC  |  CORS  |  Rate Limiting  |  Validation           |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|                                MICROSERVICES LAYER                                |
|  ┌─────────────────────┐  ┌─────────────────────┐  ┌───────────────────────────┐  |
|  │ User & Athlete Service│  │ Video Processing    │  │ Pose Estimation Service   │  |
|  └─────────────────────┘  └─────────────────────┘  └───────────────────────────┘  |
|  ┌─────────────────────┐  ┌─────────────────────┐  ┌───────────────────────────┐  |
|  │ Biomechanics Service │  │ Injury Risk Service │  │ Recommendation & Dashboards│  |
|  └─────────────────────┘  └─────────────────────┘  └───────────────────────────┘  |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|                     AI / ML & BIOMECHANICS INTELLIGENCE LAYER                     |
|  Pose Estimation (2D/3D)  │  Action Recognition  │  Biomechanical Models          |
|  Injury Risk Prediction   │  Anomaly Detection   │  Fatigue Prediction            |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|                                    DATA LAYER                                     |
|  PostgreSQL / SQLite  │  Object Storage (Videos) │  Vector DB / Time-Series       |
+-----------------------------------------------------------------------------------+
```

---

## 2. Layered Breakdown

### Layer 1: Access & Presentation Layer (Frontend)
- **Tech Stack**: React.js, Vite, Vanilla CSS Design System with dark mode theme.
- **Key Modules**:
  - Auth Portal (JWT Login, Registration with Role Picker, OAuth2 SSO).
  - Athlete Profile Dashboard & Physical Record Management.
  - Role-Specific Views (Athlete, Coach, Physiotherapist, Sports Scientist, Administrator).
  - Biomechanics Dataset & Architecture Explorer.

### Layer 2: API Gateway Layer (FastAPI)
- **Responsibilities**:
  - Request routing and validation using Pydantic.
  - Authentication using JWT tokens (Bearer standard) and password hashing with Bcrypt.
  - Role-Based Access Control (RBAC) dependencies enforcing role permissions.
  - CORS header handling and structured HTTP exception responses.

### Layer 3: Microservices & Core Business Logic
- **User & Athlete Management Service**: Manages accounts, physical measurements, training load metrics, and historical injury data.
- **Video Management & Processing Service**: Uploads, validates, extracts frames, and prepares video streams.
- **Pose Estimation Engine**: Detects 17-keypoint human skeleton joints (Head, Shoulder, Elbow, Wrist, Hip, Knee, Ankle, Foot).
- **Biomechanical Analysis Engine**: Computes joint angles (knee valgus, hip stability, trunk lean, stride length, landing symmetry).
- **Injury Risk & Scoring Engine**: Computes weighted risk score:
  - Biomechanical Deviations (35%)
  - Historical Injury Factors (20%)
  - Movement Asymmetry (20%)
  - Training Load Indicators (15%)
  - Fatigue Indicators (10%)

### Layer 4: AI / ML Intelligence Layer
- **Deep Learning Models**: OpenCV, MediaPipe, YOLOV8-Pose / HRNet, PyTorch/TensorFlow models for 2D/3D skeleton extraction and anomaly detection.

### Layer 5: Data Layer
- **Relational Storage**: PostgreSQL / SQLite (Users, Athletes, Injuries, Assessments, Datasets).
- **Object Storage**: Local / AWS S3 storage for video files and processed skeleton keypoint JSONs.

---

## 3. Security & Access Control Matrix

| Role | User Mgmt | Register Athletes | Log Injuries | View Analytics | Admin Panel |
|---|:---:|:---:|:---:|:---:|:---:|
| **Athlete** | Self | Self | View | Self Only | ✖ |
| **Coach** | Read | Read/Update | Read | Team Analytics | ✖ |
| **Physiotherapist** | Read | Read/Update | Full Access | Injury & Rehab | ✖ |
| **Sports Scientist** | Read | Read | Read | Biomechanics & Predictions | ✖ |
| **Administrator** | Full Access | Full Access | Full Access | System Wide | Full Access |
