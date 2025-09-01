#!/usr/bin/env python3
"""
Flexi-Careers Backend API
Flask application providing REST API for the public website
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import json
from datetime import datetime
import uuid
import logging
import hashlib
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://neondb_owner:npg_NUzJlgD2j0pQ@ep-long-block-adgy76l6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require')
UPLOAD_FOLDER = 'uploads/resumes'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_db_connection():
    """Create database connection"""
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except psycopg2.Error as e:
        logger.error(f"Database connection error: {e}")
        return None

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

# =====================================================
# PUBLIC WEBSITE API ENDPOINTS
# =====================================================

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """Get all active jobs with company information"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        
        # Get query parameters for filtering
        location = request.args.get('location', '')
        job_type = request.args.get('job_type', '')
        experience_level = request.args.get('experience_level', '')
        is_remote = request.args.get('is_remote', '')
        
        # Build dynamic query
        query = """
            SELECT 
                j.id,
                j.title,
                j.description,
                j.requirements,
                j.responsibilities,
                j.salary_min,
                j.salary_max,
                j.salary_currency,
                j.salary_type,
                j.job_type,
                j.location,
                j.is_remote,
                j.experience_level,
                j.hours_per_week,
                j.duration,
                j.skills,
                j.benefits,
                j.posted_date,
                j.application_deadline,
                c.name as company_name,
                c.description as company_description,
                c.industry,
                c.website as company_website,
                c.logo_url as company_logo,
                c.size as company_size,
                c.location as company_location,
                COUNT(a.id) as application_count
            FROM jobs j
            JOIN companies c ON j.company_id = c.id
            LEFT JOIN applications a ON j.id = a.job_id
            WHERE j.status = 'active'
        """
        
        params = []
        
        if location:
            query += " AND (j.location LIKE %s OR j.is_remote = true)"
            params.append(f"%{location}%")
            
        if job_type:
            query += " AND j.job_type = %s"
            params.append(job_type)
            
        if experience_level:
            query += " AND j.experience_level = %s"
            params.append(experience_level)
            
        if is_remote == 'true':
            query += " AND j.is_remote = true"
            
        query += " GROUP BY j.id ORDER BY j.posted_date DESC"
        
        cursor.execute(query, params)
        jobs = cursor.fetchall()
        
        # Convert to list of dictionaries
        jobs_list = []
        for job in jobs:
            job_dict = dict(job)
            
            # Parse skills JSON if exists
            if job_dict['skills']:
                try:
                    job_dict['skills'] = json.loads(job_dict['skills'])
                except:
                    job_dict['skills'] = []
            else:
                job_dict['skills'] = []
                
            jobs_list.append(job_dict)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'jobs': jobs_list,
            'count': len(jobs_list)
        })
        
    except Exception as e:
        logger.error(f"Error fetching jobs: {e}")
        return jsonify({'error': 'Failed to fetch jobs'}), 500

