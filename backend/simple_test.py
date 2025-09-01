#!/usr/bin/env python3
"""
Simple Flask app to test database connection on Render
"""

from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os

# Try to load dotenv, but don't fail if not available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)
CORS(app)

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://neondb_owner:npg_NUzJlgD2j0pQ@ep-long-block-adgy76l6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require')

def get_db_connection():
    """Create database connection"""
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except psycopg2.Error as e:
        print(f"Database connection error: {e}")
        return None

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Simple Flask app is running'})

@app.route('/test-db', methods=['GET'])
def test_db():
    """Test database connection"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM jobs WHERE status = %s", ('active',))
        result = cursor.fetchone()
        conn.close()
        
        return jsonify({
            'success': True, 
            'message': 'Database connection working!',
            'active_jobs': result['count']
        })
        
    except Exception as e:
        return jsonify({'error': f'Database test failed: {str(e)}'}), 500

@app.route('/simple-jobs', methods=['GET'])
def simple_jobs():
    """Get jobs with simple query"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        cursor.execute("""
            SELECT j.id, j.title, j.salary_min, j.salary_max, j.salary_type,
                   j.job_type, j.location, j.is_remote, j.posted_date,
                   c.name as company_name
            FROM jobs j
            JOIN companies c ON j.company_id = c.id
            WHERE j.status = %s
            ORDER BY j.posted_date DESC
            LIMIT 10
        """, ('active',))
        
        jobs = cursor.fetchall()
        conn.close()
        
        return jsonify({
            'success': True,
            'jobs': [dict(job) for job in jobs],
            'count': len(jobs)
        })
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch jobs: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)