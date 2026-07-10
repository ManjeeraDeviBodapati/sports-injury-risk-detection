from pydantic import BaseModel

class AthleteCreate(BaseModel):
    full_name: str
    sport_type: str
    position: str
    age: int
    height: float
    weight: float
    training_load: str