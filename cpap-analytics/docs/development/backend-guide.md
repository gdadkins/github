# Backend Development Guide

FastAPI-based REST API for CPAP therapy data analysis.

## Architecture

### Database Models

- **User**: Authentication and profile management
- **Session**: CPAP therapy session data with quality scoring
- **Device**: CPAP device registration and metadata

### API Structure

```text
/api/auth/          # Authentication endpoints
/api/sessions/      # Session data management  
/api/analytics/     # Analytics and reporting
/health             # Health check endpoint
/docs               # Auto-generated API documentation
```

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python -m app.init_db

# Start FastAPI application
python -m app.main
```

## Environment Variables

```bash
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///cpap_analytics.db
JWT_SECRET_KEY=your-jwt-secret-here
CORS_ORIGINS=http://localhost:5173
```

## API Endpoints

### Authentication

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string", 
  "password": "string"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

### Sessions

```http
GET /api/sessions
Authorization: Bearer <jwt_token>

# Response
{
  "sessions": [
    {
      "id": 1,
      "date": "2025-05-28",
      "duration_hours": 8.5,
      "ahi": 2.3,
      "mask_leak": 5.2,
      "pressure_avg": 12.4,
      "quality_score": 85.7
    }
  ]
}
```

### Analytics

```http
GET /api/sessions/analytics
Authorization: Bearer <jwt_token>

# Response
{
  "summary": {
    "total_sessions": 30,
    "avg_ahi": 2.1,
    "avg_quality": 88.5,
    "compliance_rate": 93.3
  },
  "trends": [
    {
      "date": "2025-05-28",
      "ahi": 2.3,
      "quality_score": 87.5,
      "hours_used": 8.2
    }
  ],
  "recent_sessions": [...]
}
```

### Smart Insights Engine

```http
GET /api/sessions/insights
Authorization: Bearer <jwt_token>

# Response
{
  "insights": [
    {
      "type": "achievement",
      "title": "🏆 Excellent Compliance",
      "message": "Outstanding! You've averaged 7.5 hours nightly with 100% compliance.",
      "confidence": "high",
      "clinical_relevance": "high",
      "actionable": false,
      "data_points": {"avg_hours": 7.5, "compliance_rate": 100.0},
      "next_steps": [],
      "priority": 5,
      "timestamp": "2025-05-29T18:30:31.122915"
    }
  ],
  "total_insights": 3,
  "generated_at": "2025-05-29T18:30:31.123414"
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE
);
```

### Sessions Table

```sql
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    duration_hours FLOAT,
    ahi FLOAT,
    mask_leak FLOAT,
    pressure_avg FLOAT,
    pressure_95th FLOAT,
    events_total INTEGER,
    events_obstructive INTEGER,
    events_central INTEGER,
    events_hypopnea INTEGER,
    quality_score FLOAT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Devices Table

```sql
CREATE TABLE devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    serial_number VARCHAR(100),
    model VARCHAR(100),
    manufacturer VARCHAR(50),
    registered_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_sync DATETIME,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## Quality Score Calculation

The quality score is calculated based on multiple factors:

```python
def calculate_quality_score(self):
    """Calculate therapy quality score (0-100)"""
    if not all([self.ahi, self.duration_hours, self.mask_leak]):
        return None
    
    # AHI score (lower is better, target < 5)
    ahi_score = max(0, 100 - (float(self.ahi) * 10))
    
    # Duration score (target 7+ hours)
    duration_score = min(100, (float(self.duration_hours) / 7.0) * 100)
    
    # Leak score (lower is better, target < 24 L/min)
    leak_score = max(0, 100 - (float(self.mask_leak) / 24.0) * 100)
    
    # Weighted average
    quality_score = (ahi_score * 0.5 + duration_score * 0.3 + leak_score * 0.2)
    
    return round(quality_score, 1)
```

## Smart Insights Engine Architecture

The insights engine uses rule-based expert system logic (not machine learning) to analyze CPAP therapy data:

### Core Components

```python
# Analytics Module Structure
/app/analytics/
  __init__.py              # Module exports
  insights_engine.py       # Core intelligence engine
