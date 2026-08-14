from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.schemas.injury import InjuryOut
from app.schemas.assessment import AssessmentOut

class AthleteCreate(BaseModel):
    full_name: str
    sport_type: str
    position: str
    age: int
    height: float # cm
    weight: float # kg
    training_load: str = "Moderate" # Low, Moderate, High, Very High
    user_id: Optional[int] = None

class AthleteUpdate(BaseModel):
    full_name: Optional[str] = None
    sport_type: Optional[str] = None
    position: Optional[str] = None
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    training_load: Optional[str] = None

class AthleteOut(BaseModel):
    id: int
    athlete_code: str
    full_name: str
    sport_type: str
    position: str
    age: int
    height: float
    weight: float
    training_load: str
    user_id: Optional[int] = None
    created_at: datetime
    injury_history: List[InjuryOut] = []
    assessments: List[AssessmentOut] = []

    class Config:
        from_attributes = True