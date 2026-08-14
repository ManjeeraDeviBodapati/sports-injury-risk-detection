from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pose import PoseAnalysis
from app.models.athlete import Athlete
from app.services.movement_quality_engine import evaluate_movement_quality
from app.services.report_generator import generate_biomechanics_html_report

router = APIRouter(prefix="/reports", tags=["Biomechanics Reports & Export"])

@router.get("/biomechanics/{analysis_id}")
def get_biomechanics_report_json(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(PoseAnalysis).filter(PoseAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis session not found")

    athlete_name = "Guest Athlete"
    athlete_code = "ATH-GUEST"
    if analysis.athlete_id:
        ath = db.query(Athlete).filter(Athlete.id == analysis.athlete_id).first()
        if ath:
            athlete_name = ath.full_name
            athlete_code = ath.athlete_code

    eval_metrics = evaluate_movement_quality(analysis.trajectory_json or [], analysis.activity_type)

    return {
        "report_id": f"REP-BIO-{analysis.id:04d}",
        "analysis_id": analysis.id,
        "athlete_name": athlete_name,
        "athlete_code": athlete_code,
        "activity_type": analysis.activity_type,
        "created_at": analysis.created_at,
        "movement_quality_score": analysis.movement_quality_score,
        "biomechanical_efficiency_score": analysis.biomechanical_efficiency_score,
        "metrics": eval_metrics
    }

@router.get("/biomechanics/{analysis_id}/export")
def export_biomechanics_html_report(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(PoseAnalysis).filter(PoseAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis session not found")

    athlete_name = "Guest Athlete"
    athlete_code = "ATH-GUEST"
    if analysis.athlete_id:
        ath = db.query(Athlete).filter(Athlete.id == analysis.athlete_id).first()
        if ath:
            athlete_name = ath.full_name
            athlete_code = ath.athlete_code

    eval_metrics = evaluate_movement_quality(analysis.trajectory_json or [], analysis.activity_type)
    html_content = generate_biomechanics_html_report(athlete_name, athlete_code, analysis.activity_type, eval_metrics)

    return Response(content=html_content, media_type="text/html")
