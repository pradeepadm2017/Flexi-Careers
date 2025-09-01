#!/usr/bin/env python3
"""
Setup production database with schema and initial data
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import hashlib
from datetime import datetime

# Your Neon database connection string
DATABASE_URL = "postgresql://neondb_owner:npg_NUzJlgD2j0pQ@ep-long-block-adgy76l6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def setup_database():
    """Create tables and insert initial data"""
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("✅ Connected to Neon database successfully!")
        
        # Create companies table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS companies (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                industry VARCHAR(100),
                website VARCHAR(255),
                location VARCHAR(255),
                size VARCHAR(50),
                founded_year INTEGER,
                logo_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create jobs table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                company_id INTEGER REFERENCES companies(id),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                requirements TEXT,
                responsibilities TEXT,
                job_type VARCHAR(50),
                location VARCHAR(255),
                is_remote BOOLEAN DEFAULT FALSE,
                experience_level VARCHAR(50),
                hours_per_week VARCHAR(50),
                duration VARCHAR(100),
                salary_min DECIMAL(10,2),
                salary_max DECIMAL(10,2),
                salary_currency VARCHAR(3) DEFAULT 'USD',
                salary_type VARCHAR(20) DEFAULT 'hourly',
                skills TEXT,
                benefits TEXT,
                status VARCHAR(20) DEFAULT 'active',
                posted_date DATE DEFAULT CURRENT_DATE,
                application_deadline DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create applications table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS applications (
                id SERIAL PRIMARY KEY,
                job_id INTEGER REFERENCES jobs(id),
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                cover_letter TEXT,
                resume_filename VARCHAR(255),
                resume_file_size INTEGER,
                status VARCHAR(50) DEFAULT 'submitted',
                rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create employer_requests table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS employer_requests (
                id SERIAL PRIMARY KEY,
                company_name VARCHAR(255) NOT NULL,
                contact_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                role_type VARCHAR(100) NOT NULL,
                role_title VARCHAR(255),
                time_commitment VARCHAR(100),
                timeline VARCHAR(100),
                requirements TEXT NOT NULL,
                budget_range VARCHAR(50),
                status VARCHAR(50) DEFAULT 'new',
                priority VARCHAR(20) DEFAULT 'medium',
                assigned_to VARCHAR(255),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create admin_users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                role VARCHAR(50) DEFAULT 'admin',
                is_active BOOLEAN DEFAULT TRUE,
                last_login TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create staff table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS staff (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20),
                role VARCHAR(100) NOT NULL,
                department VARCHAR(100),
                hire_date DATE,
                status VARCHAR(50) DEFAULT 'active',
                can_assign_requests BOOLEAN DEFAULT FALSE,
                is_admin BOOLEAN DEFAULT FALSE,
                user_id INTEGER REFERENCES admin_users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create employer_access table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS employer_access (
                id SERIAL PRIMARY KEY,
                company_name VARCHAR(255) NOT NULL,
                contact_email VARCHAR(255) UNIQUE NOT NULL,
                admin_user_id INTEGER REFERENCES admin_users(id),
                access_level VARCHAR(50) DEFAULT 'employer',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create application_status_history table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS application_status_history (
                id SERIAL PRIMARY KEY,
                application_id INTEGER REFERENCES applications(id),
                old_status VARCHAR(50),
                new_status VARCHAR(50) NOT NULL,
                changed_by VARCHAR(100),
                notes TEXT,
                changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        print("✅ All tables created successfully!")
        
        # Insert admin user
        cursor.execute("""
            INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role)
            VALUES ('admin', 'admin@flexi-careers.com', %s, 'System', 'Administrator', 'admin')
            ON CONFLICT (username) DO NOTHING
        """, (hash_password('admin123'),))
        
        # Get admin user ID
        cursor.execute("SELECT id FROM admin_users WHERE username = 'admin'")
        admin_user_id = cursor.fetchone()[0]
        
        # Insert admin staff record
        cursor.execute("""
            INSERT INTO staff (first_name, last_name, email, phone, role, department, 
                             can_assign_requests, is_admin, user_id, status)
            VALUES ('System', 'Administrator', 'admin@flexi-careers.com', '+1-555-0000',
                    'System Administrator', 'Administration', TRUE, TRUE, %s, 'active')
            ON CONFLICT (email) DO NOTHING
        """, (admin_user_id,))
        
        # Insert sample staff
        sample_staff = [
            ('Sarah', 'Johnson', 'sarah.johnson@flexicareers.com', '+1-555-0101', 'Talent Acquisition Manager', 'Talent Acquisition', True, False),
            ('Michael', 'Chen', 'michael.chen@flexicareers.com', '+1-555-0102', 'Senior Recruiter', 'Talent Acquisition', True, False),
            ('Emily', 'Rodriguez', 'emily.rodriguez@flexicareers.com', '+1-555-0103', 'Client Success Manager', 'Client Success', True, False),
            ('David', 'Thompson', 'david.thompson@flexicareers.com', '+1-555-0104', 'Recruiter', 'Sales', False, False),
            ('Lisa', 'Wang', 'lisa.wang@flexicareers.com', '+1-555-0105', 'Operations Coordinator', 'Operations', False, False)
        ]
        
        for first, last, email, phone, role, dept, can_assign, is_admin in sample_staff:
            cursor.execute("""
                INSERT INTO staff (first_name, last_name, email, phone, role, department, 
                                 can_assign_requests, is_admin, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'active')
                ON CONFLICT (email) DO NOTHING
            """, (first, last, email, phone, role, dept, can_assign, is_admin))
        
        # Insert sample employer users
        sample_employers = [
            ('TechStart Inc.', 'contact@techstart.com', 'Tech', 'Startup'),
            ('HealthTech Innovations', 'admin@healthtech.com', 'HealthTech', 'Startup'),
            ('FinanceFlow Corp', 'contact@financeflow.com', 'FinTech', 'Corporation')
        ]
        
        for company, email, first, last in sample_employers:
            username = f"{email.split('@')[0]}_{company.replace(' ', '').lower()}"
            
            cursor.execute("""
                INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role)
                VALUES (%s, %s, %s, %s, %s, 'employer')
                ON CONFLICT (email) DO NOTHING
            """, (username, email, hash_password('password123'), first, last))
            
            cursor.execute("SELECT id FROM admin_users WHERE email = %s", (email,))
            user_result = cursor.fetchone()
            if user_result:
                employer_user_id = user_result[0]
                
                cursor.execute("""
                    INSERT INTO employer_access (company_name, contact_email, admin_user_id, access_level)
                    VALUES (%s, %s, %s, 'employer')
                    ON CONFLICT (contact_email) DO NOTHING
                """, (company, email, employer_user_id))
        
        # Insert sample employer requests
        sample_requests = [
            ('TechStart Inc.', 'John Doe', 'john@techstart.com', '+1-555-0201', 'Technology', 'CTO', 
             '30-40 hours', '2-3 weeks', 'Looking for experienced CTO to lead technical strategy...', 
             '$150-200', 'new', 'high', None),
            ('HealthTech Solutions', 'Jane Smith', 'jane@healthtech.com', '+1-555-0202', 'Executive', 'CMO',
             '20-30 hours', '1 month', 'Need CMO to develop go-to-market strategy...', 
             '$120-180', 'contacted', 'medium', 'Sarah Johnson'),
            ('FinanceFlow', 'Bob Wilson', 'bob@financeflow.com', '+1-555-0203', 'Finance', 'CFO',
             '25-35 hours', 'immediate', 'Seeking CFO for Series B preparation...', 
             '$180-250', 'in_progress', 'urgent', 'Michael Chen')
        ]
        
        for company, contact, email, phone, role_type, title, commitment, timeline, reqs, budget, status, priority, assigned in sample_requests:
            cursor.execute("""
                INSERT INTO employer_requests (
                    company_name, contact_name, email, phone, role_type, role_title,
                    time_commitment, timeline, requirements, budget_range, 
                    status, priority, assigned_to
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (company, contact, email, phone, role_type, title, commitment, timeline, 
                  reqs, budget, status, priority, assigned))
        
        # Commit all changes
        conn.commit()
        print("✅ Sample data inserted successfully!")
        
        print("\n🎉 Database setup complete!")
        print("📊 Created tables:")
        print("   - companies")
        print("   - jobs") 
        print("   - applications")
        print("   - employer_requests")
        print("   - admin_users")
        print("   - staff")
        print("   - employer_access")
        print("   - application_status_history")
        
        print("\n👤 Login credentials:")
        print("   Admin: admin / admin123")
        print("   Employers: use email addresses with password123")
        
        return True
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        return False
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    setup_database()