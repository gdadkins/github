from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, desc
from models.session import Session
from models.user import User
from database import db
from datetime import datetime, timedelta

sessions_bp = Blueprint('sessions', __name__)

@sessions_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    try:
        user_id = int(get_jwt_identity())
        
        # Get all sessions for the user
        sessions_query = db.session.query(Session).filter(Session.user_id == user_id)
        total_sessions = sessions_query.count()
        
        if total_sessions == 0:
            return jsonify({
                'summary': {
                    'total_sessions': 0,
                    'avg_ahi': 0,
                    'avg_quality': 0,
                    'avg_duration': 0,
                    'avg_leak': 0
                },
                'trends': [],
                'recent_sessions': []
            })
        
        # Calculate averages using SQLAlchemy aggregation
        stats = db.session.query(
            func.avg(Session.ahi).label('avg_ahi'),
            func.avg(Session.quality_score).label('avg_quality'),
            func.avg(Session.duration_hours).label('avg_duration'),
            func.avg(Session.mask_leak).label('avg_leak')
        ).filter(Session.user_id == user_id).first()
        
        # Get recent sessions (last 30)
        recent_sessions = db.session.query(Session).filter(
            Session.user_id == user_id
        ).order_by(desc(Session.date)).limit(30).all()
        
        # Get trend data (last 30 days)
        thirty_days_ago = datetime.utcnow().date() - timedelta(days=30)
        trend_sessions = db.session.query(Session).filter(
            Session.user_id == user_id,
            Session.date >= thirty_days_ago
        ).order_by(Session.date).all()
        
        trends = []
        for session in trend_sessions:
            trends.append({
                'date': session.date.isoformat(),
                'ahi': float(session.ahi) if session.ahi else 0,
                'quality_score': float(session.quality_score) if session.quality_score else 0,
                'duration_hours': float(session.duration_hours) if session.duration_hours else 0
            })
        
        # Format response
        analytics_data = {
            'summary': {
                'total_sessions': total_sessions,
                'avg_ahi': round(float(stats.avg_ahi or 0), 2),
                'avg_quality': round(float(stats.avg_quality or 0), 1),
                'avg_duration': round(float(stats.avg_duration or 0), 1),
                'avg_leak': round(float(stats.avg_leak or 0), 1)
            },
            'trends': trends,
            'recent_sessions': [session.to_dict() for session in recent_sessions]
        }
        
        return jsonify(analytics_data)
        
    except Exception as e:
        print(f"Analytics error: {e}")
        return jsonify({'error': 'Failed to fetch analytics data'}), 500
