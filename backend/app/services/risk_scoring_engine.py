from typing import Dict, Any, List

def calculate_weighted_injury_risk_score(
    biomechanical_deviation_score: float, # 0.0 - 100.0 (higher = worse)
    historical_injury_score: float,      # 0.0 - 100.0 (higher = worse)
    movement_asymmetry_score: float,      # 0.0 - 100.0 (higher = worse)
    training_load_score: float,           # 0.0 - 100.0 (higher = worse)
    fatigue_indicator_score: float        # 0.0 - 100.0 (higher = worse)
) -> Dict[str, Any]:
    """
    Computes weighted injury risk score according to specification formula:
    Injury Risk Score = (35% * Biomechanical Deviations) + 
                        (20% * Historical Injury Factors) + 
                        (20% * Movement Asymmetry) + 
                        (15% * Training Load Indicators) + 
                        (10% * Fatigue Indicators)
    """
    w_biometrics = 0.35 * max(0.0, min(100.0, biomechanical_deviation_score))
    w_history = 0.20 * max(0.0, min(100.0, historical_injury_score))
    w_asymmetry = 0.20 * max(0.0, min(100.0, movement_asymmetry_score))
    w_load = 0.15 * max(0.0, min(100.0, training_load_score))
    w_fatigue = 0.10 * max(0.0, min(100.0, fatigue_indicator_score))

    overall_risk_score = round(w_biometrics + w_history + w_asymmetry + w_load + w_fatigue, 1)

    # Risk Categorization
    if overall_risk_score <= 25.0:
        risk_category = "Low Risk"
        risk_color = "#10b981" # Emerald
    elif overall_risk_score <= 50.0:
        risk_category = "Moderate Risk"
        risk_color = "#f59e0b" # Amber
    elif overall_risk_score <= 75.0:
        risk_category = "High Risk"
        risk_color = "#f43f5e" # Rose
    else:
        risk_category = "Critical Risk"
        risk_color = "#991b1b" # Dark Red

    overall_health_score = round(max(0.0, 100.0 - overall_risk_score), 1)

    return {
        "overall_injury_risk_score": overall_risk_score,
        "overall_health_score": overall_health_score,
        "risk_category": risk_category,
        "risk_color": risk_color,
        "weighted_components": {
            "biomechanical_deviations_weighted": round(w_biometrics, 1),
            "historical_injury_weighted": round(w_history, 1),
            "movement_asymmetry_weighted": round(w_asymmetry, 1),
            "training_load_weighted": round(w_load, 1),
            "fatigue_indicators_weighted": round(w_fatigue, 1)
        },
        "raw_component_scores": {
            "biomechanical_deviation_score": round(biomechanical_deviation_score, 1),
            "historical_injury_score": round(historical_injury_score, 1),
            "movement_asymmetry_score": round(movement_asymmetry_score, 1),
            "training_load_score": round(training_load_score, 1),
            "fatigue_indicator_score": round(fatigue_indicator_score, 1)
        }
    }
