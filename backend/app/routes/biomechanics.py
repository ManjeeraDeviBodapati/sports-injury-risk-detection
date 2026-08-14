from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pose import PoseAnalysis
from app.services.movement_quality_engine import evaluate_movement_quality

router = APIRouter(prefix="/biomechanics", tags=["Biomechanical Analysis Engine"])

@router.get("/analysis/{analysis_id}")
def get_biomechanical_breakdown(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(PoseAnalysis).filter(PoseAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis session not found")

    trajectory = analysis.trajectory_json or []
    eval_metrics = evaluate_movement_quality(trajectory, analysis.activity_type)

    return {
        "analysis_id": analysis.id,
        "athlete_id": analysis.athlete_id,
        "activity_type": analysis.activity_type,
        "frame_count": analysis.frame_count,
        "created_at": analysis.created_at,
        "biomechanics_summary": eval_metrics
    }

@router.get("/athlete/{athlete_id}/trends")
def get_athlete_biomechanical_trends(athlete_id: int, db: Session = Depends(get_db)):
    sessions = db.query(PoseAnalysis).filter(PoseAnalysis.athlete_id == athlete_id).order_by(PoseAnalysis.id.asc()).all()
    
    return {
        "athlete_id": athlete_id,
        "session_count": len(sessions),
        "history": [
            {
                "id": s.id,
                "date": s.created_at.strftime("%Y-%m-%d"),
                "activity": s.activity_type,
                "quality_score": s.movement_quality_score,
                "max_valgus": s.max_knee_valgus_deg,
                "symmetry": s.symmetry_index_percent
            }
            for s in sessions
        ]
    }
