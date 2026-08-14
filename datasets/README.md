# Sports Biomechanics Datasets Directory

This directory contains keypoint topology configurations, dataset metadata, sample 2D/3D skeleton keypoint structures, and data loader utilities for **Milestone 1**.

---

## Supported Benchmark Datasets

1. **Human3.6M**: 3D Pose Estimation & Motion Analysis (32 Joint Cartesian Topology).
2. **MPII Human Pose**: 2D Body Keypoint Detection (16 Joints).
3. **COCO Keypoints**: Standardized 17-Keypoint Body Skeleton.
4. **SportsPose**: Sports-Specific Motion & Biomechanics Dataset (17 Joints).
5. **FIFA Injury Reference**: Epidemiological Injury & Risk Factor Reference Data.

---

## File Overview

- `sample_keypoints.json`: 17-keypoint skeleton topology mapping standard COCO/SportsPose joint indices to anatomical body parts.
- `dataset_loader.py`: Utility script for inspecting skeleton keypoints, verifying dataset schemas, and calculating baseline joint angles.
