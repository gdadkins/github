"""
Security and Authentication Module

Handles JWT token creation, password hashing, and authentication dependencies.
"""

from datetime import datetime, timedelta
from typing import Optional, Union
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Security
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError:
        return None

def authenticate_user(db: Session, email: str, password: str) -> Union[bool, "UserModel"]:
    """Authenticate a user with email and password"""
    from app.models.user import User
    
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        return False
    
    if not verify_password(password, str(user.hashed_password)):
        return False
    
    return user

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> "UserModel":
    """Get the current authenticated user from JWT token"""
    from app.models.user import User
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Extract token from Bearer format
        token = credentials.credentials
        payload = verify_token(token)
        
        if payload is None:
            raise credentials_exception
        
        user_id_str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        
        user_id = int(user_id_str)
            
    except Exception:
        raise credentials_exception
    
    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user

async def get_current_active_user(current_user: "UserModel" = Depends(get_current_user)) -> "UserModel":
    """Get the current active user (must be active and verified)"""
    if not bool(current_user.is_active):
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return current_user

def create_user_token(user: "UserModel") -> dict:
    """Create a token response for a user"""
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # seconds
        "user": user.to_dict()
    }

class SecurityDependencies:
    """Collection of security-related dependencies"""
    
    @staticmethod
    def require_auth(user: "UserModel" = Depends(get_current_active_user)) -> "UserModel":
        """Dependency that requires authentication"""
        return user
    
    @staticmethod
    def optional_auth(
        credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_db)
    ) -> Optional["UserModel"]:
        """Dependency for optional authentication (returns None if not authenticated)"""
        if not credentials:
            return None
        
        try:
            from app.models.user import User
            
            token = credentials.credentials
            payload = verify_token(token)
            
            if payload is None:
                return None
            
            user_id_str = payload.get("sub")
            if user_id_str is None:
                return None
            
            user_id = int(user_id_str)
            
            user = db.query(User).filter(User.id == user_id).first()
            return user if user and bool(user.is_active) else None
            
        except Exception:
            return None

# Convenience instances
auth_required = SecurityDependencies.require_auth
auth_optional = SecurityDependencies.optional_auth
