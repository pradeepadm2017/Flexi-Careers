#!/usr/bin/env python3
"""
Flexi-Careers Backend API - Production Version
Flask application providing REST API for the public website
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import json
from datetime import datetime
import uuid
import logging
import hashlib
from urllib.parse import urlparse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Production CORS configuration
cors_origins = os.getenv('CORS_ORIGINS', '*').split(',')
CORS(app, origins=cors_origins)

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

UPLOAD_FOLDER = 'uploads/resumes'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_db_connection():
    """Create database connection - PostgreSQL for production, SQLite for development"""
    try:
        if DATABASE_URL:
            # Production: PostgreSQL
            conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
            return conn
        else:
            # Development: SQLite
            conn = sqlite3.connect('../flexi_careers.db')
            conn.row_factory = sqlite3.Row
            return conn
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        return None

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

# Import all your existing routes here (same as app.py but with production config)
# ... [Copy all routes from your existing app.py] ...

# Health check endpoint for hosting platforms
@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

# Root redirect
@app.route('/')
def root():
    """Root endpoint - redirect to frontend or show API info"""
    return jsonify({
        'message': 'Flexi-Careers API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'api_docs': '/api',
            'admin': '/admin/api'
        }
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') != 'production'
    
    logger.info("Starting Flexi-Careers Backend API (Production)")
    logger.info(f"Database: {'PostgreSQL' if DATABASE_URL else 'SQLite'}")
    logger.info(f"Port: {port}")
    logger.info(f"Debug: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)