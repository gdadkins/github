@echo off
echo Starting CPAP Analytics Frontend (Quick Start)...
cd /d C:\github\cpap-analytics\frontend

echo.
echo Checking for Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Cleaning up any existing processes on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    echo Killing process %%a
    taskkill /PID %%a /F 2>nul
)

echo.
echo Checking for dependencies...
if not exist node_modules (
    echo node_modules not found. Running full install...
    goto :fullinstall
)

REM Check if we can run a simple npm command - if it fails, we likely have platform mismatch
call npm list vite --depth=0 >nul 2>&1
if %errorlevel% neq 0 (
    echo Platform mismatch or corrupted modules detected. Running full reinstall...
    goto :fullinstall
)

echo Dependencies look good. Starting server...
goto :startserver

:fullinstall
echo.
echo Performing full clean install...
if exist node_modules (
    echo Removing existing node_modules...
    rmdir /s /q node_modules 2>nul
)
if exist package-lock.json (
    echo Removing existing package-lock.json...
    del /f /q package-lock.json 2>nul
)
echo Clearing npm cache...
call npm cache clean --force
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

:startserver
echo.
echo Starting development server on http://localhost:5173
echo Press Ctrl+C to stop the server
echo.
call npm run dev

pause