# CPAP Analytics Platform - API Reference

## 🌐 API Overview

Base URL: `https://api.cpap-analytics.com/v1`  
Local Development: `http://localhost:8000/v1`

### Authentication

All API requests require authentication using JWT tokens.

```http
Authorization: Bearer <your-token>
```

### Rate Limiting

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated**: 100 requests per hour
- **Bulk operations**: 10 requests per minute

### Response Format

```json
{
  "status": "success|error",
  "data": { ... },
  "message": "Human-readable message",
  "timestamp": "2025-05-28T12:00:00Z",
  "request_id": "uuid-v4"
}
```

## 🔐 Authentication Endpoints

### POST /auth/register
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "John Doe",
  "cpap_device": "resmed_airsense_10"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user_id": "usr_1234567890",
    "email": "user@example.com",
    "created_at": "2025-05-28T12:00:00Z"
  }
}
```

### POST /auth/login
Authenticate and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 3600,
    "refresh_token": "rf_1234567890"
  }
}
```

### POST /auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refresh_token": "rf_1234567890"
}
```

## 📊 Session Endpoints

### GET /sessions
Retrieve user's therapy sessions.

**Query Parameters:**
- `start_date` (ISO 8601): Filter start date
- `end_date` (ISO 8601): Filter end date
- `limit` (int): Number of results (default: 30, max: 100)
- `offset` (int): Pagination offset

**Example Request:**
```http
GET /v1/sessions?start_date=2025-05-01&limit=7
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "sessions": [
      {
        "session_id": "ses_1234567890",
        "date": "2025-05-28",
        "start_time": "2025-05-28T22:30:00Z",
        "end_time": "2025-05-29T06:15:00Z",
        "duration_minutes": 465,
        "metrics": {
          "ahi": 2.3,
          "ahi_breakdown": {
            "obstructive": 1.5,
            "central": 0.5,
            "hypopnea": 0.3
          },
          "leak_rate": {
            "average": 12.5,
            "95_percentile": 18.2,
            "max": 45.3
          },
          "pressure": {
            "min": 8.5,
            "95_percentile": 12.3,
            "max": 14.0
          },
          "respiratory": {
            "minute_ventilation": 6.8,
            "respiratory_rate": 15.2,
            "tidal_volume": 450
          }
        },
        "quality_score": 92,
        "events": {
          "total_apneas": 11,
          "mask_off_events": 1,
          "large_leak_events": 3
        }
      }
    ],
    "pagination": {
      "total": 180,
      "limit": 7,
      "offset": 0,
      "has_more": true
    }
  }
}
```

### GET /sessions/{session_id}
Get detailed session data.

**Response:**
```json
{
  "status": "success",
  "data": {
    "session_id": "ses_1234567890",
    "date": "2025-05-28",
    "detailed_metrics": {
      "hourly_breakdown": [
        {
          "hour": 0,
          "ahi": 1.5,
          "leak_rate": 10.2,
          "pressure_avg": 11.5
        }
      ],
      "event_log": [
        {
          "timestamp": "2025-05-28T23:45:30Z",
          "type": "obstructive_apnea",
          "duration_seconds": 15,
          "severity": "mild"
        }
      ]
    }
  }
}
```

### POST /sessions/import
Import session data from file upload.

**Request:**
```http
POST /v1/sessions/import
Content-Type: multipart/form-data

