@echo off
echo Alternative Fix using Yarn for CPAP Analytics Frontend...
cd /d C:\github\cpap-analytics\frontend

echo.
echo Checking if Yarn is installed...
where yarn >nul 2>nul
if %errorlevel% neq 0 (
    echo Yarn not found. Installing Yarn globally...
    call npm install -g yarn
)

echo.
echo Step 1: Cleaning up old installations...
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Removing package-lock.json...
    del /f package-lock.json
)
if exist yarn.lock (
    echo Removing yarn.lock...
    del /f yarn.lock
)

echo.
echo Step 2: Installing with Yarn...
call yarn install

echo.
echo Step 3: Starting development server with Yarn...
call yarn dev

pause