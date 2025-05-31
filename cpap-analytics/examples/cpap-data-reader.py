"""
OpenCPAP Analytics Platform - Core Data Reader
Reads and parses ResMed AirSense 10 data from SD card
"""

import os
import struct
import datetime
from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple
import json
from pathlib import Path
import sqlite3
import numpy as np

@dataclass
class CPAPSession:
    """Represents a single CPAP therapy session"""
    start_time: datetime.datetime
    end_time: datetime.datetime
    duration_minutes: float
    ahi: float  # Apnea-Hypopnea Index
    total_apneas: int
    obstructive_apneas: int
    central_apneas: int
    hypopneas: int
    mask_leak_avg: float  # L/min
    mask_leak_95: float   # 95th percentile leak
    pressure_min: float   # cmH2O
    pressure_95: float    # 95th percentile pressure
    pressure_max: float
    minute_vent_avg: float  # L/min
    resp_rate_avg: float    # breaths/min
    tidal_volume_avg: float # mL
    
    def quality_score(self) -> float:
        """Calculate session quality score (0-100)"""
        # Weighted scoring based on clinical importance
        ahi_score = max(0, 100 - (self.ahi * 10))  # AHI < 5 is good
        leak_score = max(0, 100 - (self.mask_leak_95 * 2))  # <24 L/min is good
        duration_score = min(100, (self.duration_minutes / 420) * 100)  # 7 hours ideal
        
        return (ahi_score * 0.5) + (leak_score * 0.3) + (duration_score * 0.2)

