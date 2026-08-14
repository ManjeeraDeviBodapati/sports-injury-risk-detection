from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.database import get_db
from app.models.dataset import DatasetReference

router = APIRouter(prefix="/datasets", tags=["Biomechanics Datasets"])

class DatasetOut(BaseModel):
    id: int
    name: str
    category: str
    description: str
    keypoint_count: int
    sample_count: int
    source_url: str

    class Config:
        from_attributes = True

@router.get("/", response_model=List[DatasetOut])
def list_datasets(db: Session = Depends(get_db)):
    return db.query(DatasetReference).all()

@router.get("/{dataset_id}", response_model=DatasetOut)
def get_dataset(dataset_id: int, db: Session = Depends(get_db)):
    ds = db.query(DatasetReference).filter(DatasetReference.id == dataset_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return ds
