import io
import csv
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.athlete import Athlete
from app.models.risk import InjuryRiskRecord
from app.models.pose import PoseAnalysis

router = APIRouter(prefix="/exports", tags=["Reports & Dataset Exports"])

@router.get("/athletes/csv")
def export_athletes_csv(db: Session = Depends(get_db)):
    athletes = db.query(Athlete).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Athlete Code", "Full Name", "Sport Type", "Position", "Age", "Height (cm)", "Weight (kg)", "Training Load"])
    
    for a in athletes:
        writer.writerow([a.id, a.athlete_code, a.full_name, a.sport_type, a.position, a.age, a.height, a.weight, a.training_load])
        
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=athletes_dataset_export.csv"}
    )

@router.get("/risk-reports/csv")
def export_risk_reports_csv(db: Session = Depends(get_db)):
    records = db.query(InjuryRiskRecord).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Athlete ID", "Risk Score", "Health Score", "Risk Category", "ACL Risk %", "Hamstring Risk %", "Ankle Risk %", "Shoulder Risk %", "Lower Back Risk %", "Overuse Risk %", "Date"])
    
    for r in records:
        writer.writerow([
            r.id, r.athlete_id, r.overall_risk_score, r.overall_health_score, r.risk_category,
            r.acl_risk_percent, r.hamstring_risk_percent, r.ankle_risk_percent,
            r.shoulder_risk_percent, r.lower_back_risk_percent, r.overuse_risk_percent,
            r.created_at.strftime("%Y-%m-%d %H:%M")
        ])
        
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=injury_risk_analytics_export.csv"}
    )

@router.get("/biomechanics/csv")
def export_biomechanics_analytics_csv(db: Session = Depends(get_db)):
    sessions = db.query(PoseAnalysis).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Athlete ID", "Activity", "Frame Count", "Quality Score", "Efficiency Score", "Max Knee Valgus", "Max Hip Tilt", "Max Trunk Lean", "Symmetry Index %"])
    
    for s in sessions:
        writer.writerow([
            s.id, s.athlete_id, s.activity_type, s.frame_count,
            s.movement_quality_score, s.biomechanical_efficiency_score,
            s.max_knee_valgus_deg, s.max_hip_tilt_deg, s.max_trunk_lean_deg,
            s.symmetry_index_percent
        ])
        
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=biomechanics_pose_analytics_export.csv"}
    )
