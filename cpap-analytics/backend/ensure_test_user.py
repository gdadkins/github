"""
Ensure test user exists in the database
Run this script to create a test user for development
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.user import User
from app.core.security import get_password_hash
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_test_user():
    """Create a test user if it doesn't exist"""
    db = SessionLocal()
    
    try:
        # Check if test user exists
        existing_user = db.query(User).filter(User.username == "testuser").first()
        
        if existing_user:
            logger.info("Test user already exists")
            logger.info(f"Username: {existing_user.username}")
            logger.info(f"Email: {existing_user.email}")
            logger.info(f"Active: {existing_user.is_active}")
            return
        
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
        db.refresh(test_user)
        
        logger.info("Test user created successfully!")
        logger.info(f"Username: {test_user.username}")
        logger.info(f"Password: password123")
        logger.info(f"Email: {test_user.email}")
        
    except Exception as e:
        logger.error(f"Error creating test user: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Ensuring test user exists...")
    create_test_user()