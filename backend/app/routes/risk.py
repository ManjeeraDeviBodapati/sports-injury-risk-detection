from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.athlete import Athlete
from app.models.injury import InjuryHistory
from app.models.assessment import PhysicalAssessment
from app.models.pose import PoseAnalysis
from app.models.risk import InjuryRiskRecord, CorrectiveRecommendation
from app.schemas.risk import InjuryRiskAssessmentOut, RecommendationOut

from app.services.risk_scoring_engine import calculate_weighted_injury_risk_score
from app.services.risk_prediction_engine import predict_specific_injury_probabilities
from app.services.anomaly_detection_engine import detect_movement_anomalies
from app.services.recommendation_engine import generate_corrective_recommendations

router = APIRouter(prefix="/risk", tags=["Injury Risk Prediction & Recommendation Engine"])

@router.post("/assess/{athlete_id}", response_model=InjuryRiskAssessmentOut, status_code=status.HTTP_201_CREATED)
def assess_athlete_injury_risk(athlete_id: int, db: Session = Depends(get_db)):
    ath = db.query(Athlete).filter(Athlete.id == athlete_id).first()
    if not ath:
        raise HTTPException(status_code=404, detail="Athlete not found")

    # Fetch latest pose analysis, injury history, and physical assessment
    latest_pose = db.query(PoseAnalysis).filter(PoseAnalysis.athlete_id == athlete_id).order_by(PoseAnalysis.id.desc()).first()
    injuries = db.query(InjuryHistory).filter(InjuryHistory.athlete_id == athlete_id).all()
    latest_assessment = db.query(PhysicalAssessment).filter(PhysicalAssessment.athlete_id == athlete_id).order_by(PhysicalAssessment.id.desc()).first()

    # Extract component scores for 5-weighted formula
    # 1. Biomechanical Deviations (35%)
    valgus_deg = latest_pose.max_knee_valgus_deg if latest_pose else 12.0
    biometrics_score = min(100.0, (valgus_deg / 20.0) * 100.0)

    # 2. Historical Injury Factors (20%)
    active_injuries = [i for i in injuries if i.recovery_status != 'Fully Recovered']
    history_score = min(100.0, len(injuries) * 25.0 + len(active_injuries) * 35.0)

    # 3. Movement Asymmetry (20%)
    symmetry = latest_pose.symmetry_index_percent if latest_pose else 88.0
    asymmetry_score = max(0.0, (100.0 - symmetry) * 3.0)

    # 4. Training Load Indicators (15%)
    load_map = {"Low": 20.0, "Moderate": 50.0, "High": 80.0, "Very High": 95.0}
    load_score = load_map.get(ath.training_load, 50.0)

    # 5. Fatigue Indicators (10%)
    trajectory = latest_pose.trajectory_json if latest_pose else []
    anomaly_eval = detect_movement_anomalies(trajectory)
    fatigue_score = anomaly_eval.get("fatigue_degradation_index", 20.0)

    # Calculate 5-component weighted score
    risk_res = calculate_weighted_injury_risk_score(
        biometrics_score, history_score, asymmetry_score, load_score, fatigue_score
    )

    # Predict 6 specific injury category probabilities
    ath_dict = {
        "flexibility_score": latest_assessment.flexibility_score if latest_assessment else 75.0,
        "strength_score": latest_assessment.strength_score if latest_assessment else 75.0,
        "sport_type": ath.sport_type,
        "training_load": ath.training_load
    }
    bio_dict = {
        "max_knee_valgus_deg": valgus_deg,
        "max_hip_tilt_deg": latest_pose.max_hip_tilt_deg if latest_pose else 4.0,
        "max_trunk_lean_deg": latest_pose.max_trunk_lean_deg if latest_pose else 5.0,
        "symmetry_index_percent": symmetry
    }
    inj_list = [{"injury_name": i.injury_name, "affected_body_part": i.affected_body_part} for i in injuries]

    probs = predict_specific_injury_probabilities(ath_dict, bio_dict, inj_list)

    # Generate Corrective Exercise Recommendations
    recs_list = generate_corrective_recommendations(
        risk_res, probs, latest_pose.deviations_json if latest_pose else []
    )

    # Save to database
    record = InjuryRiskRecord(
        athlete_id=athlete_id,
        overall_risk_score=risk_res["overall_injury_risk_score"],
        overall_health_score=risk_res["overall_health_score"],
        risk_category=risk_res["risk_category"],
        acl_risk_percent=probs["acl_injury_risk_percent"],
        hamstring_risk_percent=probs["hamstring_injury_risk_percent"],
        ankle_risk_percent=probs["ankle_sprain_risk_percent"],
        shoulder_risk_percent=probs["shoulder_injury_risk_percent"],
        lower_back_risk_percent=probs["lower_back_injury_risk_percent"],
        overuse_risk_percent=probs["overuse_injury_risk_percent"],
        weighted_scores_json=risk_res["weighted_components"],
        anomalies_json=anomaly_eval
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    # Save recommendations
    for r in recs_list:
        rec_obj = CorrectiveRecommendation(
            risk_record_id=record.id,
            athlete_id=athlete_id,
            category=r["category"],
            title=r["title"],
            exercise=r["exercise"],
            dosage=r["dosage"],
            focus=r["focus"],
            priority=r["priority"]
        )
        db.add(rec_obj)
    db.commit()
    db.refresh(record)

    return record

@router.get("/athlete/{athlete_id}", response_model=InjuryRiskAssessmentOut)
def get_athlete_risk_assessment(athlete_id: int, db: Session = Depends(get_db)):
    rec = db.query(InjuryRiskRecord).filter(InjuryRiskRecord.athlete_id == athlete_id).order_by(InjuryRiskRecord.id.desc()).first()
    if not rec:
        # Auto-assess if not found
        return assess_athlete_injury_risk(athlete_id, db)
    return rec

@router.get("/team-overview")
def get_team_risk_overview(db: Session = Depends(get_db)):
    athletes = db.query(Athlete).all()
    overview = []
    
    cat_counts = {"Low Risk": 0, "Moderate Risk": 0, "High Risk": 0, "Critical Risk": 0}

    for ath in athletes:
        rec = db.query(InjuryRiskRecord).filter(InjuryRiskRecord.athlete_id == ath.id).order_by(InjuryRiskRecord.id.desc()).first()
        if not rec:
            risk_score = 25.0
            category = "Low Risk"
        else:
            risk_score = rec.overall_risk_score
            category = rec.risk_category

        cat_counts[category] = cat_counts.get(category, 0) + 1

        overview.append({
            "athlete_id": ath.id,
            "athlete_code": ath.athlete_code,
            "full_name": ath.full_name,
            "sport_type": ath.sport_type,
            "position": ath.position,
            "risk_score": risk_score,
            "risk_category": category,
            "training_load": ath.training_load
        })

    return {
        "total_athletes": len(athletes),
        "risk_distribution": cat_counts,
        "athletes": overview
    }

@router.get("/recommendations/{athlete_id}", response_model=List[RecommendationOut])
def get_athlete_recommendations(athlete_id: int, db: Session = Depends(get_db)):
    return db.query(CorrectiveRecommendation).filter(CorrectiveRecommendation.athlete_id == athlete_id).order_by(CorrectiveRecommendation.id.desc()).all()
