"""
CPAP Analytics Platform - API Routes
Main router that includes all API endpoints
"""

from fastapi import APIRouter
from datetime import datetime
import logging
from app.api.endpoints import cpap_data, analytics, users, auth, upload
from app.api.endpoints import sessions

# Configure logging
logger = logging.getLogger(__name__)

# Create main API router
router = APIRouter()

# Include Flask-compatible endpoint routers (for migration)
logger.info("🔥 LOADING AUTH ROUTER")
router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

logger.info("🔥 LOADING SESSIONS ROUTER")
logger.info(f"🔥 SESSIONS ROUTER FILE: {sessions.__file__}")
router.include_router(
    sessions.router,
    prefix="/sessions",
    tags=["Sessions"]
)

logger.info("🔥 LOADING UPLOAD ROUTER") 
router.include_router(
    upload.router,
    prefix="/upload",
    tags=["Upload"]
)

# Include original FastAPI endpoint routers (v1 endpoints)
router.include_router(
    cpap_data.router,
    prefix="/v1/cpap-data",
    tags=["CPAP Data V1"]
)

router.include_router(
    analytics.router,
    prefix="/v1/analytics",
    tags=["Analytics V1"]
)

router.include_router(
    users.router,
    prefix="/v1/users",
    tags=["Users V1"]
)

# API info endpoint
@router.get("/info")
async def api_info():
    """Get API information"""
    return {
        "api_name": "CPAP Analytics Platform API",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/auth",
            "sessions": "/api/sessions", 
            "upload": "/api/upload",
            "cpap_data": "/api/v1/cpap-data",
            "analytics": "/api/v1/analytics",
            "users": "/api/v1/users"
        }
    }

# Test endpoint
@router.get("/test")
async def test_endpoint():
    """Simple test endpoint"""
    return {"message": "FastAPI is working!", "timestamp": str(datetime.now())}
