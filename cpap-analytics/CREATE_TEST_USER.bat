@echo off
echo Creating test user for CPAP Analytics...
echo.
cd backend
python ensure_test_user.py
echo.
echo Test user credentials:
echo Username: testuser
echo Password: testpass123
echo.
pause