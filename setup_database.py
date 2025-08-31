#!/usr/bin/env python3
"""
Flexi-Careers Database Setup Script
Creates SQLite database with schema and test data
"""

import sqlite3
import os
import sys
from datetime import datetime

def create_database():
    """Create the database with schema and populate with test data"""
    
    # Database file path
    db_path = 'flexi_careers.db'
    
    # Remove existing database if it exists
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Removed existing database: {db_path}")
    
    # Connect to database (will create if doesn't exist)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Read and execute schema
        print("Creating database schema...")
        with open('create_simplified_database.sql', 'r') as f:
            schema_sql = f.read()
        
        # Split by semicolon and execute each statement
        statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
        for stmt in statements:
            cursor.execute(stmt)
        
        print(f"✓ Created {len(statements)} database objects (tables, indexes)")
        
        # Read and execute test data
        print("Populating with test data...")
        with open('populate_simplified_data.sql', 'r') as f:
            data_sql = f.read()
        
        # Split by semicolon and execute each statement
        data_statements = [stmt.strip() for stmt in data_sql.split(';') if stmt.strip()]
        for stmt in data_statements:
            if stmt:
                cursor.execute(stmt)
        
        print(f"✓ Executed {len(data_statements)} data insertion statements")
        
        # Commit changes
        conn.commit()
        
        # Get table statistics
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        tables = cursor.fetchall()
        
        print("\n" + "="*60)
        print("DATABASE CREATION SUCCESSFUL")
        print("="*60)
        print(f"Database file: {os.path.abspath(db_path)}")
        print(f"File size: {os.path.getsize(db_path):,} bytes")
        print(f"Tables created: {len(tables)}")
        
        # Show record counts for each table
        print("\nTable Statistics:")
        print("-" * 40)
        
        for table in tables:
            table_name = table[0]
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            print(f"{table_name:25} {count:>6} records")
        
        return True
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
        return False
    except FileNotFoundError as e:
        print(f"❌ File error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False
    finally:
        conn.close()

def verify_database():
    """Verify database structure and relationships"""
    
    conn = sqlite3.connect('flexi_careers.db')
    cursor = conn.cursor()
    
    try:
        print("\n" + "="*60)
        print("DATABASE VERIFICATION")
        print("="*60)
        
        # Test key relationships
        print("\nTesting relationships...")
        
        # Jobs with companies
        cursor.execute("""
            SELECT c.name, COUNT(j.id) as job_count 
            FROM companies c 
            LEFT JOIN jobs j ON c.id = j.company_id 
            GROUP BY c.id, c.name
            ORDER BY job_count DESC
        """)
        companies_jobs = cursor.fetchall()
        
        print("\nCompanies and their job counts:")
        for company, count in companies_jobs[:5]:
            print(f"  {company:30} {count} jobs")
        
        # Applications status distribution
        cursor.execute("""
            SELECT status, COUNT(*) as count
            FROM applications
            GROUP BY status
            ORDER BY count DESC
        """)
        app_status = cursor.fetchall()
        
        print(f"\nApplication status distribution:")
        for status, count in app_status:
            print(f"  {status:15} {count} applications")
        
        # Most applied jobs
        cursor.execute("""
            SELECT j.title, c.name, COUNT(a.id) as application_count
            FROM jobs j
            JOIN companies c ON j.company_id = c.id
            LEFT JOIN applications a ON j.id = a.job_id
            GROUP BY j.id
            ORDER BY application_count DESC
            LIMIT 5
        """)
        popular_jobs = cursor.fetchall()
        
        print(f"\nMost popular jobs (by applications):")
        for title, company, count in popular_jobs:
            print(f"  {title[:40]:40} {company[:20]:20} {count} applications")
        
        # Candidate skills summary
        cursor.execute("""
            SELECT skill_name, COUNT(*) as candidate_count
            FROM candidate_skills
            GROUP BY skill_name
            ORDER BY candidate_count DESC
            LIMIT 10
        """)
        skills = cursor.fetchall()
        
        print(f"\nTop candidate skills:")
        for skill, count in skills:
            print(f"  {skill:25} {count} candidates")
            
        print("\n✓ Database verification completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Verification error: {e}")
        return False
    finally:
        conn.close()

def show_schema_info():
    """Display detailed schema information"""
    
    conn = sqlite3.connect('flexi_careers.db')
    cursor = conn.cursor()
    
    try:
        print("\n" + "="*60)
        print("DATABASE SCHEMA DETAILS")
        print("="*60)
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        tables = [row[0] for row in cursor.fetchall()]
        
        for table_name in tables:
            print(f"\n📋 {table_name.upper()} TABLE:")
            print("-" * 50)
            
            # Get table info
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            
            for col in columns:
                col_id, name, data_type, not_null, default, pk = col
                pk_indicator = " 🔑" if pk else ""
                null_indicator = " NOT NULL" if not_null else ""
                default_info = f" DEFAULT {default}" if default else ""
                print(f"  {name:20} {data_type:15}{pk_indicator}{null_indicator}{default_info}")
            
            # Get foreign keys
            cursor.execute(f"PRAGMA foreign_key_list({table_name})")
            fks = cursor.fetchall()
            
            if fks:
                print("  Foreign Keys:")
                for fk in fks:
                    print(f"    {fk[3]} → {fk[2]}.{fk[4]}")
        
        # Show indexes
        print(f"\n📊 INDEXES:")
        print("-" * 30)
        cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%'")
        indexes = cursor.fetchall()
        
        for idx_name, idx_sql in indexes:
            print(f"  {idx_name}")
        
        return True
        
    except Exception as e:
        print(f"❌ Schema info error: {e}")
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    print("Flexi-Careers Database Setup")
    print("="*40)
    
    # Create database
    if create_database():
        # Verify database
        verify_database()
        # Show schema details
        show_schema_info()
        
        print("\n🎉 Database setup completed successfully!")
        print(f"Database ready at: {os.path.abspath('flexi_careers.db')}")
    else:
        print("\n❌ Database setup failed!")
        sys.exit(1)