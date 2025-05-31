#!/usr/bin/env python3
"""
Script to create a test user for the CPAP Analytics application
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the Flask app directly
import importlib.util
spec = importlib.util.spec_from_file_location("flask_app", "app.py")
flask_app = importlib.util.module_from_spec(spec)
spec.loader.exec_module(flask_app)

# Import after setting path
from database import db
from models.user import User

def create_test_user():
    """Create a test user if one doesn't exist"""
    with flask_app.app.app_context():
        # Check if any users exist
        existing_user = User.query.filter_by(username='testuser').first()
        
        if existing_user:
            print("Test user already exists!")
            print("Username: testuser")
            print("Email:", existing_user.email)
            return
        
        # Create test user
        test_user = User(
            username='testuser',
            email='test@example.com'
        )
        test_user.set_password('password123')
        
        db.session.add(test_user)
        db.session.commit()
        
        print("Test user created successfully!")
        print("Username: testuser")
        print("Password: password123")
        print("Email: test@example.com")
        print("\nYou can now login to the frontend using these credentials.")

if __name__ == '__main__':
    create_test_user()
