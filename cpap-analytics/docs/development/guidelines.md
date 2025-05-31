# CPAP Analytics Development Guide

This guide provides comprehensive information for developers working on the CPAP Analytics platform.

## Table of Contents
- [Development Environment Setup](#development-environment-setup)
- [Architecture Overview](#architecture-overview)
- [Implementation Details](#implementation-details)
- [Best Practices](#best-practices)
- [Common Workflows](#common-workflows)
- [Debugging Tips](#debugging-tips)

## Development Environment Setup

### Prerequisites

```bash
# Required versions
python --version  # 3.8+
node --version    # 16+
git --version     # 2.0+
```

### Quick Start

```bash
# Clone repository
git clone https://github.com/gdadkins/cpap-analytics.git
cd cpap-analytics

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python scripts/init_db.py
python app.py

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

**Access Points:**
- Backend API: http://localhost:5000
- Frontend UI: http://localhost:3000

## Architecture Overview

### Project Structure

```
cpap-analytics/
├── backend/
│   ├── app.py              # Flask main application
│   ├── database.py         # SQLAlchemy setup
│   ├── models/             # Data models
│   ├── routes/             # API endpoints
│   ├── app/                # FastAPI (secondary)
│   └── scripts/            # Utilities
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API integration
│   │   └── types/          # TypeScript types
│   └── package.json
└── docs/
```

### Tech Stack

**Backend:**
- Flask (primary) / FastAPI (secondary)
- SQLAlchemy ORM
- JWT authentication
- SQLite (dev) / PostgreSQL (prod)

**Frontend:**
- React + TypeScript
- Vite build tool
- Tailwind CSS
- Chart.js for visualizations

## Implementation Details

### Database Schema

```sql
-- Core tables
users:
  - id (PK)
  - username (unique)
  - email (unique)
  - password_hash
  - created_at
  - is_active

sessions:
  - id (PK)
  - user_id (FK)
  - date
  - duration_hours
  - ahi (apnea-hypopnea index)
  - mask_leak
  - pressure_avg
  - quality_score
  - created_at

file_uploads:
  - id (PK)
  - user_id (FK)
  - filename
  - file_path
  - status
  - created_at
```

### API Endpoints

#### Authentication
```http
POST /api/auth/register
{
  "username": "string",
  "email": "string",
  "password": "string"
}

POST /api/auth/login
{
  "username": "string",
  "password": "string"
}
Response: { "access_token": "jwt_token" }

GET /api/auth/profile
Headers: Authorization: Bearer <token>
```

#### CPAP Data
```http
GET /api/sessions
Query: ?days=30
Headers: Authorization: Bearer <token>

POST /api/upload
Content-Type: multipart/form-data
Body: file=<cpap_data_file>
Headers: Authorization: Bearer <token>

GET /api/analytics
Headers: Authorization: Bearer <token>
```

### Adding New Features

#### Backend (Flask)

1. **Create Model** (`backend/models/`)
```python
# models/device.py
from database import db

class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    model = db.Column(db.String(100))
    serial_number = db.Column(db.String(50))
```

2. **Create Route** (`backend/routes/`)
```python
# routes/devices.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

devices_bp = Blueprint('devices', __name__)

@devices_bp.route('/api/devices', methods=['GET'])
@jwt_required()
def get_devices():
    user_id = get_jwt_identity()
    # Implementation
```

3. **Register Blueprint** (`backend/app.py`)
```python
from routes.devices import devices_bp
app.register_blueprint(devices_bp)
```

#### Frontend (React)

1. **Create Type** (`frontend/src/types/`)
```typescript
// types/device.ts
export interface Device {
  id: number;
  model: string;
  serialNumber: string;
}
```

2. **Add API Method** (`frontend/src/services/api.ts`)
```typescript
export const getDevices = async (): Promise<Device[]> => {
  const response = await api.get('/devices');
  return response.data;
};
```

3. **Create Component** (`frontend/src/components/`)
```tsx
// components/DeviceList.tsx
import React, { useEffect, useState } from 'react';
import { getDevices } from '../services/api';
import { Device } from '../types/device';

export const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  
  useEffect(() => {
    const fetchDevices = async () => {
      const data = await getDevices();
      setDevices(data);
    };
    fetchDevices();
  }, []);
  
  return (
    <div>
      {devices.map(device => (
        <div key={device.id}>{device.model}</div>
      ))}
    </div>
  );
};
```

## Best Practices

### Code Style

**Python:**
- Follow PEP 8
- Use type hints where helpful
- Keep functions under 20 lines
- Document complex logic

**TypeScript/React:**
- Use functional components
- Implement proper error boundaries
- Handle loading states
- Type all props and state

### Security

1. **Authentication:**
   - JWT tokens with 24-hour expiry
   - Secure password hashing (Werkzeug)
   - Protected routes with `@jwt_required()`

2. **Input Validation:**
   - Validate all user inputs
   - Use parameterized queries
   - Sanitize file uploads

3. **API Security:**
   - CORS properly configured
   - Rate limiting on sensitive endpoints
   - HTTPS in production

### Testing

**Backend Testing:**
```python
# tests/test_auth.py
def test_user_registration(client):
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'secure123'
    })
    assert response.status_code == 201
```

**Frontend Testing:**
```typescript
// Login.test.tsx
test('renders login form', () => {
  render(<Login />);
  expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
});
```

## Common Workflows

### Adding CPAP Data Parser

1. Create parser in `backend/app/parsers/`:
```python
# parsers/philips.py
class PhilipsParser:
    def parse(self, file_path: str) -> List[Session]:
        # Parse Philips CPAP data
        pass
```

2. Update upload endpoint to use parser
3. Add tests for parser logic

### Implementing Analytics Feature

1. Create analytics module:
```python
# analytics/trends.py
def calculate_ahi_trend(sessions: List[Session]) -> Dict:
    # Calculate AHI trends
    return {
        'trend': 'improving',
        'change': -0.5
    }
```

2. Add API endpoint
3. Create visualization component

### Database Migrations

```bash
# After model changes
cd backend
python
>>> from database import db
>>> db.create_all()

# Or use Alembic for production
alembic init alembic
alembic revision --autogenerate -m "Add device model"
alembic upgrade head
```

## Debugging Tips

### Backend Debugging

1. **Enable Flask Debug Mode:**
```python
app.run(debug=True)
```

2. **Check Logs:**
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

3. **Test Endpoints:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### Frontend Debugging

1. **React DevTools:** Install browser extension
2. **Network Tab:** Monitor API calls
3. **Console Logging:** Strategic console.log()

### Common Issues

**CORS Errors:**
```python
# Ensure CORS is configured
from flask_cors import CORS
CORS(app, origins=['http://localhost:3000'])
```

**JWT Errors:**
```python
# Check token configuration
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
```

**Database Connection:**
```python
# Reset database if needed
import os
os.remove('instance/database.db')
db.create_all()
```

## Performance Optimization

1. **Backend:**
   - Use pagination for large datasets
   - Implement caching for analytics
   - Optimize database queries

2. **Frontend:**
   - Lazy load components
   - Implement virtual scrolling
   - Optimize bundle size

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Frontend production build
- [ ] HTTPS configured
- [ ] Monitoring setup
- [ ] Backup strategy defined
- [ ] Security headers configured
- [ ] Rate limiting enabled

## Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy Guide](https://docs.sqlalchemy.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [CPAP Data Standards](https://www.sleepfiles.com/OSCAR/)

---

*Need help? Check existing code patterns first, then consult the documentation.*