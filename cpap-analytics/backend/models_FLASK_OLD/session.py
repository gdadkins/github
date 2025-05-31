from datetime import datetime
from database import db

class Session(db.Model):
    __tablename__ = 'sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    duration_hours = db.Column(db.Float)
    ahi = db.Column(db.Float)  # Apnea-Hypopnea Index
    mask_leak = db.Column(db.Float)  # Mask leak in L/min
    pressure_avg = db.Column(db.Float)  # Average pressure in cmH2O
    pressure_95 = db.Column(db.Float)  # 95th percentile pressure
    quality_score = db.Column(db.Float)  # Calculated quality score
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Additional metrics
    central_apneas = db.Column(db.Integer, default=0)
    obstructive_apneas = db.Column(db.Integer, default=0)
    hypopneas = db.Column(db.Integer, default=0)
    
    def calculate_quality_score(self):
        """Calculate therapy quality score (0-100) based on session data"""
        try:
            # Check if required fields are present and not None
            if self.ahi is None or self.duration_hours is None or self.mask_leak is None:
                return None
            
            # Convert to float to ensure proper calculation
            ahi = float(self.ahi)
            duration = float(self.duration_hours)
            leak = float(self.mask_leak)
            
            # AHI score (lower is better, target < 5)
            # Score decreases as AHI increases
            if ahi <= 5:
                ahi_score = 100
            elif ahi <= 15:
                ahi_score = 100 - ((ahi - 5) * 5)  # Decrease by 5 points per unit above 5
            else:
                ahi_score = max(0, 50 - ((ahi - 15) * 2))  # Steeper decline above 15
            
            # Duration score (target 7+ hours)
            if duration >= 7:
                duration_score = 100
            elif duration >= 4:
                duration_score = (duration / 7.0) * 100
            else:
                duration_score = max(0, (duration / 4.0) * 50)  # Penalty for very short usage
            
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
        """Convert session object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoformat() if self.date else None,
            'duration_hours': self.duration_hours,
            'ahi': self.ahi,
            'mask_leak': self.mask_leak,
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
