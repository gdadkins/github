"""
Session Database Model

Represents CPAP therapy sessions in the database.
Uses existing database schema but provides Flask-compatible interface.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from datetime import datetime
from app.core.database import Base

class Session(Base):
    """CPAP therapy session model - Compatible with existing DB schema"""
    
    __tablename__ = "sessions"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Session identification (matching existing DB schema)
    session_id = Column(String(255), unique=True, index=True, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=True)
    
    # Session timing (existing schema)
    start_time = Column(DateTime, nullable=True, index=True)
    end_time = Column(DateTime, nullable=True)
    duration_minutes = Column(Float, nullable=True)
    
    # Sleep apnea metrics (existing schema)
    ahi = Column(Float, nullable=True)  # Apnea-Hypopnea Index
    total_apneas = Column(Integer, default=0)
    obstructive_apneas = Column(Integer, default=0)
    central_apneas = Column(Integer, default=0)
    hypopneas = Column(Integer, default=0)
    
    # Mask leak metrics (existing schema)
    mask_leak_avg = Column(Float, default=0.0)  # L/min
    mask_leak_95 = Column(Float, default=0.0)   # 95th percentile
    mask_leak_max = Column(Float, default=0.0)  # Maximum leak
    
    # Pressure metrics (existing schema)
    pressure_min = Column(Float, default=0.0)   # cmH2O
    pressure_avg = Column(Float, default=0.0)   # Average pressure
    pressure_95 = Column(Float, default=0.0)    # 95th percentile
    pressure_max = Column(Float, default=0.0)   # Maximum pressure
    
    # Respiratory metrics (existing schema)
    minute_vent_avg = Column(Float, default=0.0)     # L/min
    resp_rate_avg = Column(Float, default=0.0)       # breaths/min
    tidal_volume_avg = Column(Float, default=0.0)    # mL
    
    # Quality metrics
    quality_score = Column(Float, nullable=True)  # 0-100 calculated score
    
    # Data integrity (existing schema)
    raw_data_path = Column(String(500), nullable=True)  # Path to original file
    checksum = Column(String(64), nullable=True)        # File checksum
    
    # Metadata (existing schema)
    notes = Column(Text, nullable=True)
    is_flagged = Column(Boolean, default=False)  # For manual review
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Flask-compatible properties
    @property
    def date(self):
        """Get session date from start_time for Flask compatibility"""
        if self.start_time:
            return self.start_time.date()
        return None
    
    @property
    def duration_hours(self):
        """Get duration in hours for Flask compatibility"""
        if self.duration_minutes:
            return round(float(self.duration_minutes) / 60, 1)
        return None
    
    @property
    def mask_leak(self):
        """Get mask leak for Flask compatibility (use 95th percentile)"""
        return self.mask_leak_95
    
    def calculate_quality_score(self):
        """Calculate therapy quality score (0-100) based on session data"""
        try:
            # Check if required fields are present and not None
            if self.ahi is None or self.duration_minutes is None or self.mask_leak_95 is None:
                return None
            
            # Convert to float to ensure proper calculation
            ahi = float(self.ahi)
            duration_hours = float(self.duration_minutes) / 60  # Convert to hours
            leak = float(self.mask_leak_95)
            
            # AHI score (lower is better, target < 5)
            if ahi <= 5:
                ahi_score = 100
            elif ahi <= 15:
                ahi_score = 100 - ((ahi - 5) * 5)  # Decrease by 5 points per unit above 5
            else:
                ahi_score = max(0, 50 - ((ahi - 15) * 2))  # Steeper decline above 15
            
            # Duration score (target 7+ hours)
            if duration_hours >= 7:
                duration_score = 100
            elif duration_hours >= 4:
                duration_score = (duration_hours / 7.0) * 100
            else:
                duration_score = max(0, (duration_hours / 4.0) * 50)  # Penalty for very short usage
            
            # Leak score (lower is better, target < 24 L/min)
            if leak <= 24:
                leak_score = 100 - (leak / 24.0) * 20  # Linear decrease up to 24
            else:
                leak_score = max(0, 80 - ((leak - 24) * 2))  # Steeper penalty above 24
            
            # Weighted average (AHI is most important)
            quality_score = (ahi_score * 0.5 + duration_score * 0.3 + leak_score * 0.2)
            
            return round(min(100, max(0, quality_score)), 1)
            
        except (TypeError, ValueError, ZeroDivisionError) as e:
            print(f"Error calculating quality score: {e}")
            return None
    
    def to_dict(self):
        """Convert session object to dictionary (Flask-compatible format)"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoformat() if self.date else None,
            'duration_hours': self.duration_hours,
            'ahi': self.ahi,
            'mask_leak': self.mask_leak,  # Uses mask_leak_95
            'pressure_avg': self.pressure_avg,
            'pressure_95': self.pressure_95,
            'quality_score': self.quality_score or self.calculate_quality_score(),
            'central_apneas': self.central_apneas,
            'obstructive_apneas': self.obstructive_apneas,
            'hypopneas': self.hypopneas,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Session {self.date} - AHI: {self.ahi}>'