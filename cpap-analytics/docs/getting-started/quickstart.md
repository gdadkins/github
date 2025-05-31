# CPAP Analytics Platform - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

This guide will help you get the CPAP Analytics Platform running on your local machine with sample data.

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ and npm installed
- Git installed

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/gdadkins/cpap-analytics.git
cd cpap-analytics
```

## Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database with demo user
python scripts/init_db.py

# Generate sample CPAP data (30 days)
# For Windows Python in WSL:
./venv/Scripts/python.exe scripts/generate_sample_data.py
# Or for regular Python:
python scripts/generate_sample_data.py

# Start the backend server
# For Windows Python in WSL (recommended):
./venv/Scripts/python.exe -m app.main
# Or for regular Python:
python -m app.main
```

The FastAPI backend will start on http://172.21.10.16:5000 (WSL) or http://localhost:5000

## Step 3: Frontend Setup

Open a new terminal window and run:

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on http://localhost:5173 (Vite default port)

## Step 4: Access the Dashboard

1. Open your browser and go to http://localhost:5173 (NOT 5174 - use default port only)
2. You'll see the login page
3. Use one of these test accounts:

### Test User (Default)
- **Username**: `testuser`
- **Password**: `password123`

### Demo User (Alternative)
- **Email**: `demo@cpapanalytics.com`
- **Password**: `demo123`

## Step 5: Explore the Dashboard

Once logged in, you'll see:
- **Summary Statistics**: AHI, usage hours, mask leak rate, pressure
- **Quality Score**: Overall therapy quality rating
- **30 Days of Sample Data**: Pre-populated realistic CPAP session data

## 🔧 Troubleshooting

### Backend Issues

If the backend fails to start:
```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# If database errors occur, recreate it:
rm instance/cpap_analytics.db
python scripts/init_db.py
```

### Frontend Issues

If the frontend fails to start:
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Login Issues

If you can't login:
```bash
# Create test user manually
cd backend
# For Windows Python in WSL:
./venv/Scripts/python.exe create_test_user.py
# Or for regular Python:
python create_test_user.py
```

**Note**: The test user credentials are:
- Username: `testuser`
- Password: `password123`
- Email: `test@example.com`

The demo user mentioned above doesn't exist by default and needs to be created separately.

## 📊 Sample Data Details

The sample data generator creates:
- 30 days of CPAP session data
- Realistic AHI values (0-15 events/hour)
- Usage times (6-9 hours/night)
- Mask leak variations
- Pressure readings (8-12 cmH2O)
- Quality scores based on all metrics

## 🏗️ Architecture Overview

- **Backend**: FastAPI with Pydantic schemas and SQLAlchemy ORM
- **Frontend**: React + TypeScript + Vite
- **Database**: SQLite (development)
- **Authentication**: JWT tokens

## 📝 Next Steps

1. **Upload Real Data**: Try uploading your own CPAP SD card data
2. **Explore API**: Check the API documentation at `/api/docs`
3. **Customize**: Modify the dashboard to show your preferred metrics
4. **Contribute**: Check out open issues on GitHub

## 🆘 Getting Help

- Check the [full documentation](./docs/)
- Join our [Discord community](https://discord.gg/cpap-analytics)
- Report issues on [GitHub](https://github.com/gdadkins/cpap-analytics/issues)

## ⚠️ Important Notes

- This is a development setup - do not use in production without proper security configuration
- Sample data is for demonstration only
- Always consult with your healthcare provider about your CPAP therapy

---

**Happy analyzing! 😴💤**