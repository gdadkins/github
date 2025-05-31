"""
CPAP Analytics Platform - Analytics Mock Endpoints
New endpoint to bypass module caching issues
"""

from fastapi import APIRouter, Depends
from app.core.security import get_current_active_user
from app.models.user import User as UserModel

router = APIRouter()

@router.get('/analytics')
async def get_analytics(current_user: UserModel = Depends(get_current_active_user)):
    """Return mock analytics data - working version"""
    return {
        'summary': {
            'total_sessions': 30,
            'avg_ahi': 4.5,
            'avg_quality': 85.0,
            'avg_duration': 7.5,
            'avg_leak': 5.0
        },
        'trends': [
            {'date': '2025-05-28', 'ahi': 4.2, 'quality_score': 87.0, 'duration_hours': 7.8},
            {'date': '2025-05-27', 'ahi': 4.8, 'quality_score': 83.0, 'duration_hours': 7.2},
            {'date': '2025-05-26', 'ahi': 3.9, 'quality_score': 89.0, 'duration_hours': 8.1},
            {'date': '2025-05-25', 'ahi': 5.1, 'quality_score': 82.0, 'duration_hours': 7.0}
        ],
        'recent_sessions': [
            {
                'id': 1,
                'user_id': current_user.id,
                'date': '2025-05-28',
                'duration_hours': 7.8,
                'ahi': 4.2,
                'mask_leak': 4.5,
                'pressure_avg': 12.0,
                'pressure_95': 14.0,
                'quality_score': 87.0,
                'central_apneas': 2,
                'obstructive_apneas': 5,
                'hypopneas': 8,
                'created_at': '2025-05-28T23:00:00'
            },
            {
                'id': 2,
                'user_id': current_user.id,
                'date': '2025-05-27',
                'duration_hours': 7.2,
                'ahi': 4.8,
                'mask_leak': 5.5,
                'pressure_avg': 12.5,
                'pressure_95': 14.5,
                'quality_score': 83.0,
                'central_apneas': 3,
                'obstructive_apneas': 6,
                'hypopneas': 10,
                'created_at': '2025-05-27T23:00:00'
            }
        ]
    }