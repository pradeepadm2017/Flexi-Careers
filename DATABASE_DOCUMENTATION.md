# Flexi-Careers Simplified Database Documentation

## Overview
The Flexi-Careers database is designed to support a simplified fractional employment platform where candidates apply as guests without creating accounts. Companies and jobs are admin-managed, and the focus is on collecting applications from interested candidates. The database uses SQLite for simplicity and portability.

## Database Structure

### 📊 Core Statistics
- **Tables**: 8 main tables + 1 SQLite system table
- **Total Records**: 96 test records
- **Database Size**: 156 KB
- **Indexes**: 18 performance indexes
- **File**: `flexi_careers.db`

### 🎯 Key Design Decisions
- **No User Accounts**: Candidates apply as guests, providing their info each time
- **Admin-Only Job Management**: Only admins can post/manage jobs, not employers
- **Contact Form for Employers**: Employers submit requests through a contact form
- **Guest Applications**: All candidate information stored directly in applications table

---

## 🏢 Table Structures & Relationships

### 1. COMPANIES Table
**Purpose**: Store company information for employers posting jobs

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique company identifier |
| `name` | VARCHAR(255) | NOT NULL | Company name |
| `description` | TEXT | | Company description |
| `industry` | VARCHAR(100) | | Industry sector |
| `website` | VARCHAR(255) | | Company website URL |
| `logo_url` | VARCHAR(500) | | Company logo image URL |
| `size` | VARCHAR(50) | | Company size (startup, small, medium, large, enterprise) |
| `location` | VARCHAR(255) | | Company headquarters location |
| `founded_year` | INTEGER | | Year company was founded |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record last update timestamp |

**Test Data**: 8 companies (TechStart Inc., GrowthCo, SalesForce Solutions, etc.)

---

### 2. JOBS Table
**Purpose**: Store job postings and fractional opportunities

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique job identifier |
| `company_id` | INTEGER | NOT NULL, FOREIGN KEY → companies.id | Associated company |
| `title` | VARCHAR(255) | NOT NULL | Job title |
| `description` | TEXT | NOT NULL | Detailed job description |
| `requirements` | TEXT | | Job requirements and qualifications |
| `responsibilities` | TEXT | | Key responsibilities |
| `salary_min` | INTEGER | | Minimum salary/rate |
| `salary_max` | INTEGER | | Maximum salary/rate |
| `salary_currency` | VARCHAR(3) | DEFAULT 'USD' | Currency code |
| `salary_type` | VARCHAR(20) | DEFAULT 'hourly' | Payment type (hourly, monthly, yearly, project) |
| `job_type` | VARCHAR(50) | NOT NULL | Employment type (permanent, temporary, contract) |
| `location` | VARCHAR(255) | | Job location |
| `is_remote` | BOOLEAN | DEFAULT FALSE | Remote work availability |
| `experience_level` | VARCHAR(50) | | Required experience level |
| `hours_per_week` | VARCHAR(50) | | Expected time commitment |
| `duration` | VARCHAR(100) | | Project/engagement duration |
| `skills` | TEXT | | Skills as JSON array |
| `benefits` | TEXT | | Job benefits and perks |
| `status` | VARCHAR(20) | DEFAULT 'active' | Job status (active, paused, closed, draft) |
| `posted_date` | DATE | DEFAULT CURRENT_DATE | Date job was posted |
| `application_deadline` | DATE | | Application closing date |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record last update timestamp |

**Indexes**: company_id, status, posted_date, location, job_type
**Test Data**: 8 jobs (CTO, CMO, Head of Sales, CFO, etc.)

---

### 3. CANDIDATES Table  
**Purpose**: Store candidate profiles and professional information

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique candidate identifier |
| `first_name` | VARCHAR(100) | NOT NULL | Candidate first name |
| `last_name` | VARCHAR(100) | NOT NULL | Candidate last name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email address |
| `phone` | VARCHAR(20) | | Phone number |
| `location` | VARCHAR(255) | | Current location |
| `linkedin_url` | VARCHAR(500) | | LinkedIn profile URL |
| `portfolio_url` | VARCHAR(500) | | Portfolio/website URL |
| `years_experience` | INTEGER | | Total years of experience |
| `current_title` | VARCHAR(255) | | Current job title |
| `bio` | TEXT | | Professional biography |
| `skills` | TEXT | | Skills as JSON array |
| `availability` | VARCHAR(50) | | Availability timeline |
| `hourly_rate_min` | INTEGER | | Minimum hourly rate |
| `hourly_rate_max` | INTEGER | | Maximum hourly rate |
| `preferred_job_type` | VARCHAR(50) | | Job type preference |
| `is_remote_only` | BOOLEAN | DEFAULT FALSE | Remote work requirement |
| `profile_status` | VARCHAR(20) | DEFAULT 'active' | Profile status |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record last update timestamp |