@app.route('/api/jobs/<int:job_id>', methods=['GET'])
def get_job_details(job_id):
    """Get detailed information about a specific job"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        
        # Get job with company information
        cursor.execute("""
            SELECT 
                j.*,
                c.name as company_name,
                c.description as company_description,
                c.industry,
                c.website as company_website,
                c.logo_url as company_logo,
                c.size as company_size,
                c.location as company_location,
                c.founded_year,
                COUNT(a.id) as application_count
            FROM jobs j
            JOIN companies c ON j.company_id = c.id
            LEFT JOIN applications a ON j.id = a.job_id
            WHERE j.id = %s AND j.status = 'active'
            GROUP BY j.id
        """, (job_id,))
        
        job = cursor.fetchone()
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
            
        job_dict = dict(job)
        
        # Parse skills JSON if exists
        if job_dict['skills']:
            try:
                job_dict['skills'] = json.loads(job_dict['skills'])
            except:
                job_dict['skills'] = []
        else:
            job_dict['skills'] = []
        
        # Get job skills from job_skills table
        cursor.execute("""
            SELECT skill_name, is_required, proficiency_level
            FROM job_skills
            WHERE job_id = %s
            ORDER BY is_required DESC, skill_name
        """, (job_id,))
        
        skills_required = cursor.fetchall()
        job_dict['required_skills'] = [dict(skill) for skill in skills_required]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'job': job_dict
        })
        
    except Exception as e:
        logger.error(f"Error fetching job details: {e}")
        return jsonify({'error': 'Failed to fetch job details'}), 500

@app.route('/api/jobs/<int:job_id>/apply', methods=['POST'])
def apply_for_job(job_id):
    """Submit job application"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        
        # Check if job exists and is active
        cursor.execute("SELECT id FROM jobs WHERE id = %s AND status = 'active'", (job_id,))
        if not cursor.fetchone():
            return jsonify({'error': 'Job not found or no longer active'}), 404
        
        # Get form data (handles both JSON and FormData)
        if request.content_type and 'application/json' in request.content_type:
            data = request.get_json()
            resume_file = None
        else:
            # Handle FormData
            data = {
                'first_name': request.form.get('firstName'),
                'last_name': request.form.get('lastName'),
                'email': request.form.get('email'),
                'phone': request.form.get('phone'),
                'cover_letter': request.form.get('coverLetter')
            }
            resume_file = request.files.get('resume')
        
        if not data:
            return jsonify({'error': 'No application data provided'}), 400
            
        required_fields = ['first_name', 'last_name', 'email']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
                
        # Handle resume file upload
        resume_filename = None
        if resume_file and resume_file.filename:
            # Create uploads directory if it doesn't exist
            upload_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'resumes')
            os.makedirs(upload_dir, exist_ok=True)
            
            # Generate unique filename
            file_extension = os.path.splitext(resume_file.filename)[1]
            resume_filename = f"{uuid.uuid4()}{file_extension}"
            resume_path = os.path.join(upload_dir, resume_filename)
            
            # Save file
            resume_file.save(resume_path)
        
        # Insert application
        cursor.execute("""
            INSERT INTO applications (
                job_id, first_name, last_name, email, phone, 
                cover_letter, resume_filename, status, applied_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, 'submitted', %s)
        """, (
            job_id,
            data['first_name'],
            data['last_name'],
            data['email'],
            data.get('phone', ''),
            data.get('cover_letter', ''),
            resume_filename,
            datetime.now().isoformat()
        ))
        
        application_id = cursor.lastrowid
        
        # Add to application status history
        cursor.execute("""
            INSERT INTO application_status_history (
                application_id, old_status, new_status, changed_by, notes, changed_at
            ) VALUES (%s, NULL, 'submitted', 'system', 'Application submitted via website', %s)
        """, (application_id, datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        logger.info(f"New application submitted: ID {application_id} for job {job_id}")
        
        return jsonify({
            'success': True,
            'message': 'Application submitted successfully',
            'application_id': application_id
        })
        
    except Exception as e:
        logger.error(f"Error submitting application: {e}")
        return jsonify({'error': 'Failed to submit application'}), 500

@app.route('/api/employer-request', methods=['POST'])
def submit_employer_request():
    """Submit employer talent request"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        
        # Get form data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No request data provided'}), 400
            
        required_fields = ['company_name', 'contact_name', 'email', 'role_type', 'requirements']
        missing_fields = []
        for field in required_fields:
            if not data.get(field):
                missing_fields.append(field)
        
        if missing_fields:
            logger.error(f"Missing required fields: {missing_fields}")
            logger.error(f"Received data: {data}")
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
        
        # Insert employer request
        cursor.execute("""
            INSERT INTO employer_requests (
                company_name, contact_name, email, phone, role_type, role_title,
                time_commitment, timeline, requirements, budget_range,
                status, priority, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'new', 'medium', %s)
        """, (
            data['company_name'],
            data['contact_name'],
            data['email'],
            data.get('phone', ''),
            data['role_type'],
            data.get('role_title', ''),
            data.get('time_commitment', ''),
            data.get('timeline', ''),
            data['requirements'],
            data.get('budget_range', ''),
            datetime.now().isoformat()
        ))
        
        request_id = cursor.lastrowid
        
        conn.commit()
        conn.close()
        
        logger.info(f"New employer request submitted: ID {request_id}")
        
        return jsonify({
            'success': True,
            'message': 'Talent request submitted successfully',
            'request_id': request_id
        })
        
    except Exception as e:
        logger.error(f"Error submitting employer request: {e}")
        return jsonify({'error': 'Failed to submit talent request'}), 500

@app.route('/api/companies', methods=['GET'])
def get_companies():
    """Get all companies for display"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                c.*,
                COUNT(j.id) as job_count
            FROM companies c
            LEFT JOIN jobs j ON c.id = j.company_id AND j.status = 'active'
            GROUP BY c.id
            ORDER BY c.name
        """)
        
        companies = cursor.fetchall()
        
        companies_list = [dict(company) for company in companies]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'companies': companies_list
        })
        
    except Exception as e:
        logger.error(f"Error fetching companies: {e}")
        return jsonify({'error': 'Failed to fetch companies'}), 500

@app.route('/api/test', methods=['GET'])
def test_connection():
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
            'message': 'Database connection working',
            'active_jobs': result['count']
        })
        
    except Exception as e:
        logger.error(f"Test connection error: {e}")
        return jsonify({'error': f'Database test failed: {str(e)}'}), 500

@app.route('/api/stats', methods=['GET'])
def get_platform_stats():
    """Get platform statistics for homepage"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        
        # Get various statistics
        stats = {}
        
        # Active jobs count
        cursor.execute("SELECT COUNT(*) FROM jobs WHERE status = 'active'")
        stats['active_jobs'] = cursor.fetchone()[0]
        
        # Companies count
        cursor.execute("SELECT COUNT(*) FROM companies")
        stats['companies'] = cursor.fetchone()[0]
        
        # Total applications
        cursor.execute("SELECT COUNT(*) FROM applications")
        stats['total_applications'] = cursor.fetchone()[0]
        
        # Recent applications (last 30 days)
        cursor.execute("""
            SELECT COUNT(*) FROM applications 
            WHERE date(applied_at) >= date('now', '-30 days')
        """)
        stats['recent_applications'] = cursor.fetchone()[0]
        
        # Industries
        cursor.execute("""
            SELECT industry, COUNT(*) as count
            FROM companies
            WHERE industry IS NOT NULL
            GROUP BY industry
            ORDER BY count DESC
            LIMIT 5
        """)
        industries = cursor.fetchall()
        stats['top_industries'] = [dict(industry) for industry in industries]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'stats': stats
        })
        
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        return jsonify({'error': 'Failed to fetch statistics'}), 500

