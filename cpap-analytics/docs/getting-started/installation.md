# CPAP Analytics - Installation Guide

This guide will help you set up the CPAP Analytics platform on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)

Verify your installations:
```bash
python --version  # Should show Python 3.8 or higher
node --version    # Should show v16.0.0 or higher
npm --version     # Comes with Node.js
git --version     # Any recent version
```

## Step 1: Clone the Repository

```bash
git clone https://github.com/gdadkins/cpap-analytics.git
cd cpap-analytics
```

## Step 2: Backend Setup (FastAPI)

### Create Python Virtual Environment

```bash
cd backend
python -m venv venv
```

### Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Initialize Database

```bash
# Initialize the database schema
python scripts/init_db.py

# (Optional) Generate sample data for testing
# For Windows Python in WSL:
./venv/Scripts/python.exe scripts/generate_sample_data.py
# For regular Python:
python scripts/generate_sample_data.py
```

### Create Test User

```bash
python create_test_user.py
```

This creates a test user with:
- Username: `testuser`
- Password: `password123`

### Start Backend Server

```bash
# For Windows Python in WSL (recommended):
./venv/Scripts/python.exe -m app.main
# For regular Python:
python -m app.main
```

The FastAPI backend will start on `http://localhost:5000` (or `http://172.21.10.16:5000` in WSL)

You should see:
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:5000
```

## Step 3: Frontend Setup

Open a new terminal window/tab and navigate to the frontend directory:

```bash
cd frontend  # From project root
```

### Install Node Dependencies

```bash
npm install
```

This may take a few minutes as it downloads all required packages.

### Start Development Server

```bash
npm run dev
```

The React frontend will start on `http://localhost:5173` (Vite default port)

You should see:
```
  VITE v5.4.19  ready in 367 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://172.17.94.120:5173/
```

## Step 4: Verify Installation

1. Open your browser and navigate to `http://localhost:5173`
2. You should see the CPAP Analytics login page
3. Log in with the test credentials:
   - Username: `testuser`
   - Password: `password123`
4. You should be redirected to the dashboard

## API Documentation

FastAPI provides automatic interactive documentation:

- **Swagger UI**: `http://172.21.10.16:5000/docs`
- **ReDoc**: `http://172.21.10.16:5000/redoc`
- **OpenAPI JSON**: `http://172.21.10.16:5000/openapi.json`

## Production Setup

For production deployment:

### Backend
1. Set environment variables:
   ```bash
   export SECRET_KEY=your-secret-key-here
   export JWT_SECRET_KEY=your-jwt-secret-here
   export DATABASE_URL=postgresql://user:pass@host/db
   ```

2. Use a production ASGI server:
   ```bash
   pip install uvicorn[standard]
   uvicorn app.main:app --host 0.0.0.0 --port 5000 --workers 4
   ```

### Frontend
1. Build for production:
   ```bash
   npm run build
   ```

2. Serve the `dist` directory with a web server like Nginx

## Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

**Backend (Port 5000):**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or use a different port
python app.py --port 5001
```

**Frontend (Port 5173):**
```bash
# Vite will automatically try the next available port (e.g., 5174)
# Or manually specify:
npm run dev -- --port 5175
# Kill any duplicate processes:
pkill -f "vite"
```

### Database Issues

If you encounter database errors:

1. Delete the existing database:
   ```bash
   rm backend/instance/database.db  # macOS/Linux
   del backend\instance\database.db  # Windows
   ```

2. Reinitialize:
   ```bash
   cd backend
   python scripts/init_db.py
   ```

### Module Not Found Errors

Ensure your virtual environment is activated:
```bash
# You should see (venv) in your prompt
which python  # Should point to venv/bin/python
```

### CORS Errors

If you see CORS errors in the browser console:

1. Ensure the Flask backend is running
2. Check that frontend is configured to use correct backend URL
3. Verify CORS is enabled in Flask (already configured in app.py)

### npm Install Failures

If npm install fails:

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and package-lock.json:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Next Steps

After successful installation:

1. Explore the dashboard with sample data
2. Upload your own CPAP data files
3. Check out the [Developer Guide](../development/guidelines.md) to start contributing
4. See [Project Structure](../development/project-structure.md) to understand the codebase

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Search existing [GitHub Issues](https://github.com/yourusername/cpap-analytics/issues)
3. Create a new issue with:
   - Your operating system
   - Python and Node.js versions
   - Complete error messages
   - Steps to reproduce the issue