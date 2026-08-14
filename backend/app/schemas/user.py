from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "Athlete" # Athlete, Coach, Physiotherapist, Sports Scientist, Administrator

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OAuthLogin(BaseModel):
    provider: str = "google" # google, azure
    token: str
    role: str = "Athlete"

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user: UserOut

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None