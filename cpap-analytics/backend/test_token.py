#!/usr/bin/env python3
"""Test JWT token validation"""

import sys
sys.path.append('.')

# Test token (use the one from your browser console)
test_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzM1NjA1ODYyfQ._LGXP1pLmOtORmXAX404s1WNF-qQK3ZE7OV0xx6PXgk"

try:
    from app.core.security import verify_token
    print(f"Testing token: {test_token[:50]}...")
    
    payload = verify_token(test_token)
    
    if payload:
        print(f"[OK] Token is valid")
        print(f"Payload: {payload}")
        
        # Check if token is expired
        import datetime
        exp = payload.get('exp')
        if exp:
            exp_time = datetime.datetime.fromtimestamp(exp)
            now = datetime.datetime.now()
            print(f"Token expires at: {exp_time}")
            print(f"Current time: {now}")
            if exp_time < now:
                print("[WARNING] Token is EXPIRED!")
            else:
                print("[OK] Token is not expired")
        
        # Test user lookup
        user_id = payload.get('sub')
        if user_id:
            print(f"User ID from token: {user_id}")
            
            from app.core.database import SessionLocal
            from app.models.user import User
            
            db = SessionLocal()
            user = db.query(User).filter(User.id == int(user_id)).first()
            
            if user:
                print(f"[OK] User found: {user.username}")
                print(f"User active: {user.is_active}")
            else:
                print("[ERROR] User not found in database")
            
            db.close()
    else:
        print("[ERROR] Token is invalid")
        
except Exception as e:
    print(f"[ERROR] Token test failed: {e}")
    import traceback
    traceback.print_exc()