# =====================================================
# FILE UPLOAD ENDPOINTS
# =====================================================

@app.route('/api/upload/resume', methods=['POST'])
def upload_resume():
    """Handle resume file uploads"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
            
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PDF, DOC, and DOCX files are allowed'}), 400
        
        # Generate unique filename
        filename = str(uuid.uuid4()) + '_' + file.filename
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        
        # Save file
        file.save(file_path)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        return jsonify({
            'success': True,
            'filename': file.filename,
            'stored_filename': filename,
            'file_path': file_path,
            'file_size': file_size
        })
        
    except Exception as e:
        logger.error(f"Error uploading resume: {e}")
        return jsonify({'error': 'Failed to upload resume'}), 500

# =====================================================
# STATIC FILE SERVING
# =====================================================

@app.route('/')
def serve_homepage():
    """Serve the homepage"""
    return send_from_directory('../', 'index.html')

@app.route('/admin/')
def serve_admin_homepage():
    """Serve the admin homepage"""
    return send_from_directory('../admin/', 'index.html')

@app.route('/admin/<path:filename>')
def serve_admin_files(filename):
    """Serve admin static files"""
    return send_from_directory('../admin/', filename)

@app.route('/<path:filename>')
def serve_static_files(filename):
    """Serve static files"""
    return send_from_directory('../', filename)

# =====================================================
# FILE SERVING ENDPOINTS
# =====================================================

@app.route('/uploads/resumes/<filename>')
def serve_resume(filename):
    """Serve uploaded resume files"""
    try:
        resume_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'resumes')
        return send_from_directory(resume_dir, filename)
    except Exception as e:
        logger.error(f"Error serving resume file {filename}: {e}")
        return jsonify({'error': 'File not found'}), 404

# =====================================================
# AUTHENTICATION ENDPOINTS
# =====================================================

@app.route('/api/login', methods=['POST'])
def login():
    """Authenticate user (admin, employer, or staff)"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No login data provided'}), 400
            
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
            
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        
        # Check admin_users table (supports both username and email login)
        cursor.execute("""
            SELECT au.id, au.username, au.email, au.password_hash, au.first_name, au.last_name, 
                   au.role, au.is_active, s.id as staff_id, s.can_assign_requests, s.is_admin,
                   ea.company_name, ea.access_level
            FROM admin_users au
            LEFT JOIN staff s ON au.id = s.user_id
            LEFT JOIN employer_access ea ON au.id = ea.admin_user_id
            WHERE (au.username = %s OR au.email = %s) AND au.is_active = TRUE
        """, (username, username))
        
        user = cursor.fetchone()
        
        if user and user[3] == hash_password(password):
            user_data = {
                'id': user[0],
                'username': user[1],
                'email': user[2],
                'first_name': user[4],
                'last_name': user[5],
                'role': user[6],
                'staff_id': user[8],
                'can_assign_requests': bool(user[9]) if user[9] is not None else False,
                'is_admin': bool(user[10]) if user[10] is not None else False,
                'company_name': user[11],
                'access_level': user[12] or user[6]  # Use access_level or role
            }
            
            # Update last login
            cursor.execute("""
                UPDATE admin_users SET last_login = %s WHERE id = %s
            """, (datetime.now().isoformat(), user[0]))
            
            conn.commit()
            conn.close()
            
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'user': user_data
            })
        else:
            conn.close()
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        logger.error(f"Error during login: {e}")
        return jsonify({'error': 'Login failed'}), 500

