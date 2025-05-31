"""
Quick script to create/update test user with correct password
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.core.security import get_password_hash
from datetime import datetime

# Create database connection
engine = create_engine('sqlite:///cpap_analytics.db')
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def fix_test_user():
    """Create or update test user with correct password"""
    db = SessionLocal()
    
    try:
        # Check if test user exists
        user = db.query(User).filter(User.username == "testuser").first()
        
        if user:
            print(f"Found existing user: {user.username}")
            # Update password to match what's shown in UI
            user.hashed_password = get_password_hash("password123")
            user.email = "testuser@example.com"
            user.is_active = True
            db.commit()
            print("Updated test user password to: password123")
        else:
            # Create new test user
            test_user = User(
                username="testuser",
                email="testuser@example.com",
                hashed_password=get_password_hash("password123"),
                full_name="Test User",
                is_active=True,
                created_at=datetime.utcnow()
            )
            db.add(test_user)
            db.commit()
            print("Created test user with password: password123")
        
        print("\nTest user credentials:")
        print("Username: testuser")
        print("Password: password123")
        print("Email: testuser@example.com")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_test_user()