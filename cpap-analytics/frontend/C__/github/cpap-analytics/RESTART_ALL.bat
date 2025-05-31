@echo off
echo Stopping all CPAP Analytics services...
taskkill /F /IM python.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul
echo.
echo All services stopped. You can now start them individually.
echo.
echo To start services:
echo - Run START_BACKEND.bat in one terminal
echo - Run START_FRONTEND.bat in another terminal
echo.
pause