# =====================================================
# STAFF MANAGEMENT ENDPOINTS
# =====================================================

@app.route('/admin/api/staff', methods=['GET'])
def get_staff():
    """Get all staff members with enhanced information"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT s.id, s.first_name, s.last_name, s.email, s.phone, s.role, s.department, 
                   s.hire_date, s.status, s.can_assign_requests, s.is_admin, s.user_id,
                   au.username, s.created_at, s.updated_at
            FROM staff s
            LEFT JOIN admin_users au ON s.user_id = au.id
            ORDER BY s.is_admin DESC, s.first_name, s.last_name
        """)
        
        staff = cursor.fetchall()
        staff_list = []
        
        for s in staff:
            staff_dict = {
                'id': s[0],
                'first_name': s[1],
                'last_name': s[2],
                'email': s[3],
                'phone': s[4],
                'role': s[5],
                'department': s[6],
                'hire_date': s[7],
                'status': s[8],
                'can_assign_requests': bool(s[9]),
                'is_admin': bool(s[10]),
                'user_id': s[11],
                'username': s[12],
                'created_at': s[13],
                'updated_at': s[14]
            }
            staff_list.append(staff_dict)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'staff': staff_list
        })
        
    except Exception as e:
        logger.error(f"Error fetching staff: {e}")
        return jsonify({'error': 'Failed to fetch staff'}), 500

@app.route('/admin/api/staff', methods=['POST'])
def create_staff():
    """Create new staff member"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No staff data provided'}), 400
            
        required_fields = ['first_name', 'last_name', 'email', 'role']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
                
        cursor = conn.cursor()
        
        # Check if email already exists
        cursor.execute("SELECT id FROM staff WHERE email = %s", (data['email'],))
        if cursor.fetchone():
            return jsonify({'error': 'Staff member with this email already exists'}), 400
        
        # Create admin user if requested
        user_id = None
        if data.get('create_login_account', False):
            username = data.get('username') or data['email'].split('@')[0]
            password = data.get('password', 'password123')
            
            # Check if username already exists
            cursor.execute("SELECT id FROM admin_users WHERE username = %s OR email = %s", (username, data['email']))
            if cursor.fetchone():
                return jsonify({'error': 'Username or email already exists in admin users'}), 400
            
            cursor.execute("""
                INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role)
                VALUES (%s, %s, %s, %s, %s, 'staff')
            """, (username, data['email'], hash_password(password), data['first_name'], data['last_name']))
            
            user_id = cursor.lastrowid
        
        # Insert staff member
        cursor.execute("""
            INSERT INTO staff (
                first_name, last_name, email, phone, role, department, hire_date,
                can_assign_requests, is_admin, user_id, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'active')
        """, (
            data['first_name'],
            data['last_name'],
            data['email'],
            data.get('phone', ''),
            data['role'],
            data.get('department', ''),
            data.get('hire_date', datetime.now().strftime('%Y-%m-%d')),
            bool(data.get('can_assign_requests', False)),
            bool(data.get('is_admin', False)),
            user_id
        ))
        
        staff_id = cursor.lastrowid
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Staff member created successfully',
            'staff_id': staff_id
        })
        
    except Exception as e:
        logger.error(f"Error creating staff: {e}")
        return jsonify({'error': 'Failed to create staff member'}), 500

@app.route('/admin/api/staff/<int:staff_id>', methods=['PUT'])
def update_staff(staff_id):
    """Update staff member"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No staff data provided'}), 400
            
        cursor = conn.cursor()
        
        # Check if staff member exists
        cursor.execute("SELECT id, user_id FROM staff WHERE id = %s", (staff_id,))
        staff_record = cursor.fetchone()
        if not staff_record:
            return jsonify({'error': 'Staff member not found'}), 404
        
        current_user_id = staff_record[1]
        
        # Update staff record
        cursor.execute("""
            UPDATE staff SET 
                first_name = %s, last_name = %s, email = %s, phone = %s, role = %s,
                department = %s, hire_date = %s, can_assign_requests = %s, is_admin = %s,
                status = %s, updated_at = %s
            WHERE id = %s
        """, (
            data.get('first_name', ''),
            data.get('last_name', ''),
            data.get('email', ''),
            data.get('phone', ''),
            data.get('role', ''),
            data.get('department', ''),
            data.get('hire_date', datetime.now().strftime('%Y-%m-%d')),
            bool(data.get('can_assign_requests', False)),
            bool(data.get('is_admin', False)),
            data.get('status', 'active'),
            datetime.now().isoformat(),
            staff_id
        ))
        
        # Update associated admin user if exists
        if current_user_id:
            cursor.execute("""
                UPDATE admin_users SET 
                    email = %s, first_name = %s, last_name = %s, updated_at = %s
                WHERE id = %s
            """, (
                data.get('email', ''),
                data.get('first_name', ''),
                data.get('last_name', ''),
                datetime.now().isoformat(),
                current_user_id
            ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Staff member updated successfully'
        })
        
    except Exception as e:
        logger.error(f"Error updating staff: {e}")
        return jsonify({'error': 'Failed to update staff member'}), 500

