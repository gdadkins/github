#\!/usr/bin/env python3
import requests
import json
import sys

USERNAME = "freshuser"
PASSWORD = "fresh123"
BASE_URL = "http://172.21.10.16:5000"

print("=" * 60)
print("TESTING ANALYTICS ENDPOINT")
print("=" * 60)

# Login
login_response = requests.post(f"{BASE_URL}/api/auth/login", json={"username": USERNAME, "password": PASSWORD})
if login_response.status_code \!= 200:
    print(f"Login failed: {login_response.text}")
    sys.exit(1)

token = login_response.json()["access_token"]
print(f"Login successful\!")

# Call analytics
analytics_response = requests.get(f"{BASE_URL}/api/sessions/analytics", headers={"Authorization": f"Bearer {token}"})
data = analytics_response.json()

print(f"\nResponse size: {len(analytics_response.text)} bytes")
print(f"Total sessions (summary): {data['summary']['total_sessions']}")
print(f"Recent sessions count: {len(data['recent_sessions'])}")
print(f"Trends count: {len(data['trends'])}")

print("\nSession details:")
for i, session in enumerate(data['recent_sessions']):
    print(f"  Session {i+1}: ID={session['id']}, Date={session['date']}")

if len(data['recent_sessions']) == 2:
    print("\nSTILL ONLY 2 SESSIONS\!")
else:
    print(f"\nSUCCESS\! {len(data['recent_sessions'])} sessions\!")
EOF < /dev/null
