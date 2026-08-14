import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Athlete(Base):
    __tablename__ = "athletes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    athlete_code = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    sport_type = Column(String(100), nullable=False, index=True)
    position = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    height = Column(Float, nullable=False) # cm
    weight = Column(Float, nullable=False) # kg
    training_load = Column(String(50), nullable=False, default="Moderate") # Low, Moderate, High, Very High
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="athlete_profile")
    injury_history = relationship("InjuryHistory", back_populates="athlete", cascade="all, delete-orphan")
    assessments = relationship("PhysicalAssessment", back_populates="athlete", cascade="all, delete-orphan")