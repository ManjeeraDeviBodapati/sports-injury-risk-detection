from typing import Dict, Any, List

def detect_movement_anomalies(trajectory: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Detects motion anomalies, fatigue degradation, and technique inconsistency across frame series.
    """
    if not trajectory or len(trajectory) < 5:
        return {
            "anomaly_detected": False,
            "fatigue_degradation_index": 5.0,
            "anomalies": []
        }

    anomalies = []
    
    # 1. Compare early vs late frames to detect fatigue-induced valgus degradation
    early_valgus = [f["joint_angles"]["left_knee_valgus"] for f in trajectory[:10] if "joint_angles" in f]
    late_valgus = [f["joint_angles"]["left_knee_valgus"] for f in trajectory[-10:] if "joint_angles" in f]

    avg_early = sum(early_valgus) / len(early_valgus) if early_valgus else 0
    avg_late = sum(late_valgus) / len(late_valgus) if late_valgus else 0

    valgus_degradation = avg_late - avg_early
    fatigue_index = max(0.0, min(100.0, (valgus_degradation / 10.0) * 100.0 + 10.0))

    if valgus_degradation > 5.0:
        anomalies.append({
            "type": "FATIGUE_VALGUS_DEGRADATION",
            "frame_range": f"Frames {len(trajectory)-10} to {len(trajectory)}",
            "severity": "High",
            "description": f"Knee valgus collapse increased by {valgus_degradation:.1f}° toward the end of motion sequence, indicating neuromuscular fatigue."
        })

    # 2. Check for sudden kinematic spikes / jerks
    angles = [f["joint_angles"]["left_knee_angle"] for f in trajectory if "joint_angles" in f]
    spikes = 0
    for i in range(1, len(angles)):
        if abs(angles[i] - angles[i-1]) > 25.0:
            spikes += 1

    if spikes > 0:
        anomalies.append({
            "type": "KINEMATIC_JERK_SPIKE",
            "frame_range": "Dynamic Sequence",
            "severity": "Moderate",
            "description": f"Detected {spikes} rapid angular acceleration spike(s), indicating uncoordinated joint deceleration."
        })

    return {
        "anomaly_detected": len(anomalies) > 0,
        "fatigue_degradation_index": round(fatigue_index, 1),
        "anomalies": anomalies
    }
