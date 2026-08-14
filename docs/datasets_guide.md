# Sports Biomechanics Datasets Guide

This document details the recommended sports biomechanics datasets integrated into **Milestone 1** of the platform for pose estimation, joint tracking, activity recognition, and injury risk modeling.

---

## 1. Catalog of Standard Biomechanics Datasets

### 1. Human3.6M Dataset
- **Purpose**: 3D Human Pose Estimation, joint tracking, complex movement analysis.
- **Keypoints**: 32 joints (3D Cartesian coordinates).
- **Scale**: 3.6 million 3D human pose frames captured using high-speed motion capture system across 11 professional actors performing 15 everyday and athletic scenarios.
- **Usage in Platform**: Training baseline 3D pose estimation and joint angle trajectory models.

### 2. MPII Human Pose Dataset
- **Purpose**: 2D Body Keypoint Detection and single/multi-person activity recognition.
- **Keypoints**: 16 body keypoints.
- **Scale**: ~25,000 images containing over 40,000 annotated individuals performing 410 human activities from YouTube videos.
- **Usage in Platform**: Training keypoint detection on unconstrained athletic videos.

### 3. COCO Keypoints Dataset
- **Purpose**: Human pose estimation training and bounding-box detection.
- **Keypoints**: 17 standardized body keypoints:
  - Nose, Eyes (L/R), Ears (L/R), Shoulders (L/R), Elbows (L/R), Wrists (L/R), Hips (L/R), Knees (L/R), Ankles (L/R).
- **Scale**: Over 200,000 images and 250,000 person instances with keypoints.
- **Usage in Platform**: Foundation topology for 2D skeleton extraction in video streams.

### 4. SportsPose Dataset
- **Purpose**: Sports-specific movement analysis, high-speed movement evaluation, and posture assessment.
- **Keypoints**: 17 body keypoints aligned with athletic movement dynamics.
- **Scale**: 100,000+ 3D pose frames of dynamic sports movements (Sprinting, Cutting, Jumping, Throwing, Landing).
- **Usage in Platform**: Fine-tuning biomechanical joint angle analysis (knee valgus, hip stability, landing mechanics).

### 5. FIFA Injury Dataset (Reference)
- **Purpose**: Reference dataset for sports injury trend analysis, epidemiological risk factor modeling, and injury mechanism evaluation.
- **Scale**: Epidemiological data covering professional player injuries across multi-year seasons, categorized by mechanism (non-contact vs contact), body part, and lay-off duration.
- **Usage in Platform**: Benchmarking weighted injury risk scoring weights and historical risk factors.

---

## 2. Dataset Keypoint Mapping Standard (17 Body Points)

| Index | Keypoint Name | Anatomical Region | Biomechanical Significance |
|:---:|---|---|---|
| 0 | Nose / Head | Cranial | Head alignment, trunk balance |
| 1-2 | Left/Right Eye | Facial | Gaze vector, head orientation |
| 3-4 | Left/Right Ear | Lateral Head | Lateral neck tilt |
| 5-6 | Left/Right Shoulder | Upper Extremity | Shoulder symmetry, trunk lean |
| 7-8 | Left/Right Elbow | Mid Extremity | Upper limb kinetic chain |
| 9-10 | Left/Right Wrist | Distal Extremity | Release point / throwing mechanics |
| 11-12 | Left/Right Hip | Pelvic Complex | Hip stability, pelvic drop |
| 13-14 | Left/Right Knee | Lower Extremity | Knee valgus / varus angle |
| 15-16 | Left/Right Ankle | Distal Lower Extremity | Foot contact, ankle flexion |
