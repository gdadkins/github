from datetime import datetime
from database import db

class FileUpload(db.Model):
    __tablename__ = 'file_uploads'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer)
    file_type = db.Column(db.String(50))
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    processing_status = db.Column(db.String(50), default='pending')  # pending, processing, completed, failed
    error_message = db.Column(db.Text)
    sessions_imported = db.Column(db.Integer, default=0)
    
    def to_dict(self):
        """Convert file upload object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'file_size': self.file_size,
            'file_type': self.file_type,
            'upload_date': self.upload_date.isoformat() if self.upload_date else None,
            'processing_status': self.processing_status,
            'error_message': self.error_message,
            'sessions_imported': self.sessions_imported
        }
    
    def __repr__(self):
        return f'<FileUpload {self.original_filename}>'
