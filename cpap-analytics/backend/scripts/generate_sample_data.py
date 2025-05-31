#!/usr/bin/env python3
"""
Sample Data Generator

Creates realistic CPAP session data for testing the application.
"""

import sys
import os
from pathlib import Path
from datetime import datetime, timedelta
import random
import uuid

# Add the parent directory to Python path so we can import our modules
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import sessionmaker
from sqlalchemy import func
from app.core.database import engine
from app.models.user import User
from app.models.device import Device
from app.models.session import Session

def generate_sample_sessions(user_id: int, device_id: int, num_sessions: int = 30):
    """Generate realistic CPAP session data"""
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    sessions = []
    
    # Start from 30 days ago
    start_date = datetime.now() - timedelta(days=num_sessions)
    
    for i in range(num_sessions):
        session_date = start_date + timedelta(days=i)
        
        # Typical sleep time between 10 PM and midnight
        sleep_start = session_date.replace(
            hour=random.randint(22, 23),
            minute=random.randint(0, 59),
            second=0,
            microsecond=0
        )
        
        # Sleep duration between 6-9 hours
        duration_hours = random.uniform(6.0, 9.0)
        duration_minutes = duration_hours * 60
        sleep_end = sleep_start + timedelta(minutes=duration_minutes)
        
        # Generate realistic metrics
        # AHI typically ranges from 0-30+ (lower is better)
        base_ahi = random.uniform(0.5, 8.0)
        
        # Add some variability - some nights are worse
        if random.random() < 0.2:  # 20% chance of bad night
            ahi = base_ahi * random.uniform(2.0, 4.0)
        else:
            ahi = base_ahi * random.uniform(0.5, 1.5)
        
        ahi = max(0.1, min(30.0, ahi))  # Clamp between 0.1 and 30
        
        # Calculate apnea breakdown
        total_apneas = int(ahi * duration_hours)
        obstructive_ratio = random.uniform(0.6, 0.9)  # Most are obstructive
        central_ratio = random.uniform(0.05, 0.2)     # Some central
        hypopnea_ratio = 1 - obstructive_ratio - central_ratio
        
        obstructive_apneas = int(total_apneas * obstructive_ratio)
        central_apneas = int(total_apneas * central_ratio)
        hypopneas = total_apneas - obstructive_apneas - central_apneas
        
        # Mask leak (lower is better, <24 L/min is good)
        mask_leak_base = random.uniform(2.0, 15.0)
        mask_leak_95 = mask_leak_base + random.uniform(0, 10)
        mask_leak_max = mask_leak_95 + random.uniform(5, 20)
        
        # Pressure settings (typical CPAP pressures)
        pressure_min = random.uniform(4.0, 8.0)
        pressure_avg = pressure_min + random.uniform(2.0, 6.0)
        pressure_95 = pressure_avg + random.uniform(1.0, 3.0)
        pressure_max = pressure_95 + random.uniform(0.5, 2.0)
        
        # Respiratory metrics
        minute_vent_avg = random.uniform(6.0, 12.0)  # L/min
        resp_rate_avg = random.uniform(12.0, 20.0)   # breaths/min
        tidal_volume_avg = random.uniform(400, 600)   # mL
        
        session = Session(
            session_id=str(uuid.uuid4()),
            user_id=user_id,
            device_id=device_id,
            start_time=sleep_start,
            end_time=sleep_end,
            duration_minutes=duration_minutes,
            ahi=round(ahi, 1),
            total_apneas=total_apneas,
            obstructive_apneas=obstructive_apneas,
            central_apneas=central_apneas,
            hypopneas=hypopneas,
            mask_leak_avg=round(mask_leak_base, 1),
            mask_leak_95=round(mask_leak_95, 1),
            mask_leak_max=round(mask_leak_max, 1),
            pressure_min=round(pressure_min, 1),
            pressure_avg=round(pressure_avg, 1),
            pressure_95=round(pressure_95, 1),
            pressure_max=round(pressure_max, 1),
            minute_vent_avg=round(minute_vent_avg, 1),
            resp_rate_avg=round(resp_rate_avg, 1),
            tidal_volume_avg=round(tidal_volume_avg, 0)
        )
        
        # Calculate quality score for each session
        quality_score = session.calculate_quality_score()
        session.quality_score = quality_score
        sessions.append(session)
    
    return sessions

def create_sample_device(user_id: int):
    """Create a sample CPAP device"""
    
    device = Device(
        serial_number=f"AS10-{random.randint(100000, 999999)}",
        device_type="resmed_airsense_10",
        manufacturer="ResMed",
        model="AirSense 10 AutoSet",
        firmware_version="4.0.3",
        hardware_version="1.0",
        user_id=user_id,
        is_active=True,
        is_primary=True,
        purchase_date=datetime.now() - timedelta(days=random.randint(30, 365))
    )
    
    return device

def main():
    """Generate sample data"""
    print("🔄 Generating Sample CPAP Data...")
    print("=" * 40)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    try:
        with SessionLocal() as db:
            # Find the demo user
            demo_user = db.query(User).filter(User.email == "demo@cpapanalytics.com").first()
            
            if not demo_user:
                print("❌ Demo user not found. Please run init_db.py first.")
                return
            
            print(f"📋 Found demo user: {demo_user.email}")
            
            # Check if device already exists
            existing_device = db.query(Device).filter(Device.user_id == demo_user.id).first()
            
            if existing_device:
                print(f"📱 Using existing device: {existing_device.model}")
                device = existing_device
            else:
                # Create sample device
                device = create_sample_device(demo_user.id)
                db.add(device)
                db.commit()
                db.refresh(device)
                print(f"📱 Created device: {device.model} ({device.serial_number})")
            
            # Check if sessions already exist
            existing_sessions = db.query(Session).filter(Session.user_id == demo_user.id).count()
            
            if existing_sessions > 0:
                print(f"📊 Found {existing_sessions} existing sessions")
                response = input("Do you want to add more sessions? (y/N): ")
                if response.lower() != 'y':
                    print("Skipping session generation.")
                    return
            
            # Generate sample sessions
            print("🛏️  Generating 30 days of CPAP sessions...")
            sessions = generate_sample_sessions(demo_user.id, device.id, 30)
            
            # Save sessions to database
            for session in sessions:
                db.add(session)
            
            db.commit()
            
            print(f"✅ Generated {len(sessions)} sample sessions")
            
            # Print summary statistics using SQLAlchemy aggregate functions
            stats = db.query(
                func.count(Session.id).label('total'),
                func.avg(Session.ahi).label('avg_ahi'),
                func.avg(Session.duration_minutes).label('avg_duration'),
                func.min(Session.start_time).label('first_session'),
                func.max(Session.start_time).label('last_session')
            ).filter(Session.user_id == demo_user.id).first()
            
            if stats and stats.total > 0:
                print("\n📈 Summary Statistics:")
                print(f"   - Total Sessions: {stats.total}")
                print(f"   - Average AHI: {float(stats.avg_ahi or 0):.1f}")
                print(f"   - Average Duration: {float(stats.avg_duration or 0)/60:.1f} hours")
                if stats.first_session and stats.last_session:
                    print(f"   - Date Range: {stats.first_session.date()} to {stats.last_session.date()}")
            
            print("\n🚀 Sample data generation completed!")
            print("You can now start the API server and test with the demo user.")
            
    except Exception as e:
        print(f"❌ Failed to generate sample data: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()