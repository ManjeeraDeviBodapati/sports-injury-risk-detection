import math
from typing import List, Dict, Any, Tuple

def calculate_vector_angle(p1: Dict[str, float], p2: Dict[str, float], p3: Dict[str, float]) -> float:
    """
    Calculates angle (in degrees) formed by three 2D/3D points (p1 - p2 - p3) with vertex at p2.
    """
    x1, y1 = p1.get('x', 0), p1.get('y', 0)
    x2, y2 = p2.get('x', 0), p2.get('y', 0)
    x3, y3 = p3.get('x', 0), p3.get('y', 0)

    v1 = (x1 - x2, y1 - y2)
    v2 = (x3 - x2, y3 - y2)

    mag1 = math.sqrt(v1[0]**2 + v1[1]**2)
    mag2 = math.sqrt(v2[0]**2 + v2[1]**2)

    if mag1 == 0 or mag2 == 0:
        return 180.0

    dot_prod = v1[0] * v2[0] + v1[1] * v2[1]
    cosine = max(-1.0, min(1.0, dot_prod / (mag1 * mag2)))
    angle_rad = math.acos(cosine)
    return math.degrees(angle_rad)

def calculate_knee_valgus_angle(hip: Dict[str, float], knee: Dict[str, float], ankle: Dict[str, float]) -> float:
    """
    Calculates knee valgus angle (inward medial knee collapse).
    Normal alignment ~ 170-180°. Inward valgus deviation is 180 - calculated_angle.
    """
    angle = calculate_vector_angle(hip, knee, ankle)
    valgus_deviation = abs(180.0 - angle)
    return round(valgus_deviation, 2)

def calculate_hip_stability_angle(left_hip: Dict[str, float], right_hip: Dict[str, float]) -> float:
    """
    Calculates pelvic tilt / lateral drop angle between left and right hip keypoints.
    0° represents perfect horizontal pelvic alignment.
    """
    dx = right_hip.get('x', 0) - left_hip.get('x', 0)
    dy = right_hip.get('y', 0) - left_hip.get('y', 0)
    
    if dx == 0:
        return 90.0

    slope = dy / dx
    tilt_rad = math.atan(slope)
    return round(abs(math.degrees(tilt_rad)), 2)

def calculate_trunk_lean_angle(left_shoulder: Dict[str, float], right_shoulder: Dict[str, float], left_hip: Dict[str, float], right_hip: Dict[str, float]) -> float:
    """
    Calculates trunk lateral lean relative to the vertical gravity axis.
    Mid-shoulder to mid-hip vector vs vertical axis.
    """
    mid_shoulder_x = (left_shoulder.get('x', 0) + right_shoulder.get('x', 0)) / 2.0
    mid_shoulder_y = (left_shoulder.get('y', 0) + right_shoulder.get('y', 0)) / 2.0

    mid_hip_x = (left_hip.get('x', 0) + right_hip.get('x', 0)) / 2.0
    mid_hip_y = (left_hip.get('y', 0) + right_hip.get('y', 0)) / 2.0

    dx = mid_shoulder_x - mid_hip_x
    dy = mid_shoulder_y - mid_hip_y

    if dy == 0:
        return 0.0

    lean_rad = math.atan(abs(dx) / abs(dy))
    return round(math.degrees(lean_rad), 2)

def calculate_range_of_motion(angles: List[float]) -> Dict[str, float]:
    """Calculates min, max, mean, and range of motion (ROM) for a joint angle time-series."""
    if not angles:
        return {"min_angle": 0.0, "max_angle": 0.0, "mean_angle": 0.0, "rom": 0.0}
    
    min_a = min(angles)
    max_a = max(angles)
    mean_a = sum(angles) / len(angles)
    rom = max_a - min_a
    return {
        "min_angle": round(min_a, 2),
        "max_angle": round(max_a, 2),
        "mean_angle": round(mean_a, 2),
        "rom": round(rom, 2)
    }

def calculate_symmetry_index(left_angles: List[float], right_angles: List[float]) -> float:
    """
    Calculates percentage bilateral symmetry index between left and right limb joint angle series.
    100% represents perfect bilateral symmetry.
    """
    if not left_angles or not right_angles or len(left_angles) != len(right_angles):
        return 90.0

    diffs = []
    for l, r in zip(left_angles, right_angles):
        avg = (abs(l) + abs(r)) / 2.0
        if avg > 0:
            diffs.append(abs(l - r) / avg)
        else:
            diffs.append(0.0)

    mean_diff = sum(diffs) / len(diffs)
    symmetry_score = max(0.0, min(100.0, (1.0 - mean_diff) * 100.0))
    return round(symmetry_score, 2)

def calculate_stride_length(left_ankle: Dict[str, float], right_ankle: Dict[str, float], scale_factor: float = 180.0) -> float:
    """Calculates spatial distance between ankles during movement, scaled to cm."""
    dx = left_ankle.get('x', 0) - right_ankle.get('x', 0)
    dy = left_ankle.get('y', 0) - right_ankle.get('y', 0)
    dist = math.sqrt(dx**2 + dy**2)
    # Estimate stride in cm based on normalized frame dimensions
    stride_cm = dist * scale_factor
    return round(stride_cm, 2)

def compute_frame_biomechanics(keypoints: Dict[int, Dict[str, float]]) -> Dict[str, float]:
    """
    Computes all instant biomechanical metrics for a single video frame with 17 keypoints.
    """
    # Keypoint mappings:
    # 5: L Shoulder, 6: R Shoulder, 11: L Hip, 12: R Hip, 13: L Knee, 14: R Knee, 15: L Ankle, 16: R Ankle
    l_shoulder = keypoints.get(5, {'x': 0.4, 'y': 0.25})
    r_shoulder = keypoints.get(6, {'x': 0.6, 'y': 0.25})
    l_hip = keypoints.get(11, {'x': 0.43, 'y': 0.55})
    r_hip = keypoints.get(12, {'x': 0.57, 'y': 0.55})
    l_knee = keypoints.get(13, {'x': 0.42, 'y': 0.75})
    r_knee = keypoints.get(14, {'x': 0.58, 'y': 0.75})
    l_ankle = keypoints.get(15, {'x': 0.41, 'y': 0.92})
    r_ankle = keypoints.get(16, {'x': 0.59, 'y': 0.92})

    left_knee_angle = calculate_vector_angle(l_hip, l_knee, l_ankle)
    right_knee_angle = calculate_vector_angle(r_hip, r_knee, r_ankle)

    left_valgus = calculate_knee_valgus_angle(l_hip, l_knee, l_ankle)
    right_valgus = calculate_knee_valgus_angle(r_hip, r_knee, r_ankle)

    hip_stability = calculate_hip_stability_angle(l_hip, r_hip)
    trunk_lean = calculate_trunk_lean_angle(l_shoulder, r_shoulder, l_hip, r_hip)
    stride_len = calculate_stride_length(l_ankle, r_ankle)

    return {
        "left_knee_angle": round(left_knee_angle, 2),
        "right_knee_angle": round(right_knee_angle, 2),
        "left_knee_valgus": left_valgus,
        "right_knee_valgus": right_valgus,
        "hip_stability_angle": hip_stability,
        "trunk_lean_angle": trunk_lean,
        "stride_length_cm": stride_len
    }
