from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class PoseAnalyzeRequest(BaseModel):
    athlete_id: Optional[int] = None
    activity_type: str = "Squatting" # Sprinting, Jumping, Squatting, Landing, Cutting, Running, Throwing
    frame_count: int = 30
    custom_trajectory: Optional[List[Dict[str, Any]]] = None

class PoseAnalysisOut(BaseModel):
    id: int
    athlete_id: Optional[int] = None
    activity_type: str
    frame_count: int
    movement_quality_score: float
    biomechanical_efficiency_score: float
    max_knee_valgus_deg: float
    max_hip_tilt_deg: float
    max_trunk_lean_deg: float
    symmetry_index_percent: float
    trajectory_json: Optional[List[Dict[str, Any]]] = None
    deviations_json: Optional[List[Dict[str, Any]]] = None
    created_at: datetime

    class Config:
        from_attributes = True
