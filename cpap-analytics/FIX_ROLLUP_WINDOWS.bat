@echo off
echo Fixing Rollup Windows Platform Issue...
cd /d C:\github\cpap-analytics\frontend

echo.
echo Step 1: Cleaning everything...
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules 2>nul
)
if exist package-lock.json (
    echo Removing package-lock.json...
    del /f /q package-lock.json 2>nul
)

echo.
echo Step 2: Clearing ALL npm caches...
call npm cache clean --force
call npm cache verify

echo.
echo Step 3: Installing with specific platform support...
call npm install --force

echo.
echo Step 4: Manually installing Windows rollup binary...
call npm install @rollup/rollup-win32-x64-msvc@4.41.1 --save-optional --force

echo.
echo Step 5: Verifying installation...
if exist "node_modules\@rollup\rollup-win32-x64-msvc" (
    echo SUCCESS: Windows rollup binary is installed!
) else (
    echo WARNING: Windows rollup binary not found, trying direct installation...
    mkdir node_modules\@rollup 2>nul
    cd node_modules\@rollup
    call npm pack @rollup/rollup-win32-x64-msvc@4.41.1
    call tar -xf rollup-rollup-win32-x64-msvc-4.41.1.tgz
    move package rollup-win32-x64-msvc
    del rollup-rollup-win32-x64-msvc-4.41.1.tgz
    cd ..\..
)

echo.
echo Step 6: Testing vite...
call npx vite --version
if %errorlevel% equ 0 (
    echo.
    echo SUCCESS: Vite is working!
    echo You can now run START_FRONTEND.bat or START_FRONTEND_QUICK.bat
) else (
    echo.
    echo ERROR: Vite is still not working. Please check the error messages above.
)

echo.
pause