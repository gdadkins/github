"""
CPAP Analytics Platform - Sessions Endpoints (30-Day Mock Data)
Updated to include full 30-day dataset for proper visualization
"""

from fastapi import APIRouter, Depends
from app.core.security import get_current_active_user
from app.models.user import User as UserModel

router = APIRouter()

@router.get('/analytics')
async def get_analytics(
    current_user: UserModel = Depends(get_current_active_user)
):
    """Return 30-day mock analytics data - TESTING SESSIONS_SIMPLE.PY"""
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
            {'date': '2025-05-25', 'ahi': 5.1, 'quality_score': 82.0, 'duration_hours': 7.0},
            {'date': '2025-05-24', 'ahi': 4.6, 'quality_score': 85.0, 'duration_hours': 7.5},
            {'date': '2025-05-23', 'ahi': 3.8, 'quality_score': 88.0, 'duration_hours': 8.0},
            {'date': '2025-05-22', 'ahi': 4.3, 'quality_score': 86.0, 'duration_hours': 7.6},
            {'date': '2025-05-21', 'ahi': 5.2, 'quality_score': 81.0, 'duration_hours': 6.9},
            {'date': '2025-05-20', 'ahi': 4.1, 'quality_score': 87.0, 'duration_hours': 7.7},
            {'date': '2025-05-19', 'ahi': 3.7, 'quality_score': 90.0, 'duration_hours': 8.2},
            {'date': '2025-05-18', 'ahi': 4.9, 'quality_score': 84.0, 'duration_hours': 7.3},
            {'date': '2025-05-17', 'ahi': 4.4, 'quality_score': 85.0, 'duration_hours': 7.4},
            {'date': '2025-05-16', 'ahi': 3.6, 'quality_score': 91.0, 'duration_hours': 8.3},
            {'date': '2025-05-15', 'ahi': 5.0, 'quality_score': 83.0, 'duration_hours': 7.1},
            {'date': '2025-05-14', 'ahi': 4.5, 'quality_score': 86.0, 'duration_hours': 7.8},
            {'date': '2025-05-13', 'ahi': 3.9, 'quality_score': 88.0, 'duration_hours': 7.9},
            {'date': '2025-05-12', 'ahi': 4.7, 'quality_score': 84.0, 'duration_hours': 7.2},
            {'date': '2025-05-11', 'ahi': 4.0, 'quality_score': 87.0, 'duration_hours': 7.8},
            {'date': '2025-05-10', 'ahi': 3.5, 'quality_score': 92.0, 'duration_hours': 8.4},
            {'date': '2025-05-09', 'ahi': 5.3, 'quality_score': 80.0, 'duration_hours': 6.8},
            {'date': '2025-05-08', 'ahi': 4.2, 'quality_score': 86.0, 'duration_hours': 7.6},
            {'date': '2025-05-07', 'ahi': 3.8, 'quality_score': 89.0, 'duration_hours': 8.0},
            {'date': '2025-05-06', 'ahi': 4.6, 'quality_score': 85.0, 'duration_hours': 7.4},
            {'date': '2025-05-05', 'ahi': 4.1, 'quality_score': 87.0, 'duration_hours': 7.7},
            {'date': '2025-05-04', 'ahi': 3.4, 'quality_score': 93.0, 'duration_hours': 8.5},
            {'date': '2025-05-03', 'ahi': 5.1, 'quality_score': 82.0, 'duration_hours': 7.0},
            {'date': '2025-05-02', 'ahi': 4.3, 'quality_score': 86.0, 'duration_hours': 7.5},
            {'date': '2025-05-01', 'ahi': 3.9, 'quality_score': 88.0, 'duration_hours': 7.9},
            {'date': '2025-04-30', 'ahi': 4.8, 'quality_score': 84.0, 'duration_hours': 7.3},
            {'date': '2025-04-29', 'ahi': 4.0, 'quality_score': 87.0, 'duration_hours': 7.8}
        ],
        'recent_sessions': [
            {'id': 999, 'user_id': current_user.id, 'date': '2025-05-28', 'duration_hours': 7.8, 'ahi': 4.2, 'mask_leak': 4.5, 'pressure_avg': 12.0, 'pressure_95': 14.0, 'quality_score': 87.0, 'central_apneas': 2, 'obstructive_apneas': 5, 'hypopneas': 8, 'created_at': '2025-05-28T23:00:00'},
            {'id': 2, 'user_id': current_user.id, 'date': '2025-05-27', 'duration_hours': 7.2, 'ahi': 4.8, 'mask_leak': 5.5, 'pressure_avg': 12.5, 'pressure_95': 14.5, 'quality_score': 83.0, 'central_apneas': 3, 'obstructive_apneas': 6, 'hypopneas': 10, 'created_at': '2025-05-27T23:00:00'},
            {'id': 3, 'user_id': current_user.id, 'date': '2025-05-26', 'duration_hours': 8.1, 'ahi': 3.9, 'mask_leak': 3.2, 'pressure_avg': 11.5, 'pressure_95': 13.8, 'quality_score': 89.0, 'central_apneas': 1, 'obstructive_apneas': 4, 'hypopneas': 7, 'created_at': '2025-05-26T23:00:00'},
            {'id': 4, 'user_id': current_user.id, 'date': '2025-05-25', 'duration_hours': 7.0, 'ahi': 5.1, 'mask_leak': 6.8, 'pressure_avg': 13.2, 'pressure_95': 15.1, 'quality_score': 82.0, 'central_apneas': 4, 'obstructive_apneas': 8, 'hypopneas': 12, 'created_at': '2025-05-25T23:00:00'},
            {'id': 5, 'user_id': current_user.id, 'date': '2025-05-24', 'duration_hours': 7.5, 'ahi': 4.6, 'mask_leak': 5.1, 'pressure_avg': 12.3, 'pressure_95': 14.2, 'quality_score': 85.0, 'central_apneas': 2, 'obstructive_apneas': 6, 'hypopneas': 9, 'created_at': '2025-05-24T23:00:00'},
            {'id': 6, 'user_id': current_user.id, 'date': '2025-05-23', 'duration_hours': 8.0, 'ahi': 3.8, 'mask_leak': 3.8, 'pressure_avg': 11.8, 'pressure_95': 13.5, 'quality_score': 88.0, 'central_apneas': 1, 'obstructive_apneas': 5, 'hypopneas': 8, 'created_at': '2025-05-23T23:00:00'},
            {'id': 7, 'user_id': current_user.id, 'date': '2025-05-22', 'duration_hours': 7.6, 'ahi': 4.3, 'mask_leak': 4.7, 'pressure_avg': 12.1, 'pressure_95': 14.0, 'quality_score': 86.0, 'central_apneas': 2, 'obstructive_apneas': 6, 'hypopneas': 9, 'created_at': '2025-05-22T23:00:00'},
            {'id': 8, 'user_id': current_user.id, 'date': '2025-05-21', 'duration_hours': 6.9, 'ahi': 5.2, 'mask_leak': 7.3, 'pressure_avg': 13.5, 'pressure_95': 15.4, 'quality_score': 81.0, 'central_apneas': 3, 'obstructive_apneas': 8, 'hypopneas': 13, 'created_at': '2025-05-21T23:00:00'},
            {'id': 9, 'user_id': current_user.id, 'date': '2025-05-20', 'duration_hours': 7.7, 'ahi': 4.1, 'mask_leak': 4.2, 'pressure_avg': 11.9, 'pressure_95': 13.7, 'quality_score': 87.0, 'central_apneas': 2, 'obstructive_apneas': 5, 'hypopneas': 8, 'created_at': '2025-05-20T23:00:00'},
            {'id': 10, 'user_id': current_user.id, 'date': '2025-05-19', 'duration_hours': 8.2, 'ahi': 3.7, 'mask_leak': 3.1, 'pressure_avg': 11.4, 'pressure_95': 13.2, 'quality_score': 90.0, 'central_apneas': 1, 'obstructive_apneas': 4, 'hypopneas': 7, 'created_at': '2025-05-19T23:00:00'},
            {'id': 11, 'user_id': current_user.id, 'date': '2025-05-18', 'duration_hours': 7.3, 'ahi': 4.9, 'mask_leak': 5.8, 'pressure_avg': 12.8, 'pressure_95': 14.6, 'quality_score': 84.0, 'central_apneas': 3, 'obstructive_apneas': 7, 'hypopneas': 11, 'created_at': '2025-05-18T23:00:00'},
            {'id': 12, 'user_id': current_user.id, 'date': '2025-05-17', 'duration_hours': 7.4, 'ahi': 4.4, 'mask_leak': 4.9, 'pressure_avg': 12.2, 'pressure_95': 14.1, 'quality_score': 85.0, 'central_apneas': 2, 'obstructive_apneas': 6, 'hypopneas': 9, 'created_at': '2025-05-17T23:00:00'},
            {'id': 13, 'user_id': current_user.id, 'date': '2025-05-16', 'duration_hours': 8.3, 'ahi': 3.6, 'mask_leak': 2.9, 'pressure_avg': 11.3, 'pressure_95': 13.1, 'quality_score': 91.0, 'central_apneas': 1, 'obstructive_apneas': 4, 'hypopneas': 6, 'created_at': '2025-05-16T23:00:00'},
            {'id': 14, 'user_id': current_user.id, 'date': '2025-05-15', 'duration_hours': 7.1, 'ahi': 5.0, 'mask_leak': 6.2, 'pressure_avg': 13.0, 'pressure_95': 14.8, 'quality_score': 83.0, 'central_apneas': 3, 'obstructive_apneas': 7, 'hypopneas': 12, 'created_at': '2025-05-15T23:00:00'},
            {'id': 15, 'user_id': current_user.id, 'date': '2025-05-14', 'duration_hours': 7.8, 'ahi': 4.5, 'mask_leak': 4.8, 'pressure_avg': 12.4, 'pressure_95': 14.3, 'quality_score': 86.0, 'central_apneas': 2, 'obstructive_apneas': 6, 'hypopneas': 10, 'created_at': '2025-05-14T23:00:00'},
            {'id': 16, 'user_id': current_user.id, 'date': '2025-05-13', 'duration_hours': 7.9, 'ahi': 3.9, 'mask_leak': 3.7, 'pressure_avg': 11.7, 'pressure_95': 13.6, 'quality_score': 88.0, 'central_apneas': 1, 'obstructive_apneas': 5, 'hypopneas': 8, 'created_at': '2025-05-13T23:00:00'},
            {'id': 17, 'user_id': current_user.id, 'date': '2025-05-12', 'duration_hours': 7.2, 'ahi': 4.7, 'mask_leak': 5.4, 'pressure_avg': 12.6, 'pressure_95': 14.5, 'quality_score': 84.0, 'central_apneas': 3, 'obstructive_apneas': 7, 'hypopneas': 11, 'created_at': '2025-05-12T23:00:00'},
            {'id': 18, 'user_id': current_user.id, 'date': '2025-05-11', 'duration_hours': 7.8, 'ahi': 4.0, 'mask_leak': 4.1, 'pressure_avg': 11.8, 'pressure_95': 13.8, 'quality_score': 87.0, 'central_apneas': 2, 'obstructive_apneas': 5, 'hypopneas': 8, 'created_at': '2025-05-11T23:00:00'},
            {'id': 19, 'user_id': current_user.id, 'date': '2025-05-10', 'duration_hours': 8.4, 'ahi': 3.5, 'mask_leak': 2.8, 'pressure_avg': 11.2, 'pressure_95': 13.0, 'quality_score': 92.0, 'central_apneas': 1, 'obstructive_apneas': 4, 'hypopneas': 6, 'created_at': '2025-05-10T23:00:00'},
            {'id': 20, 'user_id': current_user.id, 'date': '2025-05-09', 'duration_hours': 6.8, 'ahi': 5.3, 'mask_leak': 7.9, 'pressure_avg': 13.8, 'pressure_95': 15.7, 'quality_score': 80.0, 'central_apneas': 4, 'obstructive_apneas': 9, 'hypopneas': 14, 'created_at': '2025-05-09T23:00:00'},
            {'id': 21, 'user_id': current_user.id, 'date': '2025-05-08', 'duration_hours': 7.6, 'ahi': 4.2, 'mask_leak': 4.6, 'pressure_avg': 12.0, 'pressure_95': 13.9, 'quality_score': 86.0, 'central_apneas': 2, 'obstructive_apneas': 5, 'hypopneas': 9, 'created_at': '2025-05-08T23:00:00'},
            {'id': 22, 'user_id': current_user.id, 'date': '2025-05-07', 'duration_hours': 8.0, 'ahi': 3.8, 'mask_leak': 3.5, 'pressure_avg': 11.6, 'pressure_95': 13.4, 'quality_score': 89.0, 'central_apneas': 1, 'obstructive_apneas': 4, 'hypopneas': 7, 'created_at': '2025-05-07T23:00:00'},
            {'id': 23, 'user_id': current_user.id, 'date': '2025-05-06', 'duration_hours': 7.4, 'ahi': 4.6, 'mask_leak': 5.0, 'pressure_avg': 12.5, 'pressure_95': 14.4, 'quality_score': 85.0, 'central_apneas': 2, 'obstructive_apneas': 6, 'hypopneas': 10, 'created_at': '2025-05-06T23:00:00'},
            {'id': 24, 'user_id': current_user.id, 'date': '2025-05-05', 'duration_hours': 7.7, 'ahi': 4.1, 'mask_leak': 4.3, 'pressure_avg': 11.9, 'pressure_95': 13.8, 'quality_score': 87.0, 'central_apneas': 2, 'obstructive_apneas': 5, 'hypopneas': 8, 'created_at': '2025-05-05T23:00:00'},
            {'id': 25, 'user_id': current_user.id, 'date': '2025-05-04', 'duration_hours': 8.5, 'ahi': 3.4, 'mask_leak': 2.6, 'pressure_avg': 11.1, 'pressure_95': 12.9, 'quality_score': 93.0, 'central_apneas': 1, 'obstructive_apneas': 3, 'hypopneas': 5, 'created_at': '2025-05-04T23:00:00'},
            {'id': 26, 'user_id': current_user.id, 'date': '2025-05-03', 'duration_hours': 7.0, 'ahi': 5.1, 'mask_leak': 6.5, 'pressure_avg': 13.1, 'pressure_95': 15.0, 'quality_score': 82.0, 'central_apneas': 3, 'obstructive_apneas': 8, 'hypopneas': 12, 'created_at': '2025-05-03T23:00:00'},
            {'id': 27, 'user_id': current_user.id, 'date': '2025-05-02', 'duration_hours': 7.5, 'ahi': 4.3, 'mask_leak': 4.7, 'pressure_avg': 12.2, 'pressure_95': 14.1, 'quality_score': 86.0, 'central_apneas': 2, 'obstructive_apneas': 6, 'hypopneas': 9, 'created_at': '2025-05-02T23:00:00'},
            {'id': 28, 'user_id': current_user.id, 'date': '2025-05-01', 'duration_hours': 7.9, 'ahi': 3.9, 'mask_leak': 3.6, 'pressure_avg': 11.7, 'pressure_95': 13.5, 'quality_score': 88.0, 'central_apneas': 1, 'obstructive_apneas': 5, 'hypopneas': 8, 'created_at': '2025-05-01T23:00:00'},
            {'id': 29, 'user_id': current_user.id, 'date': '2025-04-30', 'duration_hours': 7.3, 'ahi': 4.8, 'mask_leak': 5.6, 'pressure_avg': 12.7, 'pressure_95': 14.6, 'quality_score': 84.0, 'central_apneas': 3, 'obstructive_apneas': 7, 'hypopneas': 11, 'created_at': '2025-04-30T23:00:00'},
            {'id': 30, 'user_id': current_user.id, 'date': '2025-04-29', 'duration_hours': 7.8, 'ahi': 4.0, 'mask_leak': 4.0, 'pressure_avg': 11.8, 'pressure_95': 13.7, 'quality_score': 87.0, 'central_apneas': 2, 'obstructive_apneas': 5, 'hypopneas': 8, 'created_at': '2025-04-29T23:00:00'}
        ]
    }