@echo off
echo Fixing CPAP Analytics Frontend Rollup Issue...
cd /d C:\github\cpap-analytics\frontend

echo.
echo Cleaning up old installations...
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Removing package-lock.json...
    del /f package-lock.json
)

echo.
echo Clearing npm cache...
call npm cache clean --force

echo.
echo Installing fresh dependencies...
call npm install

echo.
echo Starting development server...
call npm run dev

pause