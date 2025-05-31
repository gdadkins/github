@echo off
echo Starting CPAP Analytics Frontend...
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
echo Removing old node_modules and package-lock.json to ensure clean install...
if exist node_modules (
    echo Removing existing node_modules...
    rmdir /s /q node_modules 2>nul
)
if exist package-lock.json (
    echo Removing existing package-lock.json...
    del /f /q package-lock.json 2>nul
)

echo.
echo Clearing npm cache...
call npm cache clean --force

echo.
echo Installing dependencies...
call npm install --force

if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    echo.
    echo Trying alternative installation method...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ERROR: Alternative npm install also failed
        pause
        exit /b 1
    )
)

REM Ensure Windows-specific rollup dependency is installed
echo.
echo Ensuring platform-specific dependencies...
call npm install @rollup/rollup-win32-x64-msvc@4.41.1 --save-optional --force

echo.
echo Starting development server on http://localhost:5173
call npm run dev

pause