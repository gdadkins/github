# CPAP Analytics - Development Troubleshooting Guide

> 💡 **For development patterns, code examples, and philosophy, see [CLAUDE.md](/CLAUDE.md)**  
> 💡 **For project structure and organization, see [project-structure.md](/docs/development/project-structure.md)**

## Authentication Issues

### Frontend Shows "API Error: 401" After Backend Restart

**Symptoms**: 
- Login works in incognito mode but fails in normal browser
- Getting 401 Unauthorized errors despite correct credentials
- Backend logs show successful authentication but frontend still fails

**Root Cause**: 
Old JWT tokens cached in browser localStorage after backend restart/change

**Solutions**:
1. **Clear localStorage**: 
   - Press F12 → Application tab → Storage → Local Storage → http://localhost:5173 → Clear All
   - Refresh page and try login again

2. **Use incognito mode**: 
   - Open incognito/private browsing window
   - Navigate to http://localhost:5173

3. **Prevention**: 
   - Always clear localStorage when switching between Flask/FastAPI backends
   - Consider implementing automatic token refresh or better error handling

## Backend Issues

### Analytics Endpoint Returns 500 Error (RESOLVED 2025-05-29)

**Symptoms**: 
- `{"detail": {"error": "Failed to fetch analytics data"}}`
- Frontend shows "API Error: 500" on dashboard

**Root Cause**: 
Flask backend running on same port as FastAPI, intercepting requests

**Resolution**:
1. Kill all Python processes:
   ```bash
   # Kill all Python processes
   ps aux | grep python | awk '{print $2}' | xargs -r kill -9
   ```

2. Start only FastAPI:
   ```bash
   cd backend && ./venv/Scripts/python.exe -m app.main
   ```

3. Verify health endpoint:
   ```bash
   curl http://172.21.10.16:5000/health
   ```

**Prevention**: 
- Never run `python app.py` (Flask backend is deprecated)
- Always use `python -m app.main` for FastAPI

### Mock Data Shows Only 2 Days Instead of 30

**Solution**: Updated `/backend/app/api/endpoints/sessions.py` to include 30 days of mock trend data

## Frontend Issues

### Frontend Crashes on Wrong Port

**Symptoms**: 
- Frontend runs on port 5174 instead of 5173
- CORS errors in browser console
- Login failures

**Solution**:
1. Kill existing frontend processes:
   ```bash
   pkill -f "npm run dev"
   ```

2. Restart on correct port:
   ```bash
   cd frontend && npm run dev
   ```

3. Verify running on port 5173:
   ```bash
   curl http://localhost:5173
   ```

## Network Configuration (WSL)

### Backend Not Accessible from Frontend

**Required Configuration**:
- Backend must bind to `0.0.0.0:5000` (accessible as `172.21.10.16:5000`)
- Frontend environment: `VITE_API_URL=http://172.21.10.16:5000/api`
- Frontend must run on `localhost:5173`

**Verification**:
```bash
# Test backend health
curl http://172.21.10.16:5000/health

# Test frontend
curl http://localhost:5173
```

## Database Issues

### Database Locked Errors

**Symptoms**:
- "Database is locked" errors
- SQLite operations hanging
- Multiple processes accessing database

**Solution**:
```bash
# Find processes using database
fuser backend/cpap_analytics.db

# Kill if needed
fuser -k backend/cpap_analytics.db
```

### Missing Test Data

**Symptoms**:
- Empty dashboard
- No analytics data
- User authentication works but no sessions

**Solution**:
```bash
cd backend && ./venv/Scripts/python.exe -m app.init_db
```

### Database Schema Issues

**Check database structure**:
```bash
# Connect to database (if sqlite3 available)
sqlite3 backend/cpap_analytics.db ".tables"
sqlite3 backend/cpap_analytics.db ".schema sessions"
sqlite3 backend/cpap_analytics.db ".schema users"

# Check data counts
sqlite3 backend/cpap_analytics.db "SELECT COUNT(*) FROM sessions;"
sqlite3 backend/cpap_analytics.db "SELECT COUNT(*) FROM users;"
```

**If schema is corrupted**:
```bash
# Backup current database
cp backend/cpap_analytics.db backend/cpap_analytics_backup_$(date +%Y%m%d).db

# Reinitialize database
cd backend && ./venv/Scripts/python.exe -m app.init_db
```

### Performance Issues

**Check database performance**:
```bash
# Check database size
ls -lh backend/cpap_analytics.db

# Check for large tables
sqlite3 backend/cpap_analytics.db "SELECT name, COUNT(*) FROM sqlite_master m JOIN pragma_table_info(m.name) p GROUP BY name;"
```

## Package Installation Issues

### npm Install Failures

**Symptoms**:
- Package installation hangs or fails
- Version conflicts
- Cache corruption

**Solution**:
```bash
# Clear npm cache
cd frontend && npm cache clean --force

# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

### pip Install Failures

**Symptoms**:
- Python package installation fails
- Dependency conflicts
- Virtual environment issues

**Solution**:
```bash
# Clear pip cache
cd backend && pip cache purge

# Force reinstall
pip install -r requirements.txt --force-reinstall

# If virtual environment is corrupted
rm -rf venv
python -m venv venv
./venv/Scripts/activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

## Development Workflow

### Clean Restart Procedure

When things aren't working, follow this complete restart:

1. **Kill all processes**:
   ```bash
   # Kill Python processes
   ps aux | grep python | awk '{print $2}' | xargs -r kill -9
   
   # Kill frontend processes  
   pkill -f "npm run dev"
   ```

2. **Clear caches**:
   ```bash
   # Clear Python cache
   cd backend && find . -type d -name __pycache__ -exec rm -rf {} +
   
   # Clear browser localStorage (F12 → Application → Local Storage → Clear)
   ```

3. **Start services**:
   ```bash
   # Start FastAPI backend
   cd backend && ./venv/Scripts/python.exe -m app.main
   
   # Start frontend (in new terminal)
   cd frontend && npm run dev
   ```

4. **Verify endpoints**:
   ```bash
   # Test backend
   curl http://172.21.10.16:5000/health
   
   # Test frontend
   curl http://localhost:5173
   ```

## Common Commands

### Backend Commands
```bash
# Start FastAPI (correct)
cd backend && ./venv/Scripts/python.exe -m app.main

# Initialize database
cd backend && ./venv/Scripts/python.exe -m app.init_db

# Check logs
tail -f backend/fastapi_clean.log
```

### Frontend Commands
```bash
# Start development server
cd frontend && npm run dev

# Check environment
cat frontend/.env
```

### Testing Commands
```bash
# Test login
curl -X POST http://172.21.10.16:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'

# Test analytics (with JWT token)
curl -X GET http://172.21.10.16:5000/api/sessions/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Resolution History

### 2025-05-29: Analytics Endpoint Resolution
- **Issue**: 500 error on `/api/sessions/analytics`
- **Cause**: Flask backend intercepting FastAPI requests
- **Solution**: Killed Flask, fixed FastAPI routing, expanded mock data to 30 days
- **Status**: ✅ Resolved - Full functionality confirmed

### 2025-05-28: FastAPI Migration
- **Issue**: Dual Flask/FastAPI backends causing confusion
- **Solution**: Consolidated to FastAPI-only architecture
- **Status**: ✅ Complete - Flask deprecated

---

*Last Updated: 2025-05-29*
*For additional help, see CLAUDE.md or TODO.md*