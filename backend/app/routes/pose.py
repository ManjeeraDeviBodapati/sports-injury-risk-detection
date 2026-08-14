from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pose import PoseAnalysis
from app.models.athlete import Athlete
from app.schemas.pose import PoseAnalyzeRequest, PoseAnalysisOut
from app.services.pose_engine import generate_activity_motion_trajectory
from app.services.movement_quality_engine import evaluate_movement_quality

router = APIRouter(prefix="/pose", tags=["Pose Estimation Engine"])

@router.post("/analyze", response_model=PoseAnalysisOut, status_code=status.HTTP_201_CREATED)
def analyze_pose_and_movement(req: PoseAnalyzeRequest, db: Session = Depends(get_db)):
    if req.athlete_id:
        ath = db.query(Athlete).filter(Athlete.id == req.athlete_id).first()
        if not ath:
            raise HTTPException(status_code=404, detail="Athlete not found")

    # Generate or parse motion trajectory
    if req.custom_trajectory:
        trajectory = req.custom_trajectory
    else:
        trajectory = generate_activity_motion_trajectory(req.activity_type, req.frame_count)

    # Evaluate biomechanics & movement quality
    eval_res = evaluate_movement_quality(trajectory, req.activity_type)

    analysis = PoseAnalysis(
        athlete_id=req.athlete_id,
        activity_type=req.activity_type,
        frame_count=len(trajectory),
        movement_quality_score=eval_res["movement_quality_score"],
        biomechanical_efficiency_score=eval_res["biomechanical_efficiency_score"],
        max_knee_valgus_deg=eval_res["max_knee_valgus_deg"],
        max_hip_tilt_deg=eval_res["max_hip_tilt_deg"],
        max_trunk_lean_deg=eval_res["max_trunk_lean_deg"],
        symmetry_index_percent=eval_res["symmetry_index_percent"],
        trajectory_json=trajectory,
        deviations_json=eval_res["technique_deviations"]
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis

@router.get("/analyses/{athlete_id}", response_model=List[PoseAnalysisOut])
def get_athlete_pose_analyses(athlete_id: int, db: Session = Depends(get_db)):
    return db.query(PoseAnalysis).filter(PoseAnalysis.athlete_id == athlete_id).order_by(PoseAnalysis.id.desc()).all()

@router.get("/analysis/{analysis_id}", response_model=PoseAnalysisOut)
def get_pose_analysis_by_id(analysis_id: int, db: Session = Depends(get_db)):
    res = db.query(PoseAnalysis).filter(PoseAnalysis.id == analysis_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Pose analysis session not found")
    return res