class ResMedDataReader:
    """Reads data from ResMed AirSense 10 SD card"""
    
    # ResMed file signatures
    FILE_SIGNATURES = {
        b'BRP\x00': 'summary',
        b'XDA\x00': 'event',
        b'SAD\x00': 'detailed'
    }
    
    def __init__(self, sd_card_path: str):
        self.sd_path = Path(sd_card_path)
        self.data_path = self.sd_path / 'DATALOG'
        
        if not self.data_path.exists():
            raise ValueError(f"No DATALOG directory found at {sd_card_path}")
            
        self.sessions: List[CPAPSession] = []
        self.high_res_data: Dict[str, np.ndarray] = {}
        
    def read_all_sessions(self) -> List[CPAPSession]:
        """Read all therapy sessions from SD card"""
        sessions = []
        
        # Find all session files
        for file_path in self.data_path.glob('*.edf'):
            try:
                session = self._parse_session_file(file_path)
                if session:
                    sessions.append(session)
            except Exception as e:
                print(f"Error reading {file_path}: {e}")
                
        # Sort by date
        sessions.sort(key=lambda x: x.start_time)
        self.sessions = sessions
        return sessions
    
    def _parse_session_file(self, file_path: Path) -> Optional[CPAPSession]:
        """Parse a single session file"""
        with open(file_path, 'rb') as f:
            # Read file header
            header = f.read(4)
            if header not in self.FILE_SIGNATURES:
                return None
                
            file_type = self.FILE_SIGNATURES[header]
            
            if file_type == 'summary':
                return self._parse_summary_data(f)
            elif file_type == 'detailed':
                return self._parse_detailed_data(f)
                
        return None
    
    def _parse_summary_data(self, file_handle) -> CPAPSession:
        """Parse summary statistics file"""
        # ResMed binary format parsing (simplified)
        # Real implementation would need full format specification
        
        # Skip to data section
        file_handle.seek(0x200)
        
        # Read session data (example structure)
        data = struct.unpack('<IIfffffffffff', file_handle.read(52))
        
        start_timestamp = data[0]
        duration_seconds = data[1]
        
        session = CPAPSession(
            start_time=datetime.datetime.fromtimestamp(start_timestamp),
            end_time=datetime.datetime.fromtimestamp(start_timestamp + duration_seconds),
            duration_minutes=duration_seconds / 60,
            ahi=data[2],
            total_apneas=int(data[3]),
            obstructive_apneas=int(data[4]),
            central_apneas=int(data[5]),
            hypopneas=int(data[6]),
            mask_leak_avg=data[7],
            mask_leak_95=data[8],
            pressure_min=data[9],
            pressure_95=data[10],
            pressure_max=data[11],
            minute_vent_avg=20.0,  # Placeholder
            resp_rate_avg=15.0,    # Placeholder
            tidal_volume_avg=500.0  # Placeholder
        )
        
        return session
    
    def get_leak_patterns(self, days: int = 30) -> Dict[str, float]:
        """Analyze mask leak patterns over time"""
        if not self.sessions:
            self.read_all_sessions()
            
        cutoff_date = datetime.datetime.now() - datetime.timedelta(days=days)
        recent_sessions = [s for s in self.sessions if s.start_time >= cutoff_date]
        
        if not recent_sessions:
            return {}
            
        # Analyze leak patterns by hour of night
        hourly_leaks = {}
        for session in recent_sessions:
            # This would use high-resolution data in full implementation
            hour = session.start_time.hour
            if hour not in hourly_leaks:
                hourly_leaks[hour] = []
            hourly_leaks[hour].append(session.mask_leak_95)
            
        # Calculate average leaks by hour
        pattern = {}
        for hour, leaks in hourly_leaks.items():
            pattern[f"{hour:02d}:00"] = np.mean(leaks)
            
        return pattern
    
    def get_therapy_trends(self, metric: str = 'ahi', days: int = 90) -> List[Tuple[datetime.date, float]]:
        """Get trends for specific metrics over time"""
        if not self.sessions:
            self.read_all_sessions()
            
        cutoff_date = datetime.datetime.now() - datetime.timedelta(days=days)
        recent_sessions = [s for s in self.sessions if s.start_time >= cutoff_date]
        
        trends = []
        for session in recent_sessions:
            date = session.start_time.date()
            value = getattr(session, metric, 0)
            trends.append((date, value))
            
        return trends
    
    def export_to_json(self, output_path: str):
        """Export all session data to JSON"""
        if not self.sessions:
            self.read_all_sessions()
            
        data = {
            'export_date': datetime.datetime.now().isoformat(),
            'device': 'ResMed AirSense 10',
            'sessions': [
                {
                    'date': s.start_time.isoformat(),
                    'duration_hours': s.duration_minutes / 60,
                    'ahi': s.ahi,
                    'leak_95': s.mask_leak_95,
                    'pressure_95': s.pressure_95,
                    'quality_score': s.quality_score()
                }
                for s in self.sessions
            ]
        }
        
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)

