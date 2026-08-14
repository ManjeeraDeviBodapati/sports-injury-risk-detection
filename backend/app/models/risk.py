import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class InjuryRiskRecord(Base):
    __tablename__ = "injury_risk_records"

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("athletes.id"), nullable=False)
    overall_risk_score = Column(Float, nullable=False, default=25.0)
    overall_health_score = Column(Float, nullable=False, default=75.0)
    risk_category = Column(String(50), nullable=False, default="Low Risk") # Low Risk, Moderate Risk, High Risk, Critical Risk
    
    # Category Risk Probabilities (%)
    acl_risk_percent = Column(Float, nullable=False, default=15.0)
    hamstring_risk_percent = Column(Float, nullable=False, default=15.0)
    ankle_risk_percent = Column(Float, nullable=False, default=15.0)
    shoulder_risk_percent = Column(Float, nullable=False, default=15.0)
    lower_back_risk_percent = Column(Float, nullable=False, default=15.0)
    overuse_risk_percent = Column(Float, nullable=False, default=15.0)
    
    weighted_scores_json = Column(JSON, nullable=True)
    anomalies_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    athlete = relationship("Athlete")
    recommendations = relationship("CorrectiveRecommendation", back_populates="risk_record", cascade="all, delete-orphan")

class CorrectiveRecommendation(Base):
    __tablename__ = "corrective_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    risk_record_id = Column(Integer, ForeignKey("injury_risk_records.id"), nullable=False)
    athlete_id = Column(Integer, ForeignKey("athletes.id"), nullable=False)
    category = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    exercise = Column(Text if False else String(500), nullable=False)
    dosage = Column(String(255), nullable=False)
    focus = Column(String(500), nullable=False)
    priority = Column(String(50), nullable=False, default="Medium") # Low, Medium, High, Critical
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    risk_record = relationship("InjuryRiskRecord", back_populates="recommendations")
