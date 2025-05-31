@echo off
echo Starting CPAP Analytics Backend (FastAPI)...
cd /d C:\github\cpap-analytics\backend
echo.
echo Backend will run on http://localhost:5000
echo API Documentation available at http://localhost:5000/docs
echo.
python -m app.main
pause