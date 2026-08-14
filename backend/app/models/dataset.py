from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class DatasetReference(Base):
    __tablename__ = "dataset_references"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    keypoint_count = Column(Integer, nullable=False)
    sample_count = Column(Integer, nullable=False)
    source_url = Column(String(500), nullable=False)
