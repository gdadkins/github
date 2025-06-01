"""
CPAP Analytics Platform - Configuration Settings
Centralized configuration management
"""

from typing import List
import os

class Settings:
    """Application settings"""
    
    # Application
    APP_NAME: str = "CPAP Analytics Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # CORS (include WSL IP for frontend compatibility)
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
        "http://172.21.10.16:3000",  # WSL IP
        "http://172.21.10.16:5173",   # WSL IP for Vite
        "http://10.255.255.254:5173",  # Windows host from WSL
        "*"  # Temporary: Allow all origins for debugging
    ]
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cpap_analytics.db")
    
    # File Storage
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_FILE_TYPES: List[str] = [".csv", ".txt", ".dat"]
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CPAP Data Processing
    SUPPORTED_CPAP_BRANDS: List[str] = [
        "ResMed",
        "Philips",
        "Fisher & Paykel",
        "DeVilbiss",
        "Somnetics"
    ]

# Create settings instance
settings = Settings()
