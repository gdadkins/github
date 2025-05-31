"""
Device Database Model

Represents CPAP devices registered to users.
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import Dict, Any
from app.core.database import Base

class Device(Base):
    """CPAP device model"""
    
    __tablename__ = "devices"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Device identification
    serial_number = Column(String(100), unique=True, index=True, nullable=False)
    device_type = Column(String(100), nullable=False)  # e.g., "resmed_airsense_10"
    manufacturer = Column(String(50), nullable=False)  # e.g., "ResMed"
    model = Column(String(100), nullable=False)        # e.g., "AirSense 10 AutoSet"
    
    # Device information
    firmware_version = Column(String(50), nullable=True)
    hardware_version = Column(String(50), nullable=True)
    
    # User association
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Device status
    is_active = Column(Boolean, default=True)
    is_primary = Column(Boolean, default=False)  # Primary device for user
    
    # Dates
    purchase_date = Column(DateTime, nullable=True)
    warranty_expiry = Column(DateTime, nullable=True)
    last_sync = Column(DateTime, nullable=True)
    
    # Settings (stored as JSON-like text for flexibility)
    current_settings = Column(Text, nullable=True)  # JSON string of device settings
    
    # Metadata
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships (commented out to avoid circular imports for now)
    # user = relationship("User", back_populates="devices")
    # sessions = relationship("Session", back_populates="device")
    
    def __repr__(self):
        return f"<Device(id={self.id}, model={self.model}, serial={self.serial_number})>"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert device to dictionary for API responses"""
        return {
            "id": self.id,
            "serial_number": self.serial_number,
            "device_type": self.device_type,
            "manufacturer": self.manufacturer,
            "model": self.model,
            "firmware_version": self.firmware_version,
            "hardware_version": self.hardware_version,
            "is_active": self.is_active,
            "is_primary": self.is_primary,
            "purchase_date": self.purchase_date.isoformat() if self.purchase_date is not None else None,
            "warranty_expiry": self.warranty_expiry.isoformat() if self.warranty_expiry is not None else None,
            "last_sync": self.last_sync.isoformat() if self.last_sync is not None else None,
            "created_at": self.created_at.isoformat() if self.created_at is not None else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at is not None else None,
            "notes": self.notes
        }
