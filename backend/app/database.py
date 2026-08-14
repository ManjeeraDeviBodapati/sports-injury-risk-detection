import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

logger = logging.getLogger("uvicorn.error")

database_url = settings.DATABASE_URL

# Fallback to SQLite if PostgreSQL connection fails or is default
if database_url.startswith("sqlite"):
    engine = create_engine(
        database_url, connect_args={"check_same_thread": False}
    )
else:
    try:
        engine = create_engine(database_url, pool_pre_ping=True)
        # Test connection
        connection = engine.connect()
        connection.close()
    except Exception as e:
        logger.warning(f"Could not connect to PostgreSQL ({e}). Falling back to local SQLite DB.")
        database_url = "sqlite:///./sports_injury.db"
        engine = create_engine(
            database_url, connect_args={"check_same_thread": False}
        )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()