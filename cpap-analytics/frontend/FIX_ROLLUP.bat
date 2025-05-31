@echo off
echo Fixing Rollup module error...
echo.

echo Step 1: Removing node_modules and package-lock.json...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo Step 2: Installing specific rollup platform module...
call npm install @rollup/rollup-win32-x64-msvc --save-optional

echo Step 3: Installing all dependencies...
call npm install

echo.
echo Fix complete! You can now run START_FRONTEND.bat
pause