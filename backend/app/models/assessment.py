from sqlalchemy import Column, Integer, String, Float, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class PhysicalAssessment(Base):
    __tablename__ = "physical_assessments"

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("athletes.id"), nullable=False)
    assessment_date = Column(Date, nullable=False)
    flexibility_score = Column(Float, nullable=False, default=75.0)
    strength_score = Column(Float, nullable=False, default=75.0)
    endurance_score = Column(Float, nullable=False, default=75.0)
    movement_screening_notes = Column(Text, nullable=True)
    assessed_by = Column(String(255), nullable=False)

    athlete = relationship("Athlete", back_populates="assessments")
