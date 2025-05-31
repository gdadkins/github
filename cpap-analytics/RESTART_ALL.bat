@echo off
echo ========================================
echo KILLING ALL BACKEND AND FRONTEND PROCESSES
echo ========================================

echo.
echo Killing Python processes (backend)...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM python3.exe 2>nul
taskkill /F /IM uvicorn.exe 2>nul

echo.
echo Killing Node processes (frontend)...
taskkill /F /IM node.exe 2>nul

echo.
echo Waiting for processes to terminate...
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo STARTING FRESH BACKEND AND FRONTEND
echo ========================================

echo.
echo Starting backend (FastAPI)...
cd /d C:\github\cpap-analytics\backend
start "CPAP Backend" cmd /k "venv\Scripts\python.exe -m app.main"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Checking frontend dependencies...
cd /d C:\github\cpap-analytics\frontend
if not exist node_modules (
    echo Installing frontend dependencies first...
    call npm install
)

echo.
echo Starting frontend (Vite)...
start "CPAP Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo DONE! Both services should be running:
echo - Backend: http://172.21.10.16:5000
echo - Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit...
pause >nul