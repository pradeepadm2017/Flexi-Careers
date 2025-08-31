#!/usr/bin/env python3
"""
Update database schema for employer admin access and staff permissions
"""

import sqlite3
import os
from datetime import datetime
import hashlib

def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def update_database():
    """Update database schema and add required data"""
    db_path = 'flexi_careers.db'
    
    if not os.path.exists(db_path):
        print(f"Database {db_path} not found!")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Add employer_access table to link employers to admin access
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS employer_access (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_name VARCHAR(255) NOT NULL,
                contact_email VARCHAR(255) UNIQUE NOT NULL,
                admin_user_id INTEGER,
                access_level VARCHAR(50) DEFAULT 'employer',
                is_active BOOLEAN DEFAULT TRUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (admin_user_id) REFERENCES admin_users(id)
            )
        """)
        print("✓ Created employer_access table")
        
        # Add permissions columns to staff table
        try:
            cursor.execute("ALTER TABLE staff ADD COLUMN can_assign_requests BOOLEAN DEFAULT FALSE")
            print("✓ Added can_assign_requests column to staff table")
        except sqlite3.OperationalError as e:
            if "duplicate column name" not in str(e):
                raise e
            print("- can_assign_requests column already exists")
        
        try:
            cursor.execute("ALTER TABLE staff ADD COLUMN user_id INTEGER")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id)")
            print("✓ Added user_id column to staff table")
        except sqlite3.OperationalError as e:
            if "duplicate column name" not in str(e):
                raise e
            print("- user_id column already exists")
        
        try:
            cursor.execute("ALTER TABLE staff ADD COLUMN is_admin BOOLEAN DEFAULT FALSE")
            print("✓ Added is_admin column to staff table")
        except sqlite3.OperationalError as e:
            if "duplicate column name" not in str(e):
                raise e
            print("- is_admin column already exists")
        
        # Create admin user if doesn't exist
        cursor.execute("SELECT id FROM admin_users WHERE username = 'admin'")
        admin_user = cursor.fetchone()
        
        if not admin_user:
            cursor.execute("""
                INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role)
                VALUES ('admin', 'admin@flexicareers.com', ?, 'System', 'Administrator', 'admin')
            """, (hash_password('admin123'),))
            admin_user_id = cursor.lastrowid
            print("✓ Created admin user (username: admin, password: admin123)")
        else:
            admin_user_id = admin_user[0]
            print("- Admin user already exists")
        
        # Add admin user to staff table as super admin
        cursor.execute("SELECT id FROM staff WHERE email = 'admin@flexicareers.com'")
        admin_staff = cursor.fetchone()
        
        if not admin_staff:
            cursor.execute("""
                INSERT INTO staff (first_name, last_name, email, phone, role, department, 
                                 can_assign_requests, user_id, is_admin, status)
                VALUES ('System', 'Administrator', 'admin@flexicareers.com', '+1-555-0000',
                        'System Administrator', 'Administration', TRUE, ?, TRUE, 'active')
            """, (admin_user_id,))
            print("✓ Added admin user to staff table with all permissions")
        else:
            # Update existing admin staff with permissions
            cursor.execute("""
                UPDATE staff SET can_assign_requests = TRUE, user_id = ?, is_admin = TRUE
                WHERE email = 'admin@flexicareers.com'
            """, (admin_user_id,))
            print("✓ Updated admin staff permissions")
        
        # Update existing staff to allow some to assign requests
        cursor.execute("""
            UPDATE staff SET can_assign_requests = TRUE 
            WHERE role IN ('Talent Acquisition Manager', 'Senior Recruiter', 'Client Success Manager')
        """)
        print("✓ Granted assignment permissions to senior staff")
        
        # Add some sample employers with admin access
        sample_employers = [
            ('TechStart Inc.', 'contact@techstart.com', 'Tech', 'Startup'),
            ('HealthTech Innovations', 'admin@healthtech.com', 'HealthTech', 'Startup'),
            ('FinanceFlow Corp', 'contact@financeflow.com', 'FinTech', 'Corporation')
        ]
        
        for company, email, first, last in sample_employers:
            # Check if employer already exists
            cursor.execute("SELECT id FROM admin_users WHERE email = ?", (email,))
            if not cursor.fetchone():
                # Create admin user for employer
                username = f"{email.split('@')[0]}_{company.replace(' ', '').lower()}"
                cursor.execute("""
                    INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role)
                    VALUES (?, ?, ?, ?, ?, 'employer')
                """, (username, email, hash_password('password123'), first, last))
                
                employer_user_id = cursor.lastrowid
                
                # Add to employer_access table
                cursor.execute("""
                    INSERT INTO employer_access (company_name, contact_email, admin_user_id, access_level)
                    VALUES (?, ?, ?, 'employer')
                """, (company, email, employer_user_id))
                
                print(f"✓ Created employer access for {company} (email: {email}, password: password123)")
        
        conn.commit()
        print("\n🎉 Database schema updated successfully!")
        print("\nAccess Details:")
        print("- Admin User: admin / admin123 (full access)")
        print("- Employer Users: use their email / password123 (employer access)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error updating database: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

if __name__ == '__main__':
    update_database()