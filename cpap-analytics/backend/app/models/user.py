"""
User Database Model

Represents users of the CPAP Analytics platform.
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import Dict, Any, Optional
from app.core.database import Base

class User(Base):
    """User model"""
    
    __tablename__ = "users"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic user information
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=True)
    full_name = Column(String(255), nullable=True)
    
    # Authentication
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Profile information
    date_of_birth = Column(DateTime, nullable=True)
    timezone = Column(String(50), default="UTC")
    
    # CPAP-specific information
    diagnosis_date = Column(DateTime, nullable=True)
    primary_device_type = Column(String(100), nullable=True)  # e.g., "ResMed AirSense 10"
    
    # Privacy settings
    data_sharing_consent = Column(Boolean, default=False)
    analytics_consent = Column(Boolean, default=True)
    
    # Metadata
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships (commented out to avoid circular imports for now)
    # sessions = relationship("Session", back_populates="user")
    # devices = relationship("Device", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert user to dictionary for API responses (excluding sensitive data)"""
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "full_name": self.full_name,
            "is_active": bool(self.is_active),
            "is_verified": bool(self.is_verified),
            "timezone": self.timezone,
            "primary_device_type": self.primary_device_type,
            "data_sharing_consent": bool(self.data_sharing_consent),
            "analytics_consent": bool(self.analytics_consent),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_login": self.last_login.isoformat() if self.last_login else None
        }