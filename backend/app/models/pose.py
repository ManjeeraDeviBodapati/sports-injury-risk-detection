import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class PoseAnalysis(Base):
    __tablename__ = "pose_analyses"

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("athletes.id"), nullable=True)
    activity_type = Column(String(100), nullable=False, default="Squatting") # Sprinting, Jumping, Squatting, Landing, Cutting, Running, Throwing
    frame_count = Column(Integer, nullable=False, default=30)
    movement_quality_score = Column(Float, nullable=False, default=85.0)
    biomechanical_efficiency_score = Column(Float, nullable=False, default=88.0)
    max_knee_valgus_deg = Column(Float, nullable=False, default=0.0)
    max_hip_tilt_deg = Column(Float, nullable=False, default=0.0)
    max_trunk_lean_deg = Column(Float, nullable=False, default=0.0)
    symmetry_index_percent = Column(Float, nullable=False, default=90.0)
    trajectory_json = Column(JSON, nullable=True) # Full 17-keypoint time-series
    deviations_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    athlete = relationship("Athlete")
