# UI Wireframes & User Workflow Specifications

This document outlines the user interface hierarchy, wireframes, and role-based execution flows for the **Sports Injury Risk Detection Platform**.

---

## 1. Role-Based Navigation & UI Hierarchy

```
                                  [ Top Navbar ]
       ├── App Logo & Title: Sports Injury Risk Detection Platform
       ├── Current Role Indicator Badge: [Athlete | Coach | Physio | Scientist | Admin]
       ├── User Profile / Auth Button: Login / Register / Profile
       └── Role Switcher Demonstrator

                                [ Primary Navigation ]
       ├── 1. Athlete Profiles & Management
       ├── 2. Role Dashboards (Coach / Physio / Scientist / Admin)
       ├── 3. Biomechanics Datasets Explorer
       └── 4. System Architecture & Roadmap
```

---

## 2. Page Wireframe Layouts

### 2.1 Athlete Management Dashboard
- **Header Action**: "+ Register New Athlete" modal trigger.
- **Filter Toolbar**: Search by name/code, filter by Sport Type (Football, Basketball, Track & Field, Swimming), filter by Training Load.
- **Athlete Cards / Table**: Displays Athlete Photo avatar, Code, Name, Sport, Position, Age, Height, Weight, Training Load badge, and quick actions:
  - `View Details`: Opens modal with full metrics, injury logs, and physical assessments.
  - `+ Add Injury Record`: Logs a historical injury.
  - `+ Record Assessment`: Logs a physical assessment.

### 2.2 Role-Specific Dashboards
- **Coach View**: Team risk summary, overall squad health score, high-risk athlete alerts, training load balance.
- **Physiotherapist View**: Active rehabilitation list, recovery progress trackers, joint movement symmetry scores.
- **Sports Scientist View**: Biomechanical trend charts, joint angle distributions, landing mechanics analysis.
- **Admin View**: User account management table, system health log, API status, and database summary.

### 2.3 Biomechanics Datasets Explorer
- Interactive cards for **Human3.6M**, **MPII Human Pose**, **COCO Keypoints**, **SportsPose**, and **FIFA Injury Dataset**.
- Features an interactive **Skeleton Joint Visualizer** mapping the 17 standard body keypoints:
  `Head`, `Neck`, `Shoulders (L/R)`, `Elbows (L/R)`, `Wrists (L/R)`, `Hips (L/R)`, `Knees (L/R)`, `Ankles (L/R)`, `Feet (L/R)`.

---

## 3. Core User Workflows

```
  [User Authentication Flow]
  Guest User ──► Open Auth Modal ──► Select Role & Enter Credentials ──► Receive JWT Token ──► Authenticated State

  [Athlete Registration & Profile Workflow]
  Coach / Admin ──► Click "+ Register Athlete" ──► Fill Physical Metrics ──► Save Profile ──► Generates ATH-ID

  [Injury History & Physical Assessment Workflow]
  Physio / Scientist ──► Select Athlete ──► Click "+ Log Injury" or "+ Assessment" ──► Submit Data ──► Updates Profile
```
