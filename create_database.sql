-- Flexi-Careers Database Schema
-- SQLite Database for Fractional Employment Platform

-- =====================================================
-- 1. COMPANIES TABLE
-- =====================================================
CREATE TABLE companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    size VARCHAR(50), -- startup, small, medium, large, enterprise
    location VARCHAR(255),
    founded_year INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. JOBS TABLE
-- =====================================================
CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_type VARCHAR(20) DEFAULT 'hourly', -- hourly, monthly, yearly, project
    job_type VARCHAR(50) NOT NULL, -- permanent, temporary, contract
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT FALSE,
    experience_level VARCHAR(50), -- entry, mid, senior, executive
    hours_per_week VARCHAR(50), -- 10-20, 20-30, 30-40, flexible
    duration VARCHAR(100), -- ongoing, 3-6 months, 6-12 months, project-based
    skills TEXT, -- JSON array of skills
    benefits TEXT,
    status VARCHAR(20) DEFAULT 'active', -- active, paused, closed, draft
    posted_date DATE DEFAULT CURRENT_DATE,
    application_deadline DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- =====================================================
-- 3. CANDIDATES TABLE
-- =====================================================
CREATE TABLE candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    years_experience INTEGER,
    current_title VARCHAR(255),
    bio TEXT,
    skills TEXT, -- JSON array of skills
    availability VARCHAR(50), -- immediate, 2-weeks, 1-month, negotiable
    hourly_rate_min INTEGER,
    hourly_rate_max INTEGER,
    preferred_job_type VARCHAR(50), -- permanent, temporary, both
    is_remote_only BOOLEAN DEFAULT FALSE,
    profile_status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. APPLICATIONS TABLE
-- =====================================================
CREATE TABLE applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    candidate_id INTEGER NOT NULL,
    cover_letter TEXT,
    resume_filename VARCHAR(255),
    resume_file_path VARCHAR(500),
    resume_file_size INTEGER,
    status VARCHAR(50) DEFAULT 'submitted', -- submitted, reviewed, interviewing, shortlisted, rejected, hired
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    notes TEXT, -- Internal notes from recruiters/hiring managers
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    interview_scheduled_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    UNIQUE(job_id, candidate_id) -- Prevent duplicate applications
);

-- =====================================================
-- 5. EMPLOYER_REQUESTS TABLE (from contact form)
-- =====================================================
CREATE TABLE employer_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role_type VARCHAR(100) NOT NULL, -- executive, technology, marketing, strategy, other
    time_commitment VARCHAR(50), -- 10-20, 20-30, 30-40, project, flexible
    timeline VARCHAR(50), -- immediate, 1-2weeks, 1month, flexible
    requirements TEXT NOT NULL,
    budget_range VARCHAR(50), -- 50-100, 100-150, 150-200, 200+, project
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, in_progress, matched, closed
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    assigned_to VARCHAR(255), -- Staff member handling this request
    notes TEXT, -- Internal notes
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. JOB_SKILLS TABLE (Many-to-Many relationship)
-- =====================================================
CREATE TABLE job_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    proficiency_level VARCHAR(20) DEFAULT 'intermediate', -- beginner, intermediate, advanced, expert
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE(job_id, skill_name)
);

-- =====================================================
-- 7. CANDIDATE_SKILLS TABLE (Many-to-Many relationship)
-- =====================================================
CREATE TABLE candidate_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(20) DEFAULT 'intermediate', -- beginner, intermediate, advanced, expert
    years_experience INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    UNIQUE(candidate_id, skill_name)
);

-- =====================================================
-- 8. APPLICATION_STATUS_HISTORY TABLE
-- =====================================================
CREATE TABLE application_status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(255), -- Who made the change (admin/recruiter name)
    notes TEXT,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- =====================================================
-- 9. SAVED_JOBS TABLE (Candidate bookmarks)
-- =====================================================
CREATE TABLE saved_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE(candidate_id, job_id)
);

-- =====================================================
-- 10. ADMIN_USERS TABLE (for backend management)
-- =====================================================
CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'admin', -- admin, recruiter, manager, viewer
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_posted_date ON jobs(posted_date);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);

CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_skills ON candidates(skills);
CREATE INDEX idx_candidates_location ON candidates(location);

CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at);

CREATE INDEX idx_employer_requests_status ON employer_requests(status);
CREATE INDEX idx_employer_requests_created_at ON employer_requests(created_at);

CREATE INDEX idx_job_skills_job_id ON job_skills(job_id);
CREATE INDEX idx_job_skills_skill_name ON job_skills(skill_name);

CREATE INDEX idx_candidate_skills_candidate_id ON candidate_skills(candidate_id);
CREATE INDEX idx_candidate_skills_skill_name ON candidate_skills(skill_name);