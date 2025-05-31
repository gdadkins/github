from flask_sqlalchemy import SQLAlchemy

# Create database instance that can be imported by models
db = SQLAlchemy()

def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)
    return db
