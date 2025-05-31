"""
CPAP Analytics Platform - Sessions Endpoints (Fixed)
Simplified analytics endpoint that works with current database structure
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import Dict, Any, List

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User as UserModel
from app.models.session import Session as SessionModel

router = APIRouter()

@router.get('/analytics')
async def get_analytics(
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Get analytics data for current user - simplified version"""
    try:
        user_id = current_user.id
        
        # Get all sessions for the user
        sessions = db.query(SessionModel).filter(SessionModel.user_id == user_id).all()
        total_sessions = len(sessions)
        
        if total_sessions == 0:
            return {
                'summary': {
                    'total_sessions': 0,
                    'avg_ahi': 0,
                    'avg_quality': 0,
                    'avg_duration': 0,
                    'avg_leak': 0
                },
                'trends': [],
                'recent_sessions': []
            }
        
        # Calculate averages manually from sessions
        total_ahi = sum(s.ahi for s in sessions if s.ahi is not None)
        total_quality = sum(s.quality_score for s in sessions if s.quality_score is not None)
        total_duration_minutes = sum(s.duration_minutes for s in sessions if s.duration_minutes is not None)
        total_leak = sum(s.mask_leak_95 for s in sessions if s.mask_leak_95 is not None)
        
        count_ahi = sum(1 for s in sessions if s.ahi is not None)
        count_quality = sum(1 for s in sessions if s.quality_score is not None)
        count_duration = sum(1 for s in sessions if s.duration_minutes is not None)
        count_leak = sum(1 for s in sessions if s.mask_leak_95 is not None)
        
        avg_ahi = round(total_ahi / count_ahi, 2) if count_ahi > 0 else 0
        avg_quality = round(total_quality / count_quality, 1) if count_quality > 0 else 0
        avg_duration_hours = round((total_duration_minutes / count_duration) / 60, 1) if count_duration > 0 else 0
        avg_leak = round(total_leak / count_leak, 1) if count_leak > 0 else 0
        
        # Get recent sessions (last 30)
        recent_sessions = sorted(sessions, key=lambda s: s.start_time if s.start_time else datetime.min, reverse=True)[:30]
        
        # Get trend data (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        trend_sessions = [s for s in sessions if s.start_time and s.start_time >= thirty_days_ago]
        trend_sessions.sort(key=lambda s: s.start_time)
        
        trends = []
        for session in trend_sessions:
            trends.append({
                'date': session.date.isoformat() if session.date else session.start_time.date().isoformat(),
                'ahi': float(session.ahi) if session.ahi else 0,
                'quality_score': float(session.quality_score) if session.quality_score else 0,
                'duration_hours': float(session.duration_hours) if session.duration_hours else 0
            })
        
        # Format response to match Flask format
        analytics_data = {
            'summary': {
                'total_sessions': total_sessions,
                'avg_ahi': avg_ahi,
                'avg_quality': avg_quality,
                'avg_duration': avg_duration_hours,
                'avg_leak': avg_leak
            },
            'trends': trends,
            'recent_sessions': [session.to_dict() for session in recent_sessions]
        }
        
        return analytics_data
        
    except Exception as e:
        import traceback
        print(f"Analytics error: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail={"error": f"Failed to fetch analytics data: {str(e)}"}
        )