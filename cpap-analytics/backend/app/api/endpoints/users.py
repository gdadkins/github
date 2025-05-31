"""
CPAP Analytics Platform - Users Endpoints
API endpoints for user management and authentication
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, date
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.core.security import (
    authenticate_user, 
    create_user_token, 
    get_current_user, 
    get_current_active_user,
    get_password_hash
)
from app.models.user import User as UserModel
from app.models.device import Device
from app.models.session import Session as SessionModel

router = APIRouter()

class UserResponse(BaseModel):
    """User response model"""
    id: int
    email: str
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: bool
    is_verified: bool
    timezone: str
    primary_device_type: Optional[str] = None
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    """User creation model"""
    email: EmailStr
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: str
    timezone: str = "UTC"

class TokenResponse(BaseModel):
    """Token response model"""
    access_token: str
    token_type: str
    expires_in: int
    user: UserResponse

@router.post("/login", response_model=TokenResponse)
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """User login with email/username and password"""
    
    # Try to authenticate with email first, then username
    user = authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        # Try with username field as email
        user = authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login - proper way to update SQLAlchemy model
    db.query(UserModel).filter(UserModel.id == user.id).update(
        {"last_login": datetime.utcnow()}
    )
    db.commit()
    db.refresh(user)
    
    # Create token
    token_data = create_user_token(user)
    
    return TokenResponse(
        access_token=token_data["access_token"],
        token_type=token_data["token_type"],
        expires_in=token_data["expires_in"],
        user=UserResponse.from_orm(user)
    )

@router.post("/register", response_model=UserResponse)
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    
    # Check if user already exists
    existing_user = db.query(UserModel).filter(UserModel.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username is taken (if provided)
    if user_data.username:
        existing_username = db.query(UserModel).filter(UserModel.username == user_data.username).first()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    
    new_user = UserModel(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        timezone=user_data.timezone,
        is_active=True,
        is_verified=False  # Email verification would be implemented separately
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return UserResponse.from_orm(new_user)

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: UserModel = Depends(get_current_active_user)
):
    """Get current user profile"""
    return UserResponse.from_orm(current_user)

@router.put("/me", response_model=UserResponse)
async def update_user_profile(
    profile_data: dict,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    
    # Update allowed fields
    allowed_fields = [
        "username", "full_name", "timezone", 
        "primary_device_type", "date_of_birth", "diagnosis_date"
    ]
    
    update_data = {}
    for field, value in profile_data.items():
        if field in allowed_fields and hasattr(current_user, field):
            update_data[field] = value
    
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        db.query(UserModel).filter(UserModel.id == current_user.id).update(update_data)
        db.commit()
        db.refresh(current_user)
    
    return UserResponse.from_orm(current_user)

@router.post("/logout")
async def logout_user(
    current_user: UserModel = Depends(get_current_active_user)
):
    """User logout (client should discard token)"""
    return {"message": "Successfully logged out"}

@router.get("/preferences")
async def get_user_preferences(
    current_user: UserModel = Depends(get_current_active_user)
):
    """Get user preferences"""
    return {
        "timezone": current_user.timezone,
        "date_format": "MM/DD/YYYY",
        "temperature_unit": "fahrenheit",
        "notifications": {
            "email_reports": True,
            "compliance_alerts": True,
            "data_sync_notifications": False
        },
        "dashboard": {
            "default_date_range": "30_days",
            "chart_type": "line",
            "show_goals": True
        }
    }

@router.put("/preferences")
async def update_user_preferences(
    preferences: dict,
    current_user: UserModel = Depends(get_current_active_user)
):
    """Update user preferences"""
    # In a full implementation, these would be stored in a preferences table
    return {
        "message": "Preferences updated successfully",
        "updated_at": datetime.utcnow().isoformat(),
        "preferences": preferences
    }

@router.get("/profile")
async def get_detailed_profile(
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get detailed user profile including device and session stats"""
    
    # Get user's devices
    devices = db.query(Device).filter(Device.user_id == current_user.id).all()
    
    # Get session statistics using SQLAlchemy aggregation functions
    session_stats = db.query(
        func.count(SessionModel.id).label('total_sessions'),
        func.avg(SessionModel.ahi).label('avg_ahi'),
        func.avg(SessionModel.duration_minutes).label('avg_duration'),
        func.min(SessionModel.start_time).label('first_session'),
        func.max(SessionModel.start_time).label('last_session')
    ).filter(SessionModel.user_id == current_user.id).first()
    
    if session_stats and session_stats.total_sessions > 0:
        # Calculate compliance rate - sessions with 4+ hours (240+ minutes)
        compliant_sessions = db.query(func.count(SessionModel.id)).filter(
            SessionModel.user_id == current_user.id,
            SessionModel.duration_minutes >= 240
        ).scalar() or 0
        
        total_sessions = session_stats.total_sessions
        avg_ahi = float(session_stats.avg_ahi or 0)
        avg_duration_hours = float(session_stats.avg_duration or 0) / 60
        compliance_rate = (compliant_sessions / total_sessions * 100) if total_sessions > 0 else 0
        
        date_range = {
            "first_session": session_stats.first_session.date().isoformat() if session_stats.first_session else None,
            "last_session": session_stats.last_session.date().isoformat() if session_stats.last_session else None
        }
    else:
        total_sessions = 0
        avg_ahi = 0
        avg_duration_hours = 0
        compliance_rate = 0
        date_range = {"first_session": None, "last_session": None}
    
    return {
        "user": UserResponse.from_orm(current_user),
        "devices": [device.to_dict() for device in devices],
        "statistics": {
            "total_nights": total_sessions,
            "average_ahi": round(avg_ahi, 1),
            "average_duration_hours": round(avg_duration_hours, 1),
            "compliance_rate_percent": round(compliance_rate, 1),
            "date_range": date_range
        }
    }