file: <binary data>
device_type: resmed_airsense_10
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "sessions_imported": 30,
    "date_range": {
      "start": "2025-05-01",
      "end": "2025-05-30"
    },
    "warnings": []
  }
}
```

## 📈 Analytics Endpoints

### GET /analytics/summary
Get therapy summary statistics.

**Query Parameters:**
- `period`: `7d`, `30d`, `90d`, `1y`, `all`
- `metrics`: Comma-separated list of metrics

**Example Request:**
```http
GET /v1/analytics/summary?period=30d&metrics=ahi,leak,compliance
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "period": "30d",
    "metrics": {
      "ahi": {
        "average": 2.8,
        "median": 2.5,
        "min": 0.8,
        "max": 5.2,
        "trend": -0.3,
        "percentile_95": 4.8
      },
      "leak": {
        "average_95p": 16.5,
        "sessions_above_threshold": 3,
        "threshold": 24.0
      },
      "compliance": {
        "usage_days": 28,
        "total_days": 30,
        "percentage": 93.3,
        "average_hours": 7.2
      }
    },
    "quality_score": {
      "current": 88,
      "change": 5,
      "trend": "improving"
    }
  }
}
```

### GET /analytics/trends
Get trend analysis for metrics.

**Query Parameters:**
- `metric`: `ahi`, `leak`, `pressure`, `usage`
- `period`: `7d`, `30d`, `90d`
- `grouping`: `daily`, `weekly`

**Response:**
```json
{
  "status": "success",
  "data": {
    "metric": "ahi",
    "period": "30d",
    "trend_data": [
      {
        "date": "2025-05-01",
        "value": 3.2,
        "moving_average": 2.9
      }
    ],
    "statistics": {
      "slope": -0.02,
      "r_squared": 0.75,
      "forecast_7d": 2.3,
      "confidence_interval": [2.0, 2.6]
    }
  }
}
```

### GET /analytics/mask-fit
Analyze mask fit and get recommendations.

**Response:**
```json
{
  "status": "success",
  "data": {
    "fit_score": 82,
    "leak_analysis": {
      "average_leak": 18.5,
      "leak_events": 45,
      "problematic_hours": ["02:00", "03:00", "04:00"],
      "position_correlation": {
        "back": 15.2,
        "left": 22.1,
        "right": 19.8
      }
    },
    "recommendations": [
      {
        "type": "mask_change",
        "confidence": 0.85,
        "reason": "High leak rates during REM sleep",
        "suggested_masks": [
          {
            "brand": "ResMed",
            "model": "F30i",
            "type": "full_face",
            "features": ["top-of-head connection", "minimal contact"]
          }
        ]
      }
    ]
  }
}
```

### GET /analytics/insights
Get intelligent analysis and personalized recommendations.

**Query Parameters:**
- `period`: `7d`, `30d`, `90d` (default: 30d)
- `types`: Comma-separated insight types to include

**Example Request:**
```http
GET /v1/analytics/insights?period=30d&types=achievement,concern,recommendation
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "insights": [
      {
        "type": "achievement",
        "title": "🏆 Excellent Compliance",
        "message": "Outstanding! You've averaged 7.5 hours nightly this week with 100% compliance. You're in the top 15% of CPAP users.",
        "confidence": "high",
        "clinical_relevance": "high",
        "actionable": false,
        "data_points": {
          "avg_hours": 7.5,
          "compliance_rate": 100.0
        },
        "next_steps": [],
        "priority": 5,
        "timestamp": "2025-05-29T18:30:31.122915"
      },
      {
        "type": "recommendation",
        "title": "🔧 Mask Fit Optimization",
        "message": "Your mask leak averages 28.1 L/min (target: <24). High leaks reduce therapy effectiveness.",
        "confidence": "high",
        "clinical_relevance": "high",
        "actionable": true,
        "next_steps": [
          "Readjust mask straps (not too tight)",
          "Check for worn mask cushions",
          "Try different mask size/style",
          "Clean mask components thoroughly"
        ],
        "priority": 7,
        "timestamp": "2025-05-29T18:30:31.123414"
      }
    ],
    "total_insights": 8,
    "generated_at": "2025-05-29T18:30:31.123414",
    "analysis_period": "30d"
  }
}
```

### Intelligence Engine

The insights engine uses **rule-based expert system logic** (not machine learning) to analyze therapy data:

**Analysis Methods:**
- **Statistical Analysis**: Calculates averages, trends, percentiles, standard deviation
- **Medical Threshold Rules**: Clinical guidelines embedded as IF/THEN decision trees
- **Pattern Detection**: Linear regression for trend calculation
- **Contextual Messaging**: Dynamic text generation based on calculated values
- **Priority Scoring**: Rule-based clinical relevance assignment

**Insight Types:**
- `achievement`: Celebrates milestones and excellent performance
- `improvement`: Recognizes positive trends and progress
- `concern`: Identifies potential issues requiring attention
- `recommendation`: Provides actionable optimization suggestions
- `trend`: Highlights significant pattern changes
- `alert`: Flags urgent issues needing immediate action

### POST /analytics/predict
Get predictive analysis for therapy outcomes (future ML feature).

**Request Body:**
```json
{
  "target_date": "2025-06-01",
  "metrics": ["ahi", "compliance"],
  "include_factors": true
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "predictions": {
      "ahi": {
        "predicted_value": 2.1,
        "confidence_interval": [1.8, 2.4],
        "confidence": 0.82
      },
      "compliance": {
        "predicted_value": 94.5,
        "confidence": 0.91
      }
    },
    "influencing_factors": [
      {
        "factor": "weekend_pattern",
        "impact": -0.3,
        "description": "AHI typically higher on weekends"
      }
    ]
  }
}
```

## 📱 Device Endpoints

### GET /devices
List user's registered devices.

**Response:**
```json
{
  "status": "success",
  "data": {
    "devices": [
      {
        "device_id": "dev_1234567890",
        "type": "resmed_airsense_10",
        "model": "AirSense 10 AutoSet",
        "serial_number": "XXXX1234",
        "firmware_version": "2.3.1",
        "registered_date": "2023-06-15",
        "last_sync": "2025-05-28T08:00:00Z"
      }
    ]
  }
}
```

### POST /devices/register
Register a new CPAP device.

**Request Body:**
```json
{
  "device_type": "resmed_airsense_10",
  "serial_number": "XXXX1234",
  "purchase_date": "2023-06-01"
}
```

## 🏥 Health Integration Endpoints

### POST /integrations/apple-health/sync
Sync data with Apple Health.

**Request Body:**
```json
{
  "start_date": "2025-05-01",
  "end_date": "2025-05-31",
  "metrics": ["sleep", "respiratory_rate", "heart_rate"]
}
```

### GET /integrations/fhir/export
Export data in FHIR format.

**Query Parameters:**
- `format`: `json`, `xml`
- `resources`: Comma-separated FHIR resources

**Response:**
```json
{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Observation",
        "code": {
          "coding": [{
            "system": "http://loinc.org",
            "code": "89985-5",
            "display": "Sleep apnea hypopnea index"
          }]
        },
        "valueQuantity": {
          "value": 2.3,
          "unit": "events/hour"
        }
      }
    }
  ]
}
```

## 🚨 Alerts Endpoints

### GET /alerts
Get active alerts and notifications.

**Response:**
```json
{
  "status": "success",
  "data": {
    "alerts": [
      {
        "alert_id": "alt_1234567890",
        "type": "high_leak",
        "severity": "warning",
        "created_at": "2025-05-28T07:00:00Z",
        "message": "Mask leak exceeded threshold for 3 consecutive nights",
        "action_required": true,
        "recommendations": [
          "Check mask fit and headgear adjustment",
          "Consider mask replacement if over 6 months old"
        ]
      }
    ]
  }
}
```

### PUT /alerts/{alert_id}/acknowledge
Acknowledge an alert.

## 📤 Export Endpoints

### GET /export/report
Generate PDF report.

**Query Parameters:**
- `period`: Report period
- `format`: `pdf`, `html`
- `include_graphs`: Boolean

**Response:**
```json
{
  "status": "success",
  "data": {
    "report_url": "https://api.cpap-analytics.com/reports/rpt_1234567890.pdf",
    "expires_at": "2025-05-29T12:00:00Z"
  }
}
```

## 🔧 Error Handling

### Error Response Format

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid date format",
    "details": {
      "field": "start_date",
      "expected": "ISO 8601 format"
    }
  },
  "request_id": "req_1234567890"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

## 🔌 Webhooks

### Webhook Events

Configure webhooks to receive real-time notifications:

```json
{
  "event": "session.completed",
  "data": {
    "session_id": "ses_1234567890",
    "quality_score": 85,
    "alerts": ["high_ahi"]
  },
  "timestamp": "2025-05-28T07:00:00Z"
}
```

### Available Events
- `session.completed` - New session data available
- `alert.created` - New alert generated
- `report.ready` - Scheduled report generated
- `device.offline` - Device hasn't synced

## 📝 Code Examples

### Python
```python
import requests

