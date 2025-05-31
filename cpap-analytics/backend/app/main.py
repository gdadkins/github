"""
CPAP Analytics Platform - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import uvicorn
import os
import logging
from pathlib import Path

from app.api.routes import router as api_router
from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app instance
app = FastAPI(
    title="CPAP Analytics Platform API",
    description="Backend API for CPAP data analysis and visualization",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests"""
    logger.info(f"🔥 REQUEST: {request.method} {request.url.path} - Headers: {dict(request.headers)}")
    response = await call_next(request)
    logger.info(f"🔥 RESPONSE: {response.status_code} for {request.url.path}")
    return response

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse(
        content={
            "status": "healthy",
            "message": "CPAP Analytics Platform API is running",
            "version": "1.0.0"
        }
    )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return JSONResponse(
        content={
            "message": "Welcome to CPAP Analytics Platform API",
            "docs": "/docs",
            "health": "/health"
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=5000,
        reload=True
    )
