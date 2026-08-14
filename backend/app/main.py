from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.config import settings

# Import all ORM models to ensure table creation
import app.models

from app.routes.auth import router as auth_router
from app.routes.athlete import router as athlete_router
from app.routes.datasets import router as datasets_router
from app.routes.pose import router as pose_router
from app.routes.biomechanics import router as biomechanics_router
from app.routes.reports import router as reports_router

# Create database tables automatically
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Sports Injury Risk Detection Platform API (Milestone 1 & 2 Core Engine)"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev/testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router)
app.include_router(athlete_router)
app.include_router(datasets_router)
app.include_router(pose_router)
app.include_router(biomechanics_router)
app.include_router(reports_router)

@app.get("/")
def home():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "milestones": ["Milestone 1 Completed", "Milestone 2 Operational"],
        "documentation": "/docs"
    }