@app.route('/admin/api/staff/<int:staff_id>', methods=['DELETE'])
def delete_staff(staff_id):
    """Delete staff member"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        
        # Check if staff member exists and get user_id
        cursor.execute("SELECT id, user_id, first_name, last_name FROM staff WHERE id = %s", (staff_id,))
        staff_record = cursor.fetchone()
        if not staff_record:
            return jsonify({'error': 'Staff member not found'}), 404
        
        user_id = staff_record[1]
        staff_name = f"{staff_record[2]} {staff_record[3]}"
        
        # Check if staff has assigned requests
        cursor.execute("SELECT COUNT(*) FROM employer_requests WHERE assigned_to = %s", (staff_name,))
        assigned_count = cursor.fetchone()[0]
        
        if assigned_count > 0:
            return jsonify({
                'error': f'Cannot delete staff member with {assigned_count} assigned requests. Please reassign them first.'
            }), 400
        
        # Delete staff record
        cursor.execute("DELETE FROM staff WHERE id = %s", (staff_id,))
        
        # Optionally delete associated admin user
        if user_id:
            cursor.execute("DELETE FROM admin_users WHERE id = %s", (user_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Staff member deleted successfully'
        })
        
    except Exception as e:
        logger.error(f"Error deleting staff: {e}")
        return jsonify({'error': 'Failed to delete staff member'}), 500

# =====================================================
# ADMIN API ENDPOINTS
# =====================================================

@app.route('/admin/api/applications', methods=['GET'])
def get_admin_applications():
    """Get all applications for admin panel"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        
        # Get applications with job and company information
        cursor.execute("""
            SELECT 
                a.*,
                j.title as job_title,
                c.name as company_name,
                c.id as company_id
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN companies c ON j.company_id = c.id
            ORDER BY a.applied_at DESC
        """)
        
        applications = cursor.fetchall()
        applications_list = [dict(app) for app in applications]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'applications': applications_list
        })
        
    except Exception as e:
        logger.error(f"Error fetching applications: {e}")
        return jsonify({'error': 'Failed to fetch applications'}), 500

