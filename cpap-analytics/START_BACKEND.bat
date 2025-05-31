@echo off
echo Starting CPAP Analytics Backend (FastAPI)...
cd C:\github\cpap-analytics\backend

echo.
echo Starting FastAPI server...
venv\Scripts\python.exe -m app.main

pause