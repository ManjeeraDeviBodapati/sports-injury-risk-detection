import math
import random
from typing import List, Dict, Any

from app.services.biomechanics_engine import compute_frame_biomechanics

SKELETON_CONNECTIONS = [
    (0, 1), (0, 2), (1, 3), (2, 4),
    (5, 6), (5, 7), (7, 9), (6, 8), (8, 10),
    (5, 11), (6, 12), (11, 12),
    (11, 13), (13, 15), (12, 14), (14, 16)
]

KEYPOINT_NAMES = [
    "Nose", "Left Eye", "Right Eye", "Left Ear", "Right Ear",
    "Left Shoulder", "Right Shoulder", "Left Elbow", "Right Elbow",
    "Left Wrist", "Right Wrist", "Left Hip", "Right Hip",
    "Left Knee", "Right Knee", "Left Ankle", "Right Ankle"
]

def generate_activity_motion_trajectory(activity_type: str, total_frames: int = 30) -> List[Dict[str, Any]]:
    """
    Generates a realistic 17-keypoint skeleton motion trajectory time-series across video frames
    for dynamic sports activities (Sprinting, Jumping, Squatting, Landing, Cutting, Running, Throwing).
    """
    trajectory = []
    
    for frame_idx in range(total_frames):
        phase = (frame_idx / float(total_frames)) * 2 * math.pi
        sin_p = math.sin(phase)
        cos_p = math.cos(phase)

        # Baseline standing skeleton coordinates (normalized 0.0 - 1.0)
        base_x = 0.5
        base_y = 0.5
        
        # Activity specific movement dynamics
        if activity_type.lower() == 'squatting':
            # Vertical hip/knee drop during squat
            knee_flex = abs(sin_p) * 0.18
            trunk_tilt = sin_p * 0.06
            l_knee_x, l_knee_y = 0.42 - (knee_flex * 0.4), 0.75 + (knee_flex * 0.3)
            r_knee_x, r_knee_y = 0.58 + (knee_flex * 0.4), 0.75 + (knee_flex * 0.3)
            hip_y = 0.55 + (knee_flex * 0.5)
            trunk_lean_x = trunk_tilt
        elif activity_type.lower() == 'jumping':
            # Takeoff and landing vertical velocity
            height_offset = -sin_p * 0.22
            knee_flex = max(0, cos_p) * 0.12
            l_knee_x, l_knee_y = 0.42, 0.75 + height_offset + knee_flex
            r_knee_x, r_knee_y = 0.58, 0.75 + height_offset + knee_flex
            hip_y = 0.55 + height_offset
            trunk_lean_x = sin_p * 0.04
        elif activity_type.lower() == 'sprinting':
            # Alternating stride mechanics
            stride_l = sin_p * 0.12
            stride_r = -sin_p * 0.12
            l_knee_x, l_knee_y = 0.42 + stride_l, 0.75 - abs(stride_l * 0.5)
            r_knee_x, r_knee_y = 0.58 + stride_r, 0.75 - abs(stride_r * 0.5)
            hip_y = 0.55 + (abs(sin_p) * 0.03)
            trunk_lean_x = 0.08 # Forward sprint lean
        elif activity_type.lower() == 'landing':
            # High impact compression on landing phase
            impact = max(0, math.sin(phase * 0.5)) * 0.25
            l_knee_x, l_knee_y = 0.40 - (impact * 0.3), 0.75 + (impact * 0.4) # Medial valgus drop
            r_knee_x, r_knee_y = 0.60 + (impact * 0.3), 0.75 + (impact * 0.4)
            hip_y = 0.55 + (impact * 0.4)
            trunk_lean_x = impact * 0.1
        else: # Cutting / Running / Throwing
            l_knee_x, l_knee_y = 0.42 + (sin_p * 0.05), 0.75
            r_knee_x, r_knee_y = 0.58 - (sin_p * 0.05), 0.75
            hip_y = 0.55
            trunk_lean_x = cos_p * 0.05

        # Build 17 keypoint dictionary for frame
        keypoints = {
            0: {"id": 0, "name": "Nose", "x": base_x + trunk_lean_x, "y": hip_y - 0.40, "confidence": 0.98},
            1: {"id": 1, "name": "Left Eye", "x": base_x - 0.02 + trunk_lean_x, "y": hip_y - 0.42, "confidence": 0.97},
            2: {"id": 2, "name": "Right Eye", "x": base_x + 0.02 + trunk_lean_x, "y": hip_y - 0.42, "confidence": 0.97},
            3: {"id": 3, "name": "Left Ear", "x": base_x - 0.05 + trunk_lean_x, "y": hip_y - 0.41, "confidence": 0.95},
            4: {"id": 4, "name": "Right Ear", "x": base_x + 0.05 + trunk_lean_x, "y": hip_y - 0.41, "confidence": 0.95},
            
            5: {"id": 5, "name": "Left Shoulder", "x": base_x - 0.10 + trunk_lean_x, "y": hip_y - 0.30, "confidence": 0.99},
            6: {"id": 6, "name": "Right Shoulder", "x": base_x + 0.10 + trunk_lean_x, "y": hip_y - 0.30, "confidence": 0.99},
            
            7: {"id": 7, "name": "Left Elbow", "x": base_x - 0.15 + (cos_p * 0.05), "y": hip_y - 0.15, "confidence": 0.96},
            8: {"id": 8, "name": "Right Elbow", "x": base_x + 0.15 - (cos_p * 0.05), "y": hip_y - 0.15, "confidence": 0.96},
            
            9: {"id": 9, "name": "Left Wrist", "x": base_x - 0.20 + (cos_p * 0.08), "y": hip_y, "confidence": 0.94},
            10: {"id": 10, "name": "Right Wrist", "x": base_x + 0.20 - (cos_p * 0.08), "y": hip_y, "confidence": 0.94},
            
            11: {"id": 11, "name": "Left Hip", "x": base_x - 0.07, "y": hip_y, "confidence": 0.99},
            12: {"id": 12, "name": "Right Hip", "x": base_x + 0.07, "y": hip_y, "confidence": 0.99},
            
            13: {"id": 13, "name": "Left Knee", "x": l_knee_x, "y": l_knee_y, "confidence": 0.98},
            14: {"id": 14, "name": "Right Knee", "x": r_knee_x, "y": r_knee_y, "confidence": 0.98},
            
            15: {"id": 15, "name": "Left Ankle", "x": base_x - 0.09, "y": 0.92, "confidence": 0.96},
            16: {"id": 16, "name": "Right Ankle", "x": base_x + 0.09, "y": 0.92, "confidence": 0.96}
        }

        # Calculate instant biomechanics for frame
        frame_metrics = compute_frame_biomechanics(keypoints)

        trajectory.append({
            "frame_index": frame_idx,
            "timestamp_ms": frame_idx * 33, # 30 FPS
            "keypoints": keypoints,
            "joint_angles": frame_metrics
        })

    return trajectory
