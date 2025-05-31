#!/usr/bin/env python3
"""
Database Initialization Script

Creates the SQLite database and all required tables for the CPAP Analytics platform.
This script should be run once during initial setup.
"""

import sys
import os
from pathlib import Path

# Add the parent directory to Python path so we can import our modules
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.device import Device  
from app.models.session import Session

def create_database():
    """Create the database and all tables"""
    
    print(f"🔧 Initializing CPAP Analytics Database...")
    print(f"📍 Database URL: {settings.DATABASE_URL}")
    
    # Test connection
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
    
    try:
        # Create all tables
        print("📋 Creating database tables...")
        
        # Import all models to ensure they're registered with Base
        from app.models import user, device, session
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        print("✅ Database tables created successfully!")
        
        # Create a test session to verify everything works
        with SessionLocal() as db:
            # Test that we can query the tables
            user_count = db.query(User).count()
            device_count = db.query(Device).count() 
            session_count = db.query(Session).count()
            
            print(f"📊 Database initialized with:")
            print(f"   - Users: {user_count}")
            print(f"   - Devices: {device_count}") 
            print(f"   - Sessions: {session_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to create database tables: {e}")
        import traceback
        traceback.print_exc()
        return False

def create_sample_user():
    """Create a sample user for testing"""
    from app.core.security import get_password_hash
    
    try:
        with SessionLocal() as db:
            # Check if sample user already exists
            existing_user = db.query(User).filter(User.email == "demo@cpapanalytics.com").first()
            
            if existing_user:
                print("📋 Sample user already exists")
                return
            
            # Create sample user
            sample_user = User(
                email="demo@cpapanalytics.com",
                username="demo_user",
                full_name="Demo User",
                hashed_password=get_password_hash("demo123"),
                is_active=True,
                is_verified=True,
                timezone="America/Chicago",
                primary_device_type="ResMed AirSense 10",
                data_sharing_consent=True,
                analytics_consent=True
            )
            
            db.add(sample_user)
            db.commit()
            db.refresh(sample_user)
            
            print(f"✅ Sample user created:")
            print(f"   - Email: demo@cpapanalytics.com")
            print(f"   - Password: demo123")
            print(f"   - User ID: {sample_user.id}")
            
    except Exception as e:
        print(f"❌ Failed to create sample user: {e}")
        import traceback
        traceback.print_exc()

def main():
    """Main initialization function"""
    print("🚀 CPAP Analytics - Database Initialization")
    print("=" * 50)
    
    # Create database and tables
    if create_database():
        print("\n🔧 Creating sample user...")
        create_sample_user()
        
        print("\n" + "=" * 50)
        print("✅ Database initialization completed successfully!")
        print("\n📋 Next steps:")
        print("   1. Start the FastAPI server: uvicorn app.main:app --reload")
        print("   2. Test the API at: http://localhost:8000/docs")
        print("   3. Login with demo@cpapanalytics.com / demo123")
        print("\n🔍 Database file location: ./cpap_analytics.db")
    else:
        print("\n❌ Database initialization failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
