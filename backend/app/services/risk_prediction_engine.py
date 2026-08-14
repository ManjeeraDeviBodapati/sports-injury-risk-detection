from typing import Dict, Any, List

def predict_specific_injury_probabilities(
    athlete_data: Dict[str, Any],
    biomechanics_eval: Dict[str, Any],
    injury_history: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Predicts specific injury risk probabilities (%) across 6 clinical injury categories:
    ACL, Hamstring, Ankle, Shoulder, Lower Back, and Overuse Risk.
    """
    valgus_deg = biomechanics_eval.get("max_knee_valgus_deg", 0.0)
    hip_tilt_deg = biomechanics_eval.get("max_hip_tilt_deg", 0.0)
    trunk_lean_deg = biomechanics_eval.get("max_trunk_lean_deg", 0.0)
    symmetry_index = biomechanics_eval.get("symmetry_index_percent", 90.0)
    
    flexibility = athlete_data.get("flexibility_score", 75.0)
    strength = athlete_data.get("strength_score", 75.0)
    training_load = athlete_data.get("training_load", "Moderate")

    # Check historical injuries per body part
    has_acl_history = any("ACL" in i.get("injury_name", "") or "Knee" in i.get("affected_body_part", "") for i in injury_history)
    has_hamstring_history = any("Hamstring" in i.get("injury_name", "") or "Thigh" in i.get("affected_body_part", "") for i in injury_history)
    has_ankle_history = any("Ankle" in i.get("injury_name", "") or "Ankle" in i.get("affected_body_part", "") for i in injury_history)
    has_shoulder_history = any("Shoulder" in i.get("injury_name", "") or "Shoulder" in i.get("affected_body_part", "") for i in injury_history)
    has_back_history = any("Back" in i.get("injury_name", "") or "Back" in i.get("affected_body_part", "") for i in injury_history)

    # 1. ACL Injury Risk Probability (%)
    acl_prob = 15.0
    acl_prob += (valgus_deg / 25.0) * 45.0
    if symmetry_index < 85.0: acl_prob += 15.0
    if has_acl_history: acl_prob += 20.0
    acl_prob = min(98.0, max(5.0, round(acl_prob, 1)))

    # 2. Hamstring Injury Risk Probability (%)
    hamstring_prob = 12.0
    if flexibility < 65.0: hamstring_prob += 35.0
    if training_load in ["High", "Very High"]: hamstring_prob += 20.0
    if has_hamstring_history: hamstring_prob += 25.0
    hamstring_prob = min(98.0, max(5.0, round(hamstring_prob, 1)))

    # 3. Ankle Sprain Risk Probability (%)
    ankle_prob = 10.0
    if hip_tilt_deg > 6.0: ankle_prob += 25.0
    if symmetry_index < 85.0: ankle_prob += 20.0
    if has_ankle_history: ankle_prob += 30.0
    ankle_prob = min(98.0, max(5.0, round(ankle_prob, 1)))

    # 4. Shoulder Injury Risk Probability (%)
    shoulder_prob = 10.0
    if athlete_data.get("sport_type") in ["Gymnastics", "Swimming", "Baseball"]: shoulder_prob += 25.0
    if has_shoulder_history: shoulder_prob += 35.0
    shoulder_prob = min(98.0, max(5.0, round(shoulder_prob, 1)))

    # 5. Lower Back Injury Risk Probability (%)
    back_prob = 10.0
    if trunk_lean_deg > 10.0: back_prob += 40.0
    if strength < 70.0: back_prob += 20.0
    if has_back_history: back_prob += 25.0
    back_prob = min(98.0, max(5.0, round(back_prob, 1)))

    # 6. Overuse Injury Risk Probability (%)
    overuse_prob = 15.0
    if training_load == "Very High": overuse_prob += 45.0
    elif training_load == "High": overuse_prob += 25.0
    if len(injury_history) >= 2: overuse_prob += 20.0
    overuse_prob = min(98.0, max(5.0, round(overuse_prob, 1)))

    return {
        "acl_injury_risk_percent": acl_prob,
        "hamstring_injury_risk_percent": hamstring_prob,
        "ankle_sprain_risk_percent": ankle_prob,
        "shoulder_injury_risk_percent": shoulder_prob,
        "lower_back_injury_risk_percent": back_prob,
        "overuse_injury_risk_percent": overuse_prob,
        "highest_risk_category": max(
            [
                ("ACL Injury Risk", acl_prob),
                ("Hamstring Strain Risk", hamstring_prob),
                ("Ankle Sprain Risk", ankle_prob),
                ("Shoulder Injury Risk", shoulder_prob),
                ("Lower Back Injury Risk", back_prob),
                ("Overuse Injury Risk", overuse_prob)
            ],
            key=lambda item: item[1]
        )[0]
    }
