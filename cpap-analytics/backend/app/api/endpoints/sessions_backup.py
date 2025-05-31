"""
CPAP Analytics Platform - Sessions Endpoints
API endpoints for CPAP session analytics that match Flask backend structure
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
    """Get analytics data for current user - matches Flask endpoint"""
    try:
        user_id = current_user.id
        
        # Get all sessions for the user
        total_sessions = db.query(SessionModel).filter(SessionModel.user_id == user_id).count()
        
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
        
        # Calculate averages using SQLAlchemy aggregation
        stats = db.query(
            func.avg(SessionModel.ahi).label('avg_ahi'),
            func.avg(SessionModel.quality_score).label('avg_quality'),
            func.avg(SessionModel.duration_minutes).label('avg_duration_minutes'),
            func.avg(SessionModel.mask_leak_95).label('avg_leak')
        ).filter(SessionModel.user_id == user_id).first()
        
        # Get recent sessions (last 30)
        recent_sessions = db.query(SessionModel).filter(
            SessionModel.user_id == user_id
        ).order_by(desc(SessionModel.start_time)).limit(30).all()
        
        # Get trend data (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        trend_sessions = db.query(SessionModel).filter(
            SessionModel.user_id == user_id,
            SessionModel.start_time >= thirty_days_ago
        ).order_by(SessionModel.start_time).all()
        
        trends = []
        for session in trend_sessions:
            trends.append({
                'date': session.date.isoformat(),
                'ahi': float(session.ahi) if session.ahi else 0,
                'quality_score': float(session.quality_score) if session.quality_score else 0,
                'duration_hours': float(session.duration_hours) if session.duration_hours else 0
            })
        
        # Format response to match Flask format
        avg_duration_hours = round(float(stats.avg_duration_minutes or 0) / 60, 1)  # Convert to hours
        
        analytics_data = {
            'summary': {
                'total_sessions': total_sessions,
                'avg_ahi': round(float(stats.avg_ahi or 0), 2),
                'avg_quality': round(float(stats.avg_quality or 0), 1),
                'avg_duration': avg_duration_hours,
                'avg_leak': round(float(stats.avg_leak or 0), 1)
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