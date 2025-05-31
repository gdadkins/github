@echo off
echo =======================================
echo CPAP Analytics System Health Check
echo =======================================
echo.

echo Checking backend status...
curl -s http://localhost:5000/api/health > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend is running on port 5000
) else (
    echo [ERROR] Backend is NOT running on port 5000
    echo Please run START_BACKEND.bat
)
echo.

echo Checking frontend status...
curl -s http://localhost:5173 > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend is running on port 5173
) else (
    echo [ERROR] Frontend is NOT running on port 5173
    echo Please run START_FRONTEND.bat
)
echo.

echo Checking database...
cd backend
python -c "from app.core.database import SessionLocal; db = SessionLocal(); print('[OK] Database connection successful'); db.close()" 2>nul || echo [ERROR] Database connection failed
cd ..
echo.

echo Checking for test user...
cd backend
python -c "from app.core.database import SessionLocal; from app.models.user import User; db = SessionLocal(); user = db.query(User).filter(User.username == 'testuser').first(); print('[OK] Test user exists' if user else '[WARNING] Test user not found - run CREATE_TEST_USER.bat'); db.close()" 2>nul
cd ..
echo.

echo =======================================
echo Test Login Credentials:
echo Username: testuser
echo Password: testpass123
echo =======================================
echo.
pause