@app.route('/admin/api/applications/<int:app_id>', methods=['PUT'])
def update_application_status(app_id):
    """Update application status"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        data = request.get_json()
        new_status = data.get('status')
        notes = data.get('notes', '')
        
        if not new_status:
            return jsonify({'error': 'Status is required'}), 400
            
        cursor = conn.cursor()
        
        # Get current status
        cursor.execute("SELECT status FROM applications WHERE id = %s", (app_id,))
        result = cursor.fetchone()
        if not result:
            return jsonify({'error': 'Application not found'}), 404
            
        old_status = result[0]
        
        # Update application status
        cursor.execute("""
            UPDATE applications 
            SET status = %s, updated_at = %s
            WHERE id = %s
        """, (new_status, datetime.now().isoformat(), app_id))
        
        # Add to status history
        cursor.execute("""
            INSERT INTO application_status_history 
            (application_id, old_status, new_status, changed_by, notes, changed_at)
            VALUES (%s, %s, %s, 'admin', %s, %s)
        """, (app_id, old_status, new_status, notes, datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Application status updated'})
        
    except Exception as e:
        logger.error(f"Error updating application: {e}")
        return jsonify({'error': 'Failed to update application'}), 500


@app.route('/admin/api/employer-requests/<int:request_id>/assign', methods=['PUT'])
def assign_employer_request(request_id):
    """Assign employer request to staff member"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        data = request.get_json()
        staff_id = data.get('staff_id')
        notes = data.get('notes', '')
        
        if not staff_id:
            return jsonify({'error': 'Staff ID is required'}), 400
            
        cursor = conn.cursor()
        
        # Verify staff member exists
        cursor.execute("SELECT first_name, last_name FROM staff WHERE id = %s AND status = 'active'", (staff_id,))
        staff_member = cursor.fetchone()
        if not staff_member:
            return jsonify({'error': 'Staff member not found'}), 404
        
        # Update employer request
        cursor.execute("""
            UPDATE employer_requests 
            SET assigned_to = %s, notes = %s, updated_at = %s
            WHERE id = %s
        """, (f"{staff_member[0]} {staff_member[1]}", notes, datetime.now().isoformat(), request_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True, 
            'message': f'Request assigned to {staff_member[0]} {staff_member[1]}'
        })
        
    except Exception as e:
        logger.error(f"Error assigning request: {e}")
        return jsonify({'error': 'Failed to assign request'}), 500

@app.route('/admin/api/employer-requests', methods=['GET'])
def get_admin_employer_requests():
    """Get all employer requests for admin panel with filtering support"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
            
        cursor = conn.cursor()
        
        # Get query parameters for filtering
        assigned_staff = request.args.get('assigned_staff', '')
        status_filter = request.args.get('status', '')
        priority_filter = request.args.get('priority', '')
        
        # Build dynamic query
        query = """
            SELECT er.*, s.id as staff_id, s.first_name as staff_first_name, s.last_name as staff_last_name
            FROM employer_requests er
            LEFT JOIN staff s ON er.assigned_to = (s.first_name || ' ' || s.last_name)
            WHERE 1=1
        """
        params = []
        
        # Filter by assigned staff
        if assigned_staff:
            if assigned_staff == 'unassigned':
                query += " AND (er.assigned_to IS NULL OR er.assigned_to = '')"
            else:
                query += " AND er.assigned_to = %s"
                params.append(assigned_staff)
        
        # Filter by status
        if status_filter:
            query += " AND er.status = %s"
            params.append(status_filter)
        
        # Filter by priority
        if priority_filter:
            query += " AND er.priority = %s"
            params.append(priority_filter)
        
        query += " ORDER BY er.created_at DESC"
        
        cursor.execute(query, params)
        requests = cursor.fetchall()
        
        requests_list = []
        for req in requests:
            req_dict = dict(req)
            # Add staff info if available
            if req_dict.get('staff_id'):
                req_dict['assigned_staff_info'] = {
                    'id': req_dict['staff_id'],
                    'first_name': req_dict['staff_first_name'],
                    'last_name': req_dict['staff_last_name']
                }
            # Clean up the extra staff columns
            for key in ['staff_id', 'staff_first_name', 'staff_last_name']:
                req_dict.pop(key, None)
            requests_list.append(req_dict)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'requests': requests_list,
            'filters': {
                'assigned_staff': assigned_staff,
                'status': status_filter,
                'priority': priority_filter
            }
        })
        
    except Exception as e:
        logger.error(f"Error fetching employer requests: {e}")
        return jsonify({'error': 'Failed to fetch employer requests'}), 500

# =====================================================
# ERROR HANDLERS
# =====================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# =====================================================
# MAIN APPLICATION
# =====================================================

if __name__ == '__main__':
    # Check if database exists
    if not os.path.exists(DATABASE_PATH):
        logger.error(f"Database not found at {DATABASE_PATH}")
        logger.error("Please run setup_database.py first to create the database")
        exit(1)
    
    logger.info("Starting Flexi-Careers Backend API")
    logger.info(f"Database: {os.path.abspath(DATABASE_PATH)}")
    logger.info(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    
    app.run(host='0.0.0.0', port=5000, debug=True)