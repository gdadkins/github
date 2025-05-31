"""
Initialize FastAPI Database
Creates all tables and sets up initial data
"""

from app.core.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.session import Session
from app.core.security import get_password_hash
from datetime import datetime, date, timedelta, time
import random

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

def create_test_user():
    """Create a test user for development"""
    db = SessionLocal()
    try:
        # Check if test user already exists
        existing_user = db.query(User).filter(User.username == "testuser").first()
        if existing_user:
            print("Test user already exists!")
            return
        
        # Create test user
        test_user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=get_password_hash("password123"),
            is_active=True,
            is_verified=True,
            timezone="UTC"
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print(f"Test user created: {test_user.username} (ID: {test_user.id})")
        
    except Exception as e:
        print(f"Error creating test user: {e}")
        db.rollback()
    finally:
        db.close()

def create_sample_sessions():
    """Create sample CPAP sessions for testing"""
    db = SessionLocal()
    try:
        # Get the test user
        user = db.query(User).filter(User.username == "testuser").first()
        if not user:
            print("Test user not found. Please create test user first.")
            return
        
        # Check if sessions already exist
        existing_sessions = db.query(Session).filter(Session.user_id == user.id).count()
        if existing_sessions > 0:
            print(f"User already has {existing_sessions} sessions!")
            return
        
        # Create sample sessions for the last 30 days
        
        sessions_created = 0
        for i in range(30):
            session_date = date.today() - timedelta(days=i)
            session_datetime = datetime.combine(session_date, time(hour=22))  # 10 PM start
            
            # Create realistic but varying data
            duration_hours = round(random.uniform(6.0, 9.0), 1)  # 6-9 hours
            duration_minutes = duration_hours * 60
            ahi = round(random.uniform(1.5, 8.0), 1)       # 1.5-8.0 AHI
            leak_95 = round(random.uniform(0.5, 15.0), 1)     # 0.5-15 L/min leak
            pressure_avg = round(random.uniform(10.0, 15.0), 1) # 10-15 cmH2O
            pressure_95 = pressure_avg + random.uniform(0.5, 2.0)
            
            session = Session(
                session_id=f"session_{user.id}_{session_date.isoformat()}",
                user_id=user.id,
                start_time=session_datetime,
                end_time=session_datetime + timedelta(hours=duration_hours),
                duration_minutes=duration_minutes,
                ahi=ahi,
                mask_leak_95=leak_95,
                mask_leak_avg=leak_95 * 0.8,  # Average is usually lower than 95th percentile
                pressure_avg=pressure_avg,
                pressure_95=pressure_95,
                pressure_min=pressure_avg - random.uniform(1.0, 3.0),
                pressure_max=pressure_95 + random.uniform(0.5, 1.5),
                central_apneas=random.randint(0, 5),
                obstructive_apneas=random.randint(0, 10),
                hypopneas=random.randint(0, 15),
                total_apneas=random.randint(5, 25)
            )
            
            # Calculate quality score
            session.quality_score = session.calculate_quality_score()
            
            db.add(session)
            sessions_created += 1
        
        db.commit()
        print(f"Created {sessions_created} sample sessions for user {user.username}")
        
    except Exception as e:
        print(f"Error creating sample sessions: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing FastAPI database...")
    create_tables()
    create_test_user()
    create_sample_sessions()
    print("Database initialization complete!")