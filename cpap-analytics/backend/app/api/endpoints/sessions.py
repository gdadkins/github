"""
CPAP Analytics Platform - Sessions Endpoints (Mock)
Temporary mock analytics endpoint to get frontend working
"""

from fastapi import APIRouter, Depends
from datetime import datetime, timedelta, date
from typing import Dict, Any
import random

from app.core.security import get_current_active_user
from app.models.user import User as UserModel
from app.analytics import generate_insights

router = APIRouter()

@router.get('/analytics')
async def get_analytics(
    current_user: UserModel = Depends(get_current_active_user)
) -> Dict[str, Any]:
    """Get mock analytics data for current user"""
    
    # Write to a debug file to prove this code is executing
    with open('ANALYTICS_CALLED.txt', 'w') as f:
        f.write(f"ANALYTICS CALLED AT {datetime.now()}\n")
        f.write(f"User ID: {current_user.id}\n")
    
    print("==========================================")
    print("🔥 SESSIONS_MOCK.PY IS BEING USED! 🔥")
    print("==========================================")
    
    # Generate mock recent sessions
    recent_sessions = []
    print(f"DEBUG: Starting to generate 30 sessions")
    for i in range(30):
        print(f"DEBUG: Generating session {i+1}")  
        session_date = date.today() - timedelta(days=i)
        duration_hours = round(random.uniform(6.0, 9.0), 1)
        ahi = round(random.uniform(2.0, 8.0), 1)
        quality_score = round(random.uniform(75.0, 95.0), 1)
        
        recent_sessions.append({
            'id': 30 - i,
            'user_id': current_user.id,
            'date': session_date.isoformat(),
            'duration_hours': duration_hours,
            'ahi': ahi,
            'mask_leak': round(random.uniform(0.5, 15.0), 1),
            'pressure_avg': round(random.uniform(10.0, 15.0), 1),
            'pressure_95': round(random.uniform(12.0, 17.0), 1),
            'quality_score': quality_score,
            'central_apneas': random.randint(0, 5),
            'obstructive_apneas': random.randint(0, 10),
            'hypopneas': random.randint(0, 15),
            'created_at': datetime.utcnow().isoformat()
        })
    
    # Generate trends (same data in different format) - FIXED TO RETURN ALL 30
    trends = []
    for session in recent_sessions:
        trends.append({
            'date': session['date'],
            'ahi': session['ahi'],
            'quality_score': session['quality_score'],
            'duration_hours': session['duration_hours'],
            'usageHours': session['duration_hours'],
            'events': {
                'central': session['central_apneas'],
                'obstructive': session['obstructive_apneas'],
                'hypopnea': session['hypopneas']
            },
            'leakRate': session['mask_leak'],
            'pressure': session['pressure_avg']
        })
    
    # Calculate summary averages
    avg_ahi = round(sum(s['ahi'] for s in recent_sessions) / len(recent_sessions), 2)
    avg_quality = round(sum(s['quality_score'] for s in recent_sessions) / len(recent_sessions), 1)
    avg_duration = round(sum(s['duration_hours'] for s in recent_sessions) / len(recent_sessions), 1)
    avg_leak = round(sum(s['mask_leak'] for s in recent_sessions) / len(recent_sessions), 1)
    
    # Return mock analytics data
    return {
        'summary': {
            'total_sessions': 30,
            'avg_ahi': avg_ahi,
            'avg_quality': avg_quality,
            'avg_duration': avg_duration,
            'avg_leak': avg_leak
        },
        'trends': trends,
        'recent_sessions': recent_sessions
    }

@router.get('/insights')
async def get_insights(
    current_user: UserModel = Depends(get_current_active_user)
) -> Dict[str, Any]:
    """Get intelligent insights and recommendations for current user"""
    
    # Generate mock sessions for insights analysis (same data as analytics)
    recent_sessions = []
    for i in range(30):
        session_date = date.today() - timedelta(days=i)
        duration_hours = round(random.uniform(6.0, 9.0), 1)
        ahi = round(random.uniform(2.0, 8.0), 1)
        quality_score = round(random.uniform(75.0, 95.0), 1)
        
        recent_sessions.append({
            'id': 30 - i,
            'user_id': current_user.id,
            'date': session_date.isoformat(),
            'duration_hours': duration_hours,
            'ahi': ahi,
            'mask_leak': round(random.uniform(0.5, 15.0), 1),
            'pressure_avg': round(random.uniform(10.0, 15.0), 1),
            'pressure_95': round(random.uniform(12.0, 17.0), 1),
            'quality_score': quality_score,
            'central_apneas': random.randint(0, 5),
            'obstructive_apneas': random.randint(0, 10),
            'hypopneas': random.randint(0, 15),
            'created_at': datetime.utcnow().isoformat()
        })
    
    # Generate intelligent insights
    insights = generate_insights(recent_sessions)
    
    return {
        'insights': insights,
        'total_insights': len(insights),
        'generated_at': datetime.utcnow().isoformat()
    }