```

### Insight Types

- **Achievement**: Celebrates milestones and excellent performance
- **Improvement**: Recognizes positive trends and progress
- **Concern**: Identifies potential issues requiring attention
- **Recommendation**: Provides actionable optimization suggestions
- **Trend**: Highlights significant pattern changes
- **Alert**: Flags urgent issues needing immediate action

### Analysis Methods

```python
class InsightsEngine:
    def _analyze_compliance_trends(self, sessions):
        """Rule-based compliance analysis"""
        # Statistical calculation
        compliance_rate = len([h for h in hours if h >= 4]) / len(hours) * 100
        
        # Decision tree logic
        if compliance_rate >= 85:
            return achievement_insight
        elif compliance_rate < 50:
            return concern_insight
    
    def _analyze_ahi_patterns(self, sessions):
        """AHI trend analysis with medical thresholds"""
        avg_ahi = statistics.mean(recent_ahis)
        
        # Clinical guidelines (not ML models)
        if avg_ahi < 5:  # Normal range
            return optimal_control_insight
        elif avg_ahi > 10:  # Concerning range
            return alert_insight
```

### Intelligence Techniques

1. **Statistical Analysis**: Averages, trends, percentiles, standard deviation
2. **Medical Threshold Rules**: Clinical guidelines embedded as IF/THEN logic
3. **Pattern Detection**: Simple linear regression for trend calculation
4. **Contextual Messaging**: Dynamic text generation based on calculated values
5. **Priority Scoring**: Rule-based priority assignment for clinical relevance

### Data Processing Pipeline

```python
# Input: Raw session data
sessions = [
    {"date": "2025-05-29", "ahi": 3.2, "duration_hours": 7.5, "mask_leak": 8.1},
    # ... more sessions
]

# Processing: Rule-based analysis
insights_engine = InsightsEngine()
insights = insights_engine.analyze_therapy_data(sessions)

# Output: Structured insights
[
    {
        "type": "achievement",
        "title": "🏆 Excellent Compliance", 
        "message": "Outstanding! You've averaged 7.5 hours...",
        "confidence": "high",
        "clinical_relevance": "high"
    }
]
```

## FastAPI Features

### Pydantic Schemas

```python
from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class SessionCreate(BaseModel):
    date: date
    duration_hours: float
    ahi: float
    mask_leak: float
    pressure_avg: float

class SessionResponse(BaseModel):
    id: int
    date: date
    duration_hours: float
    ahi: float
    quality_score: Optional[float]
    
    class Config:
        from_attributes = True
```

### Dependency Injection

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from app.core.database import get_db
from app.models.user import User

security = HTTPBearer()

async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(security)
) -> User:
    # JWT token validation logic
    return user
```

### Auto-Generated Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: Available at `/docs`
- **ReDoc**: Available at `/redoc`
- **OpenAPI JSON**: Available at `/openapi.json`

## Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Test specific endpoints
curl -X POST http://172.21.10.16:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

## Security Features

- **Password Hashing**: Bcrypt with salt
- **JWT Authentication**: Secure token-based auth with expiration
- **Input Validation**: Pydantic model validation
- **CORS Protection**: Configured for frontend origin
- **SQL Injection Prevention**: SQLAlchemy ORM protection
- **Rate Limiting**: Built-in slowapi integration

## Development

```bash
# Enable auto-reload mode
python -m app.main

# Database operations
python -m app.init_db

# Generate sample data
python -m scripts.generate_sample_data

# Interactive shell
python -c "from app.core.database import get_db; from app.models import *"
```

## Standard Ports

- **Backend (FastAPI)**: 5000 (http://172.21.10.16:5000 in WSL)
- **Frontend (Vite)**: 5173 (http://localhost:5173)
- **Auto-docs**: http://172.21.10.16:5000/docs

## Error Handling

FastAPI provides automatic error handling with detailed error responses:

```python
from fastapi import HTTPException

@router.post("/sessions/")
async def create_session(
    session: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Business logic
        return session_created
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid session data: {str(e)}"
        )
```

## Performance

- **Async Support**: Full async/await support for I/O operations
- **Connection Pooling**: SQLAlchemy async engine
- **Response Caching**: Redis integration for frequently accessed data
- **Background Tasks**: Celery integration for heavy operations