class CPAPAnalyticsClient:
    def __init__(self, api_key):
        self.base_url = "https://api.cpap-analytics.com/v1"
        self.headers = {"Authorization": f"Bearer {api_key}"}
    
    def get_sessions(self, days=7):
        response = requests.get(
            f"{self.base_url}/sessions",
            headers=self.headers,
            params={"limit": days}
        )
        return response.json()
    
    def get_mask_analysis(self):
        response = requests.get(
            f"{self.base_url}/analytics/mask-fit",
            headers=self.headers
        )
        return response.json()

# Usage
client = CPAPAnalyticsClient("your-api-key")
sessions = client.get_sessions(30)
print(f"Average AHI: {sessions['data']['average_ahi']}")
```

### JavaScript/TypeScript
```typescript
class CPAPAnalyticsAPI {
  private baseURL = 'https://api.cpap-analytics.com/v1';
  private headers: HeadersInit;

  constructor(private apiKey: string) {
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async getSessions(days: number = 7): Promise<SessionData[]> {
    const response = await fetch(
      `${this.baseURL}/sessions?limit=${days}`,
      { headers: this.headers }
    );
    const data = await response.json();
    return data.data.sessions;
  }

  async getMaskAnalysis(): Promise<MaskAnalysis> {
    const response = await fetch(
      `${this.baseURL}/analytics/mask-fit`,
      { headers: this.headers }
    );
    return response.json();
  }
}

// Usage
const api = new CPAPAnalyticsAPI('your-api-key');
const analysis = await api.getMaskAnalysis();
console.log(`Fit Score: ${analysis.data.fit_score}`);
```

---

## 📚 Additional Resources

- [OpenAPI Specification](https://api.cpap-analytics.com/openapi.json)
- [Postman Collection](https://www.postman.com/cpap-analytics/workspace)
- [API Changelog](https://github.com/cpap-analytics/api/blob/main/CHANGELOG.md)
- [Status Page](https://status.cpap-analytics.com)

For API support, contact: api-support@cpap-analytics.com