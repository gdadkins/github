"""
CPAP Analytics Platform - Upload Endpoints
API endpoints for file upload that match Flask backend structure
"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime, date
from typing import List
import tempfile
import os

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User as UserModel
from app.models.session import Session as SessionModel

router = APIRouter()

# File upload models would normally be imported from models
class FileUpload:
    """Temporary model for file uploads - should match Flask FileUpload model"""
    def __init__(self, user_id, filename, original_filename, file_size, file_type, processing_status='processing'):
        self.id = 1  # Mock ID
        self.user_id = user_id
        self.filename = filename
        self.original_filename = original_filename
        self.file_size = file_size
        self.file_type = file_type
        self.processing_status = processing_status
        self.upload_date = datetime.utcnow()
        self.sessions_imported = 0
        self.error_message = None
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'file_size': self.file_size,
            'file_type': self.file_type,
            'processing_status': self.processing_status,
            'upload_date': self.upload_date.isoformat() if self.upload_date else None,
            'sessions_imported': self.sessions_imported,
            'error_message': self.error_message
        }

ALLOWED_EXTENSIONS = {'csv', 'edf', 'txt', 'json'}

def allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@router.post('/file')
async def upload_file(
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload and process CPAP data file - matches Flask endpoint"""
    try:
        user_id = current_user.id
        
        # Check if file is present
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail={"error": "No file selected"}
            )
        
        if not allowed_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail={"error": "File type not allowed"}
            )
        
        # Read file content
        contents = await file.read()
        
        # Create file upload record (mock for now)
        file_upload = FileUpload(
            user_id=user_id,
            filename=file.filename,
            original_filename=file.filename,
            file_size=len(contents),
            file_type=file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'unknown',
            processing_status='processing'
        )
        
        # Process the file
        try:
            sessions_imported = await process_cpap_file(contents, user_id, db)
            
            # Update file upload status
            file_upload.processing_status = 'completed'
            file_upload.sessions_imported = sessions_imported
            
            return {
                'message': f'File uploaded and processed successfully. {sessions_imported} sessions imported.',
                'file_upload': file_upload.to_dict()
            }
        
        except Exception as e:
            # Update file upload status on error
            file_upload.processing_status = 'failed'
            file_upload.error_message = str(e)
            
            raise HTTPException(
                status_code=500,
                detail={
                    'error': f'File processing failed: {str(e)}',
                    'file_upload': file_upload.to_dict()
                }
            )
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail={"error": str(e)}
        )

@router.get('/status/{upload_id}')
async def get_upload_status(
    upload_id: int,
    current_user: UserModel = Depends(get_current_active_user)
):
    """Get upload processing status - matches Flask endpoint"""
    try:
        # Mock implementation - in real app would query FileUpload table
        mock_upload = FileUpload(
            user_id=current_user.id,
            filename=f"upload_{upload_id}.csv",
            original_filename=f"upload_{upload_id}.csv",
            file_size=1024,
            file_type="csv",
            processing_status="completed"
        )
        mock_upload.id = upload_id
        mock_upload.sessions_imported = 5
        
        return {'upload': mock_upload.to_dict()}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": str(e)}
        )

@router.get('/history')
async def get_upload_history(
    current_user: UserModel = Depends(get_current_active_user)
):
    """Get user's upload history - matches Flask endpoint"""
    try:
        # Mock implementation - in real app would query FileUpload table
        mock_uploads = [
            FileUpload(
                user_id=current_user.id,
                filename="cpap_data_2024.csv",
                original_filename="cpap_data_2024.csv",
                file_size=2048,
                file_type="csv",
                processing_status="completed"
            )
        ]
        mock_uploads[0].id = 1
        mock_uploads[0].sessions_imported = 10
        
        return {
            'uploads': [upload.to_dict() for upload in mock_uploads]
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": str(e)}
        )

async def process_cpap_file(contents: bytes, user_id: int, db: Session) -> int:
    """Process uploaded CPAP data file and extract sessions"""
    sessions_imported = 0
    
    try:
        content = contents.decode('utf-8')
        lines = content.strip().split('\n')
        
        # Skip header if present
        if lines and ('date' in lines[0].lower() or 'session' in lines[0].lower()):
            lines = lines[1:]
        
        for line in lines:
            if not line.strip():
                continue
                
            # Parse CSV line (adjust based on your data format)
            parts = line.split(',')
            if len(parts) >= 4:  # Minimum required fields
                try:
                    # Example format: date,duration,ahi,leak,pressure
                    session_date = datetime.strptime(parts[0].strip(), '%Y-%m-%d').date()
                    duration = float(parts[1].strip()) if parts[1].strip() else None
                    ahi = float(parts[2].strip()) if parts[2].strip() else None
                    leak = float(parts[3].strip()) if parts[3].strip() else None
                    pressure = float(parts[4].strip()) if len(parts) > 4 and parts[4].strip() else None
                    
                    # Check if session already exists
                    existing_session = db.query(SessionModel).filter_by(
                        user_id=user_id,
                        date=session_date
                    ).first()
                    
                    if not existing_session:
                        session = SessionModel(
                            user_id=user_id,
                            date=session_date,
                            duration_hours=duration,
                            ahi=ahi,
                            mask_leak=leak,
                            pressure_avg=pressure
                        )
                        
                        # Calculate quality score
                        session.quality_score = session.calculate_quality_score()
                        
                        db.add(session)
                        sessions_imported += 1
                
                except (ValueError, IndexError) as e:
                    print(f"Error parsing line: {line} - {e}")
                    continue
        
        db.commit()
        return sessions_imported
    
    except Exception as e:
        db.rollback()
        raise e