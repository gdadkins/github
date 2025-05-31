#!/usr/bin/env python3
"""
Generate sample CPAP session data for Flask app
"""

import sys
import os
import random
from datetime import datetime, timedelta

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import after setting path
from database import db
from models.session import Session
from models.user import User

# Import the Flask app directly
import importlib.util
spec = importlib.util.spec_from_file_location("flask_app", "app.py")
flask_app = importlib.util.module_from_spec(spec)
spec.loader.exec_module(flask_app)
app = flask_app.app

def generate_sample_sessions(user_id, days=30):
    """Generate sample CPAP session data for a user"""
    sessions = []
    
    # Start date (30 days ago)
    start_date = datetime.utcnow().date() - timedelta(days=days)
    
    for i in range(days):
        session_date = start_date + timedelta(days=i)
        
        # Generate realistic CPAP data
        session = Session(
            user_id=user_id,
            date=session_date,
            duration_hours=round(random.uniform(5.5, 9.0), 1),  # 5.5-9 hours
            ahi=round(random.uniform(0, 10), 1),  # AHI 0-10 (mostly good)
            mask_leak=round(random.uniform(0, 30), 1),  # Leak 0-30 L/min
            pressure_avg=round(random.uniform(8, 12), 1),  # Pressure 8-12 cmH2O
            quality_score=round(random.uniform(70, 100), 0)  # Quality 70-100%
        )
        
        sessions.append(session)
    
    return sessions

def main():
    """Main function to generate sample data"""
    with app.app_context():
        # Find test user
        user = User.query.filter_by(username='testuser').first()
        
        if not user:
            print("Test user not found! Please run create_test_user.py first.")
            return
        
        # Check if user already has sessions
        existing_sessions = Session.query.filter_by(user_id=user.id).count()
        
        if existing_sessions > 0:
            print(f"User already has {existing_sessions} sessions.")
            response = input("Do you want to delete existing sessions and create new ones? (y/n): ")
            if response.lower() == 'y':
                Session.query.filter_by(user_id=user.id).delete()
                db.session.commit()
                print("Existing sessions deleted.")
            else:
                print("Keeping existing sessions.")
                return
        
        # Generate 30 days of sample data
        print("Generating 30 days of sample CPAP session data...")
        sessions = generate_sample_sessions(user.id, days=30)
        
        # Add all sessions to database
        for session in sessions:
            db.session.add(session)
        
        db.session.commit()
        
        print(f"Successfully created {len(sessions)} sample sessions!")
        
        # Show summary statistics
        avg_ahi = sum(s.ahi for s in sessions) / len(sessions)
        avg_duration = sum(s.duration_hours for s in sessions) / len(sessions)
        avg_quality = sum(s.quality_score for s in sessions) / len(sessions)
        
        print("\nSummary Statistics:")
        print(f"Average AHI: {avg_ahi:.1f}")
        print(f"Average Duration: {avg_duration:.1f} hours")
        print(f"Average Quality Score: {avg_quality:.0f}%")
        print(f"Date Range: {sessions[0].date} to {sessions[-1].date}")

if __name__ == '__main__':
    main()