**Indexes**: email, skills, location
**Test Data**: 8 candidates (Sarah Johnson, Michael Chen, Emily Rodriguez, etc.)

---

### 4. APPLICATIONS Table
**Purpose**: Track job applications and their status

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique application identifier |
| `job_id` | INTEGER | NOT NULL, FOREIGN KEY → jobs.id | Applied job |
| `candidate_id` | INTEGER | NOT NULL, FOREIGN KEY → candidates.id | Applying candidate |
| `cover_letter` | TEXT | | Cover letter content |
| `resume_filename` | VARCHAR(255) | | Uploaded resume filename |
| `resume_file_path` | VARCHAR(500) | | Server file path for resume |
| `resume_file_size` | INTEGER | | Resume file size in bytes |
| `status` | VARCHAR(50) | DEFAULT 'submitted' | Application status |
| `applied_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Application submission time |
| `reviewed_at` | DATETIME | | Review completion time |
| `notes` | TEXT | | Internal recruiter notes |
| `rating` | INTEGER | CHECK (1-5) | Application rating |
| `interview_scheduled_at` | DATETIME | | Interview scheduling time |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record last update timestamp |

**Unique Constraint**: job_id + candidate_id (prevents duplicate applications)
**Indexes**: job_id, candidate_id, status, applied_at
**Test Data**: 8 applications across various status stages

**Status Values**: 
- `submitted` → `reviewed` → `interviewing` → `shortlisted` → `hired`/`rejected`

---

### 5. EMPLOYER_REQUESTS Table
**Purpose**: Store employer inquiries from the contact form

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique request identifier |
| `company_name` | VARCHAR(255) | NOT NULL | Company name |
| `contact_name` | VARCHAR(255) | NOT NULL | Contact person name |
| `email` | VARCHAR(255) | NOT NULL | Contact email |
| `phone` | VARCHAR(20) | | Contact phone |
| `role_type` | VARCHAR(100) | NOT NULL | Type of role needed |
| `time_commitment` | VARCHAR(50) | | Time commitment required |
| `timeline` | VARCHAR(50) | | Start timeline |
| `requirements` | TEXT | NOT NULL | Detailed requirements |
| `budget_range` | VARCHAR(50) | | Budget range |
| `status` | VARCHAR(50) | DEFAULT 'new' | Request status |
| `priority` | VARCHAR(20) | DEFAULT 'medium' | Request priority |
| `assigned_to` | VARCHAR(255) | | Staff member assigned |
| `notes` | TEXT | | Internal notes |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record last update timestamp |

**Indexes**: status, created_at
**Test Data**: 5 employer requests with various statuses

---

### 6. JOB_SKILLS Table
**Purpose**: Many-to-many relationship between jobs and required skills

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique relationship identifier |
| `job_id` | INTEGER | NOT NULL, FOREIGN KEY → jobs.id | Associated job |
| `skill_name` | VARCHAR(100) | NOT NULL | Skill name |
| `is_required` | BOOLEAN | DEFAULT TRUE | Whether skill is required |
| `proficiency_level` | VARCHAR(20) | DEFAULT 'intermediate' | Required proficiency level |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Unique Constraint**: job_id + skill_name
**Indexes**: job_id, skill_name
**Test Data**: 26 job-skill relationships

---

### 7. CANDIDATE_SKILLS Table
**Purpose**: Many-to-many relationship between candidates and their skills

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique relationship identifier |
| `candidate_id` | INTEGER | NOT NULL, FOREIGN KEY → candidates.id | Associated candidate |
| `skill_name` | VARCHAR(100) | NOT NULL | Skill name |
| `proficiency_level` | VARCHAR(20) | DEFAULT 'intermediate' | Proficiency level |
| `years_experience` | INTEGER | DEFAULT 0 | Years of experience with skill |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Unique Constraint**: candidate_id + skill_name
**Indexes**: candidate_id, skill_name
**Test Data**: 24 candidate-skill relationships

---

### 8. APPLICATION_STATUS_HISTORY Table
**Purpose**: Track status changes for applications (audit trail)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique history identifier |
| `application_id` | INTEGER | NOT NULL, FOREIGN KEY → applications.id | Associated application |
| `old_status` | VARCHAR(50) | | Previous status |
| `new_status` | VARCHAR(50) | NOT NULL | New status |
| `changed_by` | VARCHAR(255) | | Who made the change |
| `notes` | TEXT | | Change notes |
| `changed_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Change timestamp |

**Test Data**: 7 status change records

---

### 9. SAVED_JOBS Table
**Purpose**: Candidate bookmarks/saved jobs

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique save identifier |
| `candidate_id` | INTEGER | NOT NULL, FOREIGN KEY → candidates.id | Candidate who saved |
| `job_id` | INTEGER | NOT NULL, FOREIGN KEY → jobs.id | Saved job |
| `saved_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Save timestamp |

**Unique Constraint**: candidate_id + job_id
**Test Data**: 12 saved job records

---

### 10. ADMIN_USERS Table
**Purpose**: Backend system administration users

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique user identifier |
| `username` | VARCHAR(100) | UNIQUE, NOT NULL | Login username |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed password |
| `first_name` | VARCHAR(100) | | First name |
| `last_name` | VARCHAR(100) | | Last name |
| `role` | VARCHAR(50) | DEFAULT 'admin' | User role |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account status |
| `last_login` | DATETIME | | Last login timestamp |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update |

**Test Data**: 4 admin users (admin, recruiter1, recruiter2, manager1)

---

## 🔗 Relationships Diagram

```
COMPANIES (1) ──→ (M) JOBS (M) ←── (1) APPLICATIONS (M) ──→ (1) CANDIDATES
                      ↓                      ↓                         ↓
                 JOB_SKILLS           APP_STATUS_HISTORY      CANDIDATE_SKILLS
                                                                      ↓
                                            SAVED_JOBS (M) ←── (1) CANDIDATES

EMPLOYER_REQUESTS (standalone)
ADMIN_USERS (standalone)
```

### Key Relationships:
1. **Companies → Jobs**: One company can have multiple job postings
2. **Jobs → Applications**: One job can have multiple applications  
3. **Candidates → Applications**: One candidate can have multiple applications
4. **Jobs ↔ Skills**: Many-to-many via JOB_SKILLS table
5. **Candidates ↔ Skills**: Many-to-many via CANDIDATE_SKILLS table
6. **Candidates ↔ Jobs**: Many-to-many via SAVED_JOBS table
7. **Applications → History**: One application can have multiple status changes

---

## 📈 Performance Indexes

### Primary Indexes (18 total):
- **Jobs**: company_id, status, posted_date, location, job_type
- **Candidates**: email, skills, location  
- **Applications**: job_id, candidate_id, status, applied_at
- **Employer Requests**: status, created_at
- **Job Skills**: job_id, skill_name
- **Candidate Skills**: candidate_id, skill_name

---

## 🧪 Test Data Summary

| Table | Records | Description |
|-------|---------|-------------|
| **Companies** | 8 | Tech startups to enterprises across various industries |
| **Jobs** | 8 | C-level and senior fractional positions |
| **Candidates** | 8 | Experienced professionals with diverse skill sets |
| **Applications** | 8 | Various application statuses (submitted to interviewing) |
| **Employer Requests** | 5 | Contact form submissions in different stages |
| **Job Skills** | 26 | Technical and leadership skills mapped to jobs |
| **Candidate Skills** | 24 | Professional skills with experience levels |
| **Status History** | 7 | Application status change audit trail |
| **Saved Jobs** | 12 | Candidate bookmarks across multiple jobs |
| **Admin Users** | 4 | System administrators and recruiters |

---

## 🔧 Usage Examples

### Most Popular Jobs Query:
```sql
SELECT j.title, c.name, COUNT(a.id) as application_count
FROM jobs j
JOIN companies c ON j.company_id = c.id  
LEFT JOIN applications a ON j.id = a.job_id
GROUP BY j.id
ORDER BY application_count DESC;
```

### Candidate Skill Matching Query:
```sql
SELECT DISTINCT c.first_name, c.last_name, c.email
FROM candidates c
JOIN candidate_skills cs ON c.id = cs.candidate_id
WHERE cs.skill_name IN ('Python', 'JavaScript', 'Team Leadership')
GROUP BY c.id
HAVING COUNT(DISTINCT cs.skill_name) = 3;
```

### Application Pipeline Analysis:
```sql
SELECT status, COUNT(*) as count,
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM applications  
GROUP BY status
ORDER BY count DESC;
```

---

## 🚀 Ready for Backend Integration

The database is fully prepared for backend development with:
- ✅ **Comprehensive schema** covering all business requirements
- ✅ **Rich test data** for development and testing
- ✅ **Performance indexes** for fast queries
- ✅ **Referential integrity** with foreign key constraints
- ✅ **Audit trails** for application status tracking
- ✅ **Flexible skill matching** system
- ✅ **Admin user management** for backend operations

**Database File**: `flexi_careers.db` (176 KB)
**Total Records**: 88 across all tables
**Ready for**: Python Flask/Django, Node.js, or any backend framework