#!/usr/bin/env python3
"""
Flexi-Careers Database Query Examples
Demonstrates common database operations
"""

import sqlite3
import json
from datetime import datetime

def connect_db():
    """Connect to the database"""
    return sqlite3.connect('flexi_careers.db')

def get_active_jobs_with_companies():
    """Get all active jobs with company information"""
    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            j.id,
            j.title,
            c.name as company_name,
            c.industry,
            j.location,
            j.salary_min,
            j.salary_max,
            j.salary_type,
            j.job_type,
            j.hours_per_week,
            j.posted_date,
            COUNT(a.id) as application_count
        FROM jobs j
        JOIN companies c ON j.company_id = c.id
        LEFT JOIN applications a ON j.id = a.job_id
        WHERE j.status = 'active'
        GROUP BY j.id
        ORDER BY j.posted_date DESC
    """)
    
    jobs = cursor.fetchall()
    conn.close()
    
    print("🔍 ACTIVE JOBS WITH APPLICATION COUNTS")
    print("=" * 80)
    
    for job in jobs:
        print(f"📋 {job[1]}")
        print(f"   🏢 {job[2]} ({job[3]})")
        print(f"   📍 {job[4]} | 💰 ${job[5]}-{job[6]}/{job[7]} | ⏰ {job[8]} hrs/week")
        print(f"   📅 Posted: {job[10]} | 📄 {job[11]} applications")
        print()
    
    return jobs

def get_guest_applications():
    """Get guest applications with their details"""
    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            a.first_name,
            a.last_name,
            a.email,
            a.phone,
            j.title,
            c.name as company_name,
            a.status,
            a.applied_at,
            a.rating
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN companies c ON j.company_id = c.id
        ORDER BY a.applied_at DESC
    """)
    
    applications = cursor.fetchall()
    conn.close()
    
    print("📄 GUEST APPLICATIONS")
    print("=" * 80)
    
    for app in applications:
        rating = f"⭐ {app[8]}" if app[8] else "No rating"
        phone = f" | 📞 {app[3]}" if app[3] else ""
        print(f"👤 {app[0]} {app[1]}")
        print(f"   📧 {app[2]}{phone}")
        print(f"   💼 Applied to: {app[4]} at {app[5]}")
        print(f"   📊 Status: {app[6]} | 📅 {app[7]} | {rating}")
        print()
    
    return applications

def get_application_pipeline():
    """Get application pipeline analytics"""
    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            a.status,
            COUNT(*) as count,
            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM applications), 2) as percentage
        FROM applications a
        GROUP BY a.status
        ORDER BY count DESC
    """)
    
    pipeline = cursor.fetchall()
    
    # Get detailed application info
    cursor.execute("""
        SELECT 
            j.title,
            a.first_name || ' ' || a.last_name as candidate_name,
            comp.name as company_name,
            a.status,
            a.applied_at,
            a.rating
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN companies comp ON j.company_id = comp.id
        ORDER BY a.applied_at DESC
    """)
    
    applications = cursor.fetchall()
    conn.close()
    
    print("📊 APPLICATION PIPELINE ANALYTICS")
    print("=" * 80)
    
    print("Status Distribution:")
    for status, count, percentage in pipeline:
        print(f"  {status:15} {count:3} applications ({percentage:5.1f}%)")
    
    print(f"\nRecent Applications:")
    print("-" * 80)
    
    for app in applications[:10]:  # Show last 10 applications
        rating = f"⭐ {app[5]}" if app[5] else "No rating"
        print(f"📄 {app[1]} → {app[0]} at {app[2]}")
        print(f"   Status: {app[3]} | Applied: {app[4]} | {rating}")
        print()

def get_skills_demand():
    """Analyze skill demand across jobs and candidates"""
    conn = connect_db()
    cursor = conn.cursor()
    
    # Skills in job requirements
    cursor.execute("""
        SELECT 
            skill_name,
            COUNT(*) as job_demand,
            SUM(CASE WHEN is_required = 1 THEN 1 ELSE 0 END) as required_count
        FROM job_skills
        GROUP BY skill_name
        ORDER BY job_demand DESC
    """)
    
    job_skills = cursor.fetchall()
    
    # Since we don't have candidate profiles, we can analyze skills mentioned in job requirements
    print(f"\nNote: In the simplified model, candidate skills are not tracked separately.")
    candidate_skills = []  # No candidate skills table in simplified model
    conn.close()
    
    print("📈 SKILLS SUPPLY & DEMAND ANALYSIS")
    print("=" * 80)
    
    print("Most Demanded Skills in Jobs:")
    for skill, demand, required in job_skills[:10]:
        print(f"  {skill:25} {demand} jobs ({required} required)")
    
    print(f"\nCandidate Skills:")
    print("  In the simplified guest-only model, candidate skills are not pre-stored.")
    print("  Skills would be analyzed from resumes and cover letters when needed.")

def get_employer_requests_summary():
    """Get summary of employer requests"""
    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            company_name,
            contact_name,
            email,
            role_type,
            time_commitment,
            budget_range,
            status,
            priority,
            created_at
        FROM employer_requests
        ORDER BY 
            CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
            created_at DESC
    """)
    
    requests = cursor.fetchall()
    conn.close()
    
    print("📞 EMPLOYER REQUESTS SUMMARY")
    print("=" * 80)
    
    for req in requests:
        priority_emoji = {"urgent": "🔥", "high": "⬆️", "medium": "➡️", "low": "⬇️"}.get(req[7], "➡️")
        status_emoji = {"new": "🆕", "contacted": "📞", "in_progress": "⏳", "matched": "✅", "closed": "❌"}.get(req[6], "❓")
        
        print(f"{priority_emoji} {status_emoji} {req[0]} - {req[3].title()} Role")
        print(f"   👤 Contact: {req[1]} ({req[2]})")
        print(f"   ⏰ {req[4]} hours | 💰 {req[5]} | 📅 {req[8]}")
        print(f"   Status: {req[6].title()} | Priority: {req[7].title()}")
        print()

def main():
    """Run all demonstration queries"""
    print("🎯 FLEXI-CAREERS DATABASE DEMONSTRATION")
    print("=" * 80)
    print()
    
    try:
        # Test database connection
        conn = connect_db()
        conn.close()
        print("✅ Database connection successful!")
        print()
        
        # Run demonstration queries
        get_active_jobs_with_companies()
        print()
        
        get_guest_applications()
        print()
        
        get_application_pipeline()
        print()
        
        get_skills_demand()
        print()
        
        get_employer_requests_summary()
        print()
        
        print("🎉 Database demonstration completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()