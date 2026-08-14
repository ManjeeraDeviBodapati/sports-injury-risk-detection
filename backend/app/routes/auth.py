from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut, Token, OAuthLogin, UserUpdate
from app.utils.security import (
    hash_password, verify_password, create_access_token, require_current_user
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

ALLOWED_ROLES = ["Athlete", "Coach", "Physiotherapist", "Sports Scientist", "Administrator"]

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    if user_in.role not in ALLOWED_ROLES:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid role '{user_in.role}'. Must be one of: {ALLOWED_ROLES}"
        )

    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        password=hash_password(user_in.password),
        role=user_in.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.email, "role": new_user.role})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": new_user.role,
        "user": new_user
    }

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)) -> Any:
    db_user = db.query(User).filter(User.email == credentials.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User account not found")

    if not verify_password(credentials.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": db_user.email, "role": db_user.role})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": db_user.role,
        "user": db_user
    }

@router.post("/oauth/login", response_model=Token)
def oauth_login(oauth_in: OAuthLogin, db: Session = Depends(get_db)) -> Any:
    # OAuth2 Single Sign-On simulation / callback handler
    simulated_email = f"oauth_{oauth_in.provider}_{hash(oauth_in.token) % 10000}@sportsinjury.org"
    db_user = db.query(User).filter(User.email == simulated_email).first()

    if not db_user:
        db_user = User(
            full_name=f"OAuth User ({oauth_in.provider.capitalize()})",
            email=simulated_email,
            password=hash_password("oauth_sso_pass_2026"),
            role=oauth_in.role
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    access_token = create_access_token(data={"sub": db_user.email, "role": db_user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": db_user.role,
        "user": db_user
    }

@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(require_current_user)) -> Any:
    return current_user

@router.put("/profile", response_model=UserOut)
def update_profile(
    profile_in: UserUpdate,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
) -> Any:
    if profile_in.full_name is not None:
        current_user.full_name = profile_in.full_name
    if profile_in.email is not None:
        current_user.email = profile_in.email
    if profile_in.role is not None and profile_in.role in ALLOWED_ROLES:
        current_user.role = profile_in.role

    db.commit()
    db.refresh(current_user)
    return current_user