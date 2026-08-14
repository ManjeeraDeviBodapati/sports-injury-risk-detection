from typing import Dict, Any, List

def generate_corrective_recommendations(
    risk_score_data: Dict[str, Any],
    injury_probabilities: Dict[str, Any],
    deviations: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Generates targeted corrective exercise recommendations, mobility drills, strengthening plans,
    and training load modifications based on identified risk factors.
    """
    recommendations = []
    
    # 1. Check ACL & Knee Valgus Flaws
    acl_risk = injury_probabilities.get("acl_injury_risk_percent", 0.0)
    if acl_risk > 40.0:
        recommendations.append({
            "category": "Neuromuscular & ACL Retraining",
            "title": "Single-Leg Jump Landing & Valgus Control",
            "exercise": "Single-leg stick landings on foam pad with mirror feedback",
            "dosage": "3 sets x 8 reps per leg (3x weekly)",
            "focus": "Focus on keeping knee aligned over second toe upon landing impact.",
            "priority": "High" if acl_risk > 60.0 else "Medium"
        })
        recommendations.append({
            "category": "Hamstring Strengthening",
            "title": "Nordic Hamstring Eccentric Curls",
            "exercise": "Kneeling eccentric hamstring lowers with partner support",
            "dosage": "3 sets x 5 reps (2x weekly)",
            "focus": "Improves eccentric hamstring capacity during deceleration.",
            "priority": "High"
        })

    # 2. Check Hip Tilt & Pelvic Instability
    if any(d.get("code") == "PELVIC_DROP_UNSTABLE_HIP" for d in deviations) or injury_probabilities.get("ankle_sprain_risk_percent", 0.0) > 35.0:
        recommendations.append({
            "category": "Hip Stability & Core",
            "title": "Side-Lying Clamshells & Glute Medius Bridges",
            "exercise": "Banded side clamshells and single-leg hip thrusts",
            "dosage": "3 sets x 15 reps per side (Daily warm-up)",
            "focus": "Strengthens Gluteus Medius to prevent pelvic drop.",
            "priority": "High"
        })

    # 3. Check Trunk Lean & Lower Back Risk
    back_risk = injury_probabilities.get("lower_back_injury_risk_percent", 0.0)
    if back_risk > 35.0:
        recommendations.append({
            "category": "Trunk Anti-Rotation & Core",
            "title": "Pallof Press & Bird-Dog Holds",
            "exercise": "Cable anti-rotation press + quadruped opposite arm/leg extension",
            "dosage": "3 sets x 10 holds per side",
            "focus": "Builds lumbar spine anti-rotational stiffness under dynamic load.",
            "priority": "High"
        })

    # 4. Check Training Load / Fatigue / Overuse
    overuse_risk = injury_probabilities.get("overuse_injury_risk_percent", 0.0)
    if overuse_risk > 50.0 or risk_score_data.get("risk_category") in ["High Risk", "Critical Risk"]:
        recommendations.append({
            "category": "Recovery Protocol & Training Modification",
            "title": "Deload & Workload Modification",
            "exercise": "Reduce high-speed deceleration volume by 30% for 7 days + Contrast Bath Therapy",
            "dosage": "7-day training load reduction",
            "focus": "Allows neuromuscular recovery and reduces acute-to-chronic workload spike.",
            "priority": "Critical"
        })

    # Default fallback exercise if no major flaws
    if not recommendations:
        recommendations.append({
            "category": "Maintenance & Mobility",
            "title": "Dynamic Multi-Planar Mobility Warm-Up",
            "exercise": "World's Greatest Stretch + Ankle Dorsiflexion Wall Mobilization",
            "dosage": "10 minutes before every training session",
            "focus": "Maintains optimal joint range of motion and movement symmetry.",
            "priority": "Low"
        })

    return recommendations
