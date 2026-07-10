from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Athlete(Base):
    __tablename__ = "athletes"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    sport_type = Column(String)
    position = Column(String)
    age = Column(Integer)
    height = Column(Float)
    weight = Column(Float)
    training_load = Column(String)