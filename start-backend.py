#!/usr/bin/env python3
"""
Flexi-Careers Backend Startup Script
Starts the Flask backend server with proper error handling and logging
"""

import os
import sys
import subprocess
import sqlite3
from pathlib import Path

def check_database():
    """Check if the database exists and is properly set up"""
    db_path = 'flexi_careers.db'
    
    if not os.path.exists(db_path):
        print("❌ Database not found!")
        print("Please run the following command first:")
        print("   python3 setup_database.py")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if main tables exist
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name IN ('companies', 'jobs', 'applications')
        """)
        
        tables = cursor.fetchall()
        conn.close()
        
        if len(tables) < 3:
            print("❌ Database is missing required tables!")
            print("Please run the following command to recreate the database:")
            print("   python3 setup_database.py")
            return False
            
        print("✅ Database is ready")
        return True
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
        return False

def check_python_packages():
    """Check if required Python packages are installed"""
    print("Checking Python packages...")
    
    required_packages = ['flask', 'flask-cors']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\nInstall missing packages with one of these methods:")
        print("   Method 1 (System packages): sudo apt install python3-flask python3-flask-cors")
        print("   Method 2 (Virtual environment): python3 -m venv venv && source venv/bin/activate && pip install flask flask-cors")
        print("   Method 3 (User install): pip install --user flask flask-cors")
        print("\nNote: If pip is not available, you may need to install it first:")
        print("   sudo apt install python3-pip")
        return False
    
    print("✅ All required packages are installed")
    return True

def start_backend():
    """Start the Flask backend server"""
    backend_dir = Path(__file__).parent / 'backend'
    
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        return False
    
    app_file = backend_dir / 'app.py'
    if not app_file.exists():
        print("❌ Backend app.py not found!")
        return False
    
    print("🚀 Starting Flexi-Careers Backend Server...")
    print("📍 Backend API will be available at: http://localhost:5000")
    print("📍 Admin panel available at: http://localhost:8080/admin/login.html")
    print("📍 Public website available at: http://localhost:8080")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        # Start the Flask server
        os.chdir(backend_dir)
        subprocess.run([sys.executable, 'app.py'], check=True)
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting server: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def main():
    """Main startup function"""
    print("🎯 FLEXI-CAREERS BACKEND STARTUP")
    print("=" * 40)
    
    # Check database
    if not check_database():
        sys.exit(1)
    
    # Check Python packages
    if not check_python_packages():
        sys.exit(1)
    
    print("=" * 40)
    
    # Start backend
    if not start_backend():
        sys.exit(1)

if __name__ == '__main__':
    main()