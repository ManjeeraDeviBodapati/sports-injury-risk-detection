from datetime import date
from typing import Optional
from pydantic import BaseModel

class AssessmentCreate(BaseModel):
    assessment_date: date
    flexibility_score: float = 75.0
    strength_score: float = 75.0
    endurance_score: float = 75.0
    movement_screening_notes: Optional[str] = None
    assessed_by: str

class AssessmentOut(BaseModel):
    id: int
    athlete_id: int
    assessment_date: date
    flexibility_score: float
    strength_score: float
    endurance_score: float
    movement_screening_notes: Optional[str] = None
    assessed_by: str

    class Config:
        from_attributes = True
