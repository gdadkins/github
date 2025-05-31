@echo off
echo Stopping CPAP Analytics Services...

echo.
echo Stopping processes on port 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    echo Killing PID %%a
    taskkill /PID %%a /F 2>nul
)

echo.
echo Stopping processes on port 5000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Killing PID %%a
    taskkill /PID %%a /F 2>nul
)

echo.
echo All services stopped.
pause