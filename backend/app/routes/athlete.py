from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.athlete import Athlete
from app.schemas.athlete import AthleteCreate

router = APIRouter(prefix="/athlete", tags=["Athlete"])

@router.post("/")
def add_athlete(data: AthleteCreate, db: Session = Depends(get_db)):
    athlete = Athlete(
        full_name=data.full_name,
        sport_type=data.sport_type,
        position=data.position,
        age=data.age,
        height=data.height,
        weight=data.weight,
        training_load=data.training_load
    )

    db.add(athlete)
    db.commit()
    db.refresh(athlete)

    return {
        "message": "Athlete Added Successfully",
        "athlete": athlete.id
    }


@router.get("/")
def get_athletes(db: Session = Depends(get_db)):
    return db.query(Athlete).all()