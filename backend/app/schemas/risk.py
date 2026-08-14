from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class RecommendationOut(BaseModel):
    id: int
    category: str
    title: str
    exercise: str
    dosage: str
    focus: str
    priority: str

    class Config:
        from_attributes = True

class InjuryRiskAssessmentOut(BaseModel):
    id: int
    athlete_id: int
    overall_risk_score: float
    overall_health_score: float
    risk_category: str
    
    acl_risk_percent: float
    hamstring_risk_percent: float
    ankle_risk_percent: float
    shoulder_risk_percent: float
    lower_back_risk_percent: float
    overuse_risk_percent: float
    
    weighted_scores_json: Optional[Dict[str, Any]] = None
    anomalies_json: Optional[Dict[str, Any]] = None
    created_at: datetime
    recommendations: List[RecommendationOut] = []

    class Config:
        from_attributes = True