class CPAPAnalytics:
    """Advanced analytics for CPAP therapy optimization"""
    
    def __init__(self, reader: ResMedDataReader):
        self.reader = reader
        self.db_path = "cpap_analytics.db"
        self._init_database()
        
    def _init_database(self):
        """Initialize SQLite database for storing analysis results"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                start_time TIMESTAMP,
                duration_minutes REAL,
                ahi REAL,
                leak_95 REAL,
                pressure_95 REAL,
                quality_score REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS leak_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id INTEGER,
                timestamp TIMESTAMP,
                leak_rate REAL,
                duration_seconds INTEGER,
                FOREIGN KEY (session_id) REFERENCES sessions (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        
    def analyze_mask_fit(self) -> Dict[str, any]:
        """Analyze mask fit issues and provide recommendations"""
        leak_patterns = self.reader.get_leak_patterns()
        sessions = self.reader.sessions[-30:]  # Last 30 sessions
        
        if not sessions:
            return {"error": "No session data available"}
            
        # Calculate leak statistics
        avg_leak = np.mean([s.mask_leak_95 for s in sessions])
        leak_variance = np.var([s.mask_leak_95 for s in sessions])
        high_leak_sessions = sum(1 for s in sessions if s.mask_leak_95 > 24)
        
        # Identify problematic times
        problem_hours = []
        for hour, leak_rate in leak_patterns.items():
            if leak_rate > 24:  # Clinical threshold
                problem_hours.append(hour)
                
        analysis = {
            "average_leak_95": round(avg_leak, 1),
            "leak_variance": round(leak_variance, 1),
            "high_leak_percentage": round((high_leak_sessions / len(sessions)) * 100, 1),
            "problem_hours": problem_hours,
            "mask_fit_score": round(max(0, 100 - (avg_leak * 2)), 1),
            "recommendations": self._generate_mask_recommendations(avg_leak, leak_variance, problem_hours)
        }
        
        return analysis
    
    def _generate_mask_recommendations(self, avg_leak: float, variance: float, problem_hours: List[str]) -> List[str]:
        """Generate personalized mask recommendations"""
        recommendations = []
        
        if avg_leak > 30:
            recommendations.append("Consider trying a different mask type - your current mask shows significant leaks")
            recommendations.append("Full face masks often work better for mouth breathers")
            
        if variance > 100:
            recommendations.append("Leak rates are highly variable - check strap tightness consistency")
            recommendations.append("Consider marking optimal strap positions")
            
        if problem_hours and any(h.startswith(('02', '03', '04')) for h in problem_hours):
            recommendations.append("Leaks increase during deep sleep - mask may shift with REM sleep movement")
            recommendations.append("Try a mask with better stability like ResMed F30i or DreamWear")
            
        if avg_leak < 10:
            recommendations.append("Excellent mask fit! Current mask is working well")
            
        return recommendations
    
    def predict_therapy_success(self, target_days: int = 7) -> Dict[str, float]:
        """Predict therapy success metrics for upcoming days"""
        if len(self.reader.sessions) < 30:
            return {"error": "Insufficient data for prediction (need 30+ days)"}
            
        # Simple trend analysis (would use ML in production)
        recent_sessions = self.reader.sessions[-30:]
        
        # Calculate trends
        ahi_trend = np.polyfit(range(len(recent_sessions)), 
                               [s.ahi for s in recent_sessions], 1)[0]
        leak_trend = np.polyfit(range(len(recent_sessions)), 
                               [s.mask_leak_95 for s in recent_sessions], 1)[0]
        
        # Project forward
        current_ahi = recent_sessions[-1].ahi
        current_leak = recent_sessions[-1].mask_leak_95
        
        predictions = {
            "predicted_ahi": round(max(0, current_ahi + (ahi_trend * target_days)), 1),
            "predicted_leak": round(max(0, current_leak + (leak_trend * target_days)), 1),
            "ahi_improving": ahi_trend < 0,
            "leak_improving": leak_trend < 0,
            "confidence": 0.7 if len(recent_sessions) > 60 else 0.5
        }
        
        return predictions

# Example usage
if __name__ == "__main__":
    # Initialize reader with SD card path
    reader = ResMedDataReader("/Volumes/CPAP_SD")  # Adjust path as needed
    
    # Read all sessions
    sessions = reader.read_all_sessions()
    print(f"Found {len(sessions)} therapy sessions")
    
    # Analyze recent performance
    if sessions:
        recent = sessions[-7:]  # Last week
        avg_ahi = np.mean([s.ahi for s in recent])
        avg_leak = np.mean([s.mask_leak_95 for s in recent])
        avg_quality = np.mean([s.quality_score() for s in recent])
        
        print(f"\nLast 7 days:")
        print(f"Average AHI: {avg_ahi:.1f}")
        print(f"Average Leak (95%): {avg_leak:.1f} L/min")
        print(f"Average Quality Score: {avg_quality:.1f}/100")
        
    # Run analytics
    analytics = CPAPAnalytics(reader)
    mask_analysis = analytics.analyze_mask_fit()
    print(f"\nMask Fit Analysis:")
    print(json.dumps(mask_analysis, indent=2))
