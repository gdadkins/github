"""
CPAP Analytics Platform - Authentication Endpoints
API endpoints that match Flask backend structure for seamless migration
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.core.security import (
    authenticate_user, 
    create_user_token, 
    get_current_user, 
    get_current_active_user,
    get_password_hash,
    verify_password
)
from app.models.user import User as UserModel

router = APIRouter()

class LoginRequest(BaseModel):
    """Login request model"""
    username: str
    password: str

class RegisterRequest(BaseModel):
    """Registration request model"""
    username: str
    email: EmailStr
    password: str

class ProfileUpdateRequest(BaseModel):
    """Profile update request model"""
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserResponse(BaseModel):
    """User response model matching Flask format"""
    id: int
    username: str
    email: str
    created_at: str
    is_active: bool

    class Config:
        from_attributes = True

@router.post('/register')
async def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    """Register a new user - matches Flask endpoint"""
    try:
        # Check if user already exists
        if db.query(UserModel).filter(UserModel.username == user_data.username).first():
            raise HTTPException(
                status_code=400,
                detail={"error": "Username already exists"}
            )
        
        if db.query(UserModel).filter(UserModel.email == user_data.email).first():
            raise HTTPException(
                status_code=400,
                detail={"error": "Email already exists"}
            )
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        
        new_user = UserModel(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            is_active=True,
            is_verified=False
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {
            "message": "User registered successfully",
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email,
                "created_at": new_user.created_at.isoformat() if new_user.created_at else None,
                "is_active": new_user.is_active
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail={"error": str(e)}
        )

@router.post('/login')
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """User login - matches Flask endpoint"""
    try:
        # Find user by username
        user = db.query(UserModel).filter(UserModel.username == login_data.username).first()
        
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=401,
                detail={"error": "Invalid username or password"}
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=401,
                detail={"error": "Account is disabled"}
            )
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        
        # Create JWT token
        token_data = create_user_token(user)
        
        return {
            "access_token": token_data["access_token"],
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "is_active": user.is_active
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": str(e)}
        )

@router.get('/profile')
async def get_profile(
    current_user: UserModel = Depends(get_current_active_user)
):
    """Get current user profile - matches Flask endpoint"""
    try:
        return {
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "email": current_user.email,
                "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
                "is_active": current_user.is_active
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": str(e)}
        )

@router.put('/profile')
async def update_profile(
    profile_data: ProfileUpdateRequest,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user profile - matches Flask endpoint"""
    try:
        # Update allowed fields
        if profile_data.email:
            # Check if email is already taken by another user
            existing_user = db.query(UserModel).filter(
                UserModel.email == profile_data.email,
                UserModel.id != current_user.id
            ).first()
            if existing_user:
                raise HTTPException(
                    status_code=400,
                    detail={"error": "Email already exists"}
                )
            current_user.email = profile_data.email
        
        if profile_data.password:
            current_user.hashed_password = get_password_hash(profile_data.password)
        
        current_user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(current_user)
        
        return {
            "message": "Profile updated successfully",
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "email": current_user.email,
                "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
                "is_active": current_user.is_active
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail={"error": str(e)}
        )

@router.post('/logout')
async def logout(
    current_user: UserModel = Depends(get_current_active_user)
):
    """Logout user - matches Flask endpoint"""
    try:
        # In a production environment, you might want to blacklist the token here
        # For now, we just return a success message and let the client handle token removal
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": str(e)}
        )