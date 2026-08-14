# Sports Injury Risk Detection Platform - Database Schema

This document details the database schema for **Milestone 1**, supporting user management, role-based access control (RBAC), athlete profiles, injury histories, physical assessments, and biomechanics datasets.

---

## Entity Relationship Summary

- **Users** 1 ── 0..1 **Athletes** (A User with role `Athlete` links to an Athlete profile)
- **Athletes** 1 ── 0..N **InjuryHistory**
- **Athletes** 1 ── 0..N **PhysicalAssessments**
- **Users** 1 ── 0..N **PhysicalAssessments** (as evaluator / sports scientist / physiotherapist)

---

## 1. `users` Table
Stores user credentials, full name, and role for system authentication.

| Field | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY, AUTOINCREMENT` | Unique User ID |
| `full_name` | `VARCHAR(255)` | `NOT NULL` | Full Name |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL, INDEX` | Account Email (Login Identifier) |
| `password` | `VARCHAR(255)` | `NOT NULL` | Bcrypt Hashed Password |
| `role` | `VARCHAR(50)` | `NOT NULL` | Role: `Athlete`, `Coach`, `Physiotherapist`, `Sports Scientist`, `Administrator` |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Account Status |
| `created_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Account Creation Timestamp |

---

## 2. `athletes` Table
Stores physical profiles, sport domain details, and baseline metrics for athletes.

| Field | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY, AUTOINCREMENT` | Unique Athlete ID |
| `user_id` | `INTEGER` | `FOREIGN KEY (users.id), NULLABLE` | Associated user account (optional) |
| `athlete_code` | `VARCHAR(50)` | `UNIQUE, NOT NULL, INDEX` | Human-readable ID (e.g. `ATH-1001`) |
| `full_name` | `VARCHAR(255)` | `NOT NULL` | Athlete Full Name |
| `sport_type` | `VARCHAR(100)` | `NOT NULL, INDEX` | Primary Sport (e.g., Football, Basketball, Track) |
| `position` | `VARCHAR(100)` | `NOT NULL` | Playing Position (e.g., Quarterback, Forward) |
| `age` | `INTEGER` | `NOT NULL` | Age in years |
| `height` | `FLOAT` | `NOT NULL` | Height in cm |
| `weight` | `FLOAT` | `NOT NULL` | Weight in kg |
| `training_load` | `VARCHAR(50)` | `NOT NULL` | Training Intensity: `Low`, `Moderate`, `High`, `Very High` |
| `created_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Registration Timestamp |

---

## 3. `injury_history` Table
Logs historical injuries, affected body parts, recovery status, and clinical notes.

| Field | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY, AUTOINCREMENT` | Record ID |
| `athlete_id` | `INTEGER` | `FOREIGN KEY (athletes.id), NOT NULL` | Target Athlete |
| `injury_name` | `VARCHAR(255)` | `NOT NULL` | Name of injury (e.g., ACL Tear, Ankle Sprain) |
| `affected_body_part` | `VARCHAR(100)` | `NOT NULL` | Body part (e.g., Left Knee, Right Ankle, Shoulder) |
| `injury_date` | `DATE` | `NOT NULL` | Date when injury occurred |
| `recovery_status` | `VARCHAR(50)` | `NOT NULL` | Status: `Fully Recovered`, `Rehab In Progress`, `Active Pain` |
| `severity` | `VARCHAR(50)` | `NOT NULL` | Severity: `Mild`, `Moderate`, `Severe`, `Critical` |
| `notes` | `TEXT` | `NULLABLE` | Physiotherapist / medical notes |

---

## 4. `physical_assessments` Table
Stores physical assessment benchmarks (flexibility, strength, balance, movement screening).

| Field | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY, AUTOINCREMENT` | Record ID |
| `athlete_id` | `INTEGER` | `FOREIGN KEY (athletes.id), NOT NULL` | Target Athlete |
| `assessment_date` | `DATE` | `NOT NULL` | Date of evaluation |
| `flexibility_score` | `FLOAT` | `NOT NULL` | Range 0.0 - 100.0 (HAMSTRING / Hip mobility) |
| `strength_score` | `FLOAT` | `NOT NULL` | Range 0.0 - 100.0 (Quad / Core strength) |
| `endurance_score` | `FLOAT` | `NOT NULL` | Range 0.0 - 100.0 (VO2 / Stamina score) |
| `movement_screening_notes`| `TEXT` | `NULLABLE` | Functional Movement Screen (FMS) observations |
| `assessed_by` | `VARCHAR(255)` | `NOT NULL` | Name of evaluating Specialist / Physio |

---

## 5. `dataset_references` Table
Catalog of standard benchmark sports biomechanics datasets used for pose estimation and risk modeling.

| Field | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY, AUTOINCREMENT` | Record ID |
| `name` | `VARCHAR(100)` | `UNIQUE, NOT NULL` | Dataset Name (e.g., `Human3.6M`, `SportsPose`) |
| `category` | `VARCHAR(100)` | `NOT NULL` | Purpose category |
| `description` | `TEXT` | `NOT NULL` | Dataset overview and research context |
| `keypoint_count` | `INTEGER` | `NOT NULL` | Number of annotated body keypoints |
| `sample_count` | `INTEGER` | `NOT NULL` | Total frame / video sample count |
| `source_url` | `VARCHAR(500)` | `NOT NULL` | Official academic / repository link |