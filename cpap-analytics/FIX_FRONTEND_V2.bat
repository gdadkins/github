@echo off
echo Fixing CPAP Analytics Frontend Rollup Issue (V2)...
cd /d C:\github\cpap-analytics\frontend

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

echo.
echo Step 2: Clearing npm cache...
call npm cache clean --force

echo.
echo Step 3: Installing dependencies with forced platform...
call npm install --force

echo.
echo Step 4: Manually installing Rollup for Windows if needed...
call npm install @rollup/rollup-win32-x64-msvc@4.9.5 --save-optional --force

echo.
echo Step 5: Verifying installation...
call npm list @rollup/rollup-win32-x64-msvc

echo.
echo Step 6: Starting development server...
call npm run dev

pause