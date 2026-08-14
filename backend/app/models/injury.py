from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class InjuryHistory(Base):
    __tablename__ = "injury_history"

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("athletes.id"), nullable=False)
    injury_name = Column(String(255), nullable=False)
    affected_body_part = Column(String(100), nullable=False)
    injury_date = Column(Date, nullable=False)
    recovery_status = Column(String(50), nullable=False, default="Rehab In Progress") # Fully Recovered, Rehab In Progress, Active Pain
    severity = Column(String(50), nullable=False, default="Moderate") # Mild, Moderate, Severe, Critical
    notes = Column(Text, nullable=True)

    athlete = relationship("Athlete", back_populates="injury_history")
