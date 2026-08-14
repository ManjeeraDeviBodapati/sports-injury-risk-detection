from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.athlete import Athlete
from app.models.injury import InjuryHistory
from app.models.assessment import PhysicalAssessment
from app.schemas.athlete import AthleteCreate, AthleteUpdate, AthleteOut
from app.schemas.injury import InjuryCreate, InjuryOut
from app.schemas.assessment import AssessmentCreate, AssessmentOut

router = APIRouter(prefix="/athletes", tags=["Athlete Management"])

def generate_athlete_code(db: Session) -> str:
    count = db.query(Athlete).count()
    return f"ATH-1{count + 1:03d}"

@router.post("/", response_model=AthleteOut, status_code=status.HTTP_201_CREATED)
def create_athlete(data: AthleteCreate, db: Session = Depends(get_db)):
    code = generate_athlete_code(db)
    athlete = Athlete(
        athlete_code=code,
        full_name=data.full_name,
        sport_type=data.sport_type,
        position=data.position,
        age=data.age,
        height=data.height,
        weight=data.weight,
        training_load=data.training_load,
        user_id=data.user_id
    )
    db.add(athlete)
    db.commit()
    db.refresh(athlete)
    return athlete

@router.get("/", response_model=List[AthleteOut])
def get_athletes(
    q: Optional[str] = None,
    sport_type: Optional[str] = None,
    training_load: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Athlete)
    if q:
        query = query.filter(
            (Athlete.full_name.ilike(f"%{q}%")) | (Athlete.athlete_code.ilike(f"%{q}%"))
        )
    if sport_type:
        query = query.filter(Athlete.sport_type == sport_type)
    if training_load:
        query = query.filter(Athlete.training_load == training_load)
    return query.order_by(Athlete.id.desc()).all()

@router.get("/{athlete_id}", response_model=AthleteOut)
def get_athlete_by_id(athlete_id: int, db: Session = Depends(get_db)):
    athlete = db.query(Athlete).filter(Athlete.id == athlete_id).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")
    return athlete

@router.put("/{athlete_id}", response_model=AthleteOut)
def update_athlete(athlete_id: int, data: AthleteUpdate, db: Session = Depends(get_db)):
    athlete = db.query(Athlete).filter(Athlete.id == athlete_id).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")
    
    for field, value in data.dict(exclude_unset=True).items():
        setattr(athlete, field, value)

    db.commit()
    db.refresh(athlete)
    return athlete

@router.delete("/{athlete_id}", status_code=status.HTTP_200_OK)
def delete_athlete(athlete_id: int, db: Session = Depends(get_db)):
    athlete = db.query(Athlete).filter(Athlete.id == athlete_id).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")
    
    db.delete(athlete)
    db.commit()
    return {"message": f"Athlete '{athlete.full_name}' deleted successfully"}

# --- Injury History Endpoints ---

@router.post("/{athlete_id}/injuries", response_model=InjuryOut, status_code=status.HTTP_201_CREATED)
def add_injury_record(athlete_id: int, injury_in: InjuryCreate, db: Session = Depends(get_db)):
    athlete = db.query(Athlete).filter(Athlete.id == athlete_id).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")

    injury = InjuryHistory(
        athlete_id=athlete_id,
        injury_name=injury_in.injury_name,
        affected_body_part=injury_in.affected_body_part,
        injury_date=injury_in.injury_date,
        recovery_status=injury_in.recovery_status,
        severity=injury_in.severity,
        notes=injury_in.notes
    )
    db.add(injury)
    db.commit()
    db.refresh(injury)
    return injury

@router.get("/{athlete_id}/injuries", response_model=List[InjuryOut])
def get_athlete_injuries(athlete_id: int, db: Session = Depends(get_db)):
    athlete = db.query(Athlete).filter(Athlete.id == athlete_id).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")
    return db.query(InjuryHistory).filter(InjuryHistory.athlete_id == athlete_id).all()

# --- Physical Assessment Endpoints ---

@router.post("/{athlete_id}/assessments", response_model=AssessmentOut, status_code=status.HTTP_201_CREATED)
def add_assessment_record(athlete_id: int, assessment_in: AssessmentCreate, db: Session = Depends(get_db)):
    athlete = db.query(Athlete).filter(Athlete.id == athlete_id).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")

    assessment = PhysicalAssessment(
        athlete_id=athlete_id,
        assessment_date=assessment_in.assessment_date,
        flexibility_score=assessment_in.flexibility_score,
        strength_score=assessment_in.strength_score,
        endurance_score=assessment_in.endurance_score,
        movement_screening_notes=assessment_in.movement_screening_notes,
        assessed_by=assessment_in.assessed_by
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment

@router.get("/{athlete_id}/assessments", response_model=List[AssessmentOut])
def get_athlete_assessments(athlete_id: int, db: Session = Depends(get_db)):
    athlete = db.query(Athlete).filter(Athlete.id == athlete_id).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")
    return db.query(PhysicalAssessment).filter(PhysicalAssessment.athlete_id == athlete_id).all()