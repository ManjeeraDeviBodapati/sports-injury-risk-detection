from fastapi import FastAPI
from app.database import engine, Base

from app.models.user import User
from app.models.athlete import Athlete

from app.routes.auth import router as auth_router
from app.routes.athlete import router as athlete_router

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Sports Injury Risk Detection API",
    version="1.0.0"
)

# Include routes
app.include_router(auth_router)
app.include_router(athlete_router)

@app.get("/")
def home():
    return {
        "message": "Backend Running Successfully"
    }