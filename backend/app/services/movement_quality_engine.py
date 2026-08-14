from typing import List, Dict, Any
from app.services.biomechanics_engine import calculate_range_of_motion, calculate_symmetry_index

def evaluate_movement_quality(trajectory: List[Dict[str, Any]], activity_type: str) -> Dict[str, Any]:
    """
    Evaluates movement quality, detects biomechanical technique deviations against clinical benchmarks,
    and calculates Movement Quality Score & Biomechanical Efficiency Score.
    """
    if not trajectory:
        return {
            "movement_quality_score": 85.0,
            "biomechanical_efficiency_score": 88.0,
            "technique_deviations": [],
            "risk_warnings": [],
            "summary": "No trajectory frames provided."
        }

    left_valgus_series = [f["joint_angles"]["left_knee_valgus"] for f in trajectory if "joint_angles" in f]
    right_valgus_series = [f["joint_angles"]["right_knee_valgus"] for f in trajectory if "joint_angles" in f]
    hip_tilt_series = [f["joint_angles"]["hip_stability_angle"] for f in trajectory if "joint_angles" in f]
    trunk_lean_series = [f["joint_angles"]["trunk_lean_angle"] for f in trajectory if "joint_angles" in f]
    left_knee_angles = [f["joint_angles"]["left_knee_angle"] for f in trajectory if "joint_angles" in f]
    right_knee_angles = [f["joint_angles"]["right_knee_angle"] for f in trajectory if "joint_angles" in f]

    peak_left_valgus = max(left_valgus_series) if left_valgus_series else 0.0
    peak_right_valgus = max(right_valgus_series) if right_valgus_series else 0.0
    max_valgus = max(peak_left_valgus, peak_right_valgus)

    peak_hip_tilt = max(hip_tilt_series) if hip_tilt_series else 0.0
    peak_trunk_lean = max(trunk_lean_series) if trunk_lean_series else 0.0

    symmetry_index = calculate_symmetry_index(left_knee_angles, right_knee_angles)
    left_rom = calculate_range_of_motion(left_knee_angles)
    right_rom = calculate_range_of_motion(right_knee_angles)

    technique_deviations = []
    risk_warnings = []

    # 1. Knee Valgus Check (ACL Injury Risk Factor)
    if max_valgus > 15.0:
        technique_deviations.append({
            "code": "EXCESSIVE_KNEE_VALGUS",
            "severity": "High",
            "metric": f"{max_valgus:.1f}° Peak Valgus (Benchmark ≤ 10.0°)",
            "finding": "Excessive inward medial knee collapse observed during peak deceleration / landing.",
            "associated_risk": "ACL Injury Risk & Patellofemoral Pain Syndrome"
        })
        risk_warnings.append("High ACL Injury Risk: Medial knee valgus collapse exceeds safety threshold.")
    elif max_valgus > 10.0:
        technique_deviations.append({
            "code": "MODERATE_KNEE_VALGUS",
            "severity": "Moderate",
            "metric": f"{max_valgus:.1f}° Peak Valgus",
            "finding": "Mild inward knee displacement during movement phase.",
            "associated_risk": "Mild Patellar Tendon Strain"
        })

    # 2. Hip Stability / Pelvic Drop Check
    if peak_hip_tilt > 8.0:
        technique_deviations.append({
            "code": "PELVIC_DROP_UNSTABLE_HIP",
            "severity": "Moderate",
            "metric": f"{peak_hip_tilt:.1f}° Pelvic Tilt (Benchmark ≤ 5.0°)",
            "finding": "Contralateral pelvic drop detected during single-leg support phase.",
            "associated_risk": "Gluteus Medius Weakness & IT Band Syndrome"
        })
        risk_warnings.append("Pelvic Instability: Lateral hip drop observed during single-leg stance.")

    # 3. Trunk Lateral Lean Check
    if peak_trunk_lean > 12.0:
        technique_deviations.append({
            "code": "EXCESSIVE_TRUNK_LEAN",
            "severity": "Moderate",
            "metric": f"{peak_trunk_lean:.1f}° Trunk Lean (Benchmark ≤ 8.0°)",
            "finding": "Excessive lateral upper body lean observed during direction changes.",
            "associated_risk": "Lower Back Injury Risk & Lumbar Compensation"
        })

    # 4. Movement Asymmetry Check
    if symmetry_index < 85.0:
        technique_deviations.append({
            "code": "BILATERAL_MOVEMENT_ASYMMETRY",
            "severity": "High" if symmetry_index < 75.0 else "Moderate",
            "metric": f"{symmetry_index:.1f}% Symmetry Index (Benchmark ≥ 90.0%)",
            "finding": "Significant asymmetry detected between left and right limb kinematics.",
            "associated_risk": "Asymmetrical Load Distribution & Overuse Injury Risk"
        })

    # Calculate Deductions for Overall Quality Score
    score_deduction = 0.0
    score_deduction += min(35.0, (max_valgus / 25.0) * 35.0)
    score_deduction += min(20.0, (peak_hip_tilt / 15.0) * 20.0)
    score_deduction += min(15.0, (peak_trunk_lean / 20.0) * 15.0)
    score_deduction += min(20.0, ((100.0 - symmetry_index) / 30.0) * 20.0)

    quality_score = max(35.0, min(100.0, 100.0 - score_deduction))
    efficiency_score = max(40.0, min(100.0, quality_score * 1.05))

    return {
        "movement_quality_score": round(quality_score, 1),
        "biomechanical_efficiency_score": round(efficiency_score, 1),
        "symmetry_index_percent": symmetry_index,
        "max_knee_valgus_deg": max_valgus,
        "max_hip_tilt_deg": peak_hip_tilt,
        "max_trunk_lean_deg": peak_trunk_lean,
        "left_knee_rom": left_rom,
        "right_knee_rom": right_rom,
        "technique_deviations": technique_deviations,
        "risk_warnings": risk_warnings
    }
