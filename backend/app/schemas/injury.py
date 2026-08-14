from datetime import date
from typing import Optional
from pydantic import BaseModel

class InjuryCreate(BaseModel):
    injury_name: str
    affected_body_part: str
    injury_date: date
    recovery_status: str = "Rehab In Progress" # Fully Recovered, Rehab In Progress, Active Pain
    severity: str = "Moderate" # Mild, Moderate, Severe, Critical
    notes: Optional[str] = None

class InjuryOut(BaseModel):
    id: int
    athlete_id: int
    injury_name: str
    affected_body_part: str
    injury_date: date
    recovery_status: str
    severity: str
    notes: Optional[str] = None

    class Config:
        from_attributes = True
