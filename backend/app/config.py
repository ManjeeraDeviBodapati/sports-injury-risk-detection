import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sports Injury Risk Detection Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = ""
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "sports_injury_risk_detection_super_secret_jwt_key_2026")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")) # 24 hours
    
    # Database URL - default to SQLite for local development fallback if PostgreSQL is not active
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./sports_injury.db"
    )

    class Config:
        case_sensitive = True

settings = Settings()
