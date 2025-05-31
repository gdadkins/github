from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models.file_upload import FileUpload
from models.session import Session
from database import db
import os
import tempfile
from datetime import datetime, date

upload_bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'csv', 'edf', 'txt', 'json'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/file', methods=['POST'])
@jwt_required()
def upload_file():
    """Upload and process CPAP data file"""
    try:
        user_id = get_jwt_identity()
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Secure the filename
        filename = secure_filename(file.filename)
        
        # Create file upload record
        file_upload = FileUpload(
            user_id=user_id,
            filename=filename,
            original_filename=file.filename,
            file_size=len(file.read()),
            file_type=filename.rsplit('.', 1)[1].lower() if '.' in filename else 'unknown',
            processing_status='processing'
        )
        
        # Reset file pointer after reading size
        file.seek(0)
        
        db.session.add(file_upload)
        db.session.commit()
        
        # Process the file
        try:
            sessions_imported = process_cpap_file(file, user_id)
            
            # Update file upload status
            file_upload.processing_status = 'completed'
            file_upload.sessions_imported = sessions_imported
            db.session.commit()
            
            return jsonify({
                'message': f'File uploaded and processed successfully. {sessions_imported} sessions imported.',
                'file_upload': file_upload.to_dict()
            }), 200
        
        except Exception as e:
            # Update file upload status on error
            file_upload.processing_status = 'failed'
            file_upload.error_message = str(e)
            db.session.commit()
            
            return jsonify({
                'error': f'File processing failed: {str(e)}',
                'file_upload': file_upload.to_dict()
            }), 500
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@upload_bp.route('/status/<int:upload_id>', methods=['GET'])
@jwt_required()
def get_upload_status(upload_id):
    """Get upload processing status"""
    try:
        user_id = get_jwt_identity()
        file_upload = FileUpload.query.filter_by(id=upload_id, user_id=user_id).first()
        
        if not file_upload:
            return jsonify({'error': 'Upload not found'}), 404
        
        return jsonify({'upload': file_upload.to_dict()}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@upload_bp.route('/history', methods=['GET'])
@jwt_required()
def get_upload_history():
    """Get user's upload history"""
    try:
        user_id = get_jwt_identity()
        uploads = FileUpload.query.filter_by(user_id=user_id)\
                                 .order_by(FileUpload.upload_date.desc())\
                                 .all()
        
        return jsonify({
            'uploads': [upload.to_dict() for upload in uploads]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def process_cpap_file(file, user_id):
    """Process uploaded CPAP data file and extract sessions"""
    sessions_imported = 0
    
    # For now, implement a simple CSV parser
    # In a real implementation, you'd have different parsers for different file types
    
    try:
        content = file.read().decode('utf-8')
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
                    existing_session = Session.query.filter_by(
                        user_id=user_id,
                        date=session_date
                    ).first()
                    
                    if not existing_session:
                        session = Session(
                            user_id=user_id,
                            date=session_date,
                            duration_hours=duration,
                            ahi=ahi,
                            mask_leak=leak,
                            pressure_avg=pressure
                        )
                        
                        # Calculate quality score
                        session.quality_score = session.calculate_quality_score()
                        
                        db.session.add(session)
                        sessions_imported += 1
                
                except (ValueError, IndexError) as e:
                    print(f"Error parsing line: {line} - {e}")
                    continue
        
        db.session.commit()
        return sessions_imported
    
    except Exception as e:
        db.session.rollback()
        raise e
