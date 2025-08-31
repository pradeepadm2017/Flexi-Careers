-- =====================================================
-- POPULATE TEST DATA for Flexi-Careers Database
-- =====================================================

-- Insert Companies
INSERT INTO companies (name, description, industry, website, logo_url, size, location, founded_year) VALUES
('TechStart Inc.', 'Innovative SaaS startup focused on productivity tools for remote teams', 'Technology', 'https://techstart.com', 'https://logo.clearbit.com/techstart.com', 'startup', 'San Francisco, CA', 2019),
('GrowthCo', 'Series B marketing technology company specializing in customer acquisition', 'Marketing Tech', 'https://growthco.io', 'https://logo.clearbit.com/growthco.io', 'medium', 'New York, NY', 2017),
('SalesForce Solutions', 'Sales enablement platform for enterprise customers', 'Sales Tech', 'https://salesforcesolutions.com', 'https://logo.clearbit.com/salesforcesolutions.com', 'large', 'San Francisco, CA', 2015),
('FinTech Innovations', 'Financial technology startup revolutionizing personal finance', 'FinTech', 'https://fintechinnovations.com', 'https://logo.clearbit.com/fintechinnovations.com', 'startup', 'Chicago, IL', 2020),
('DataDriven Corp', 'AI and machine learning solutions for enterprise clients', 'AI/ML', 'https://datadriven.com', 'https://logo.clearbit.com/datadriven.com', 'medium', 'Austin, TX', 2018),
('CloudScale Systems', 'Cloud infrastructure and DevOps solutions', 'Cloud Computing', 'https://cloudscale.io', 'https://logo.clearbit.com/cloudscale.io', 'small', 'Seattle, WA', 2019),
('ProductCraft Labs', 'Product design and user experience consulting', 'Design/UX', 'https://productcraft.design', 'https://logo.clearbit.com/productcraft.design', 'small', 'Remote', 2021),
('RetailTech Ventures', 'E-commerce and retail technology solutions', 'Retail Tech', 'https://retailtech.ventures', 'https://logo.clearbit.com/retailtech.ventures', 'medium', 'Los Angeles, CA', 2016);

-- Insert Jobs
INSERT INTO jobs (company_id, title, description, requirements, responsibilities, salary_min, salary_max, salary_type, job_type, location, is_remote, experience_level, hours_per_week, duration, skills, benefits, status, posted_date, application_deadline) VALUES
(1, 'Fractional Chief Technology Officer', 
'Lead technology strategy and development for growing SaaS startup. Oversee engineering team of 12, architecture decisions, and product roadmap. Drive digital transformation initiatives and establish scalable technology infrastructure for rapid growth.',
'10+ years of technology leadership experience. Experience scaling engineering teams (10-50 people). Strong background in SaaS architecture and cloud platforms. Track record of successful digital transformation initiatives. Experience with Series A-C stage startups.',
'Define and execute technology strategy. Lead engineering team and architecture decisions. Establish development processes and best practices. Drive product roadmap and technical innovation. Manage technology budget and vendor relationships.',
180, 220, 'hourly', 'permanent', 'San Francisco, CA', TRUE, 'executive', '20-30', 'ongoing',
'["CTO", "SaaS", "Team Leadership", "Architecture", "Cloud", "Startup", "AWS", "Docker", "Kubernetes", "Python", "JavaScript", "React"]',
'Equity participation, flexible schedule, remote work options, professional development budget',
'active', '2024-01-15', '2024-02-15'),

(2, 'Fractional Chief Marketing Officer',
'Drive marketing strategy and brand development for Series B company. 6-month engagement to launch new product line and expand market presence. Lead cross-functional teams to execute integrated marketing campaigns.',
'8+ years of senior marketing leadership experience. Proven track record in product launches and brand development. Experience with Series B-C stage companies. Strong analytical skills and data-driven approach. Experience managing marketing budgets $1M+.',
'Develop comprehensive marketing strategy. Lead product launch campaigns. Manage brand positioning and messaging. Oversee digital marketing and content strategy. Build and mentor marketing team.',
150, 180, 'hourly', 'temporary', 'New York, NY', TRUE, 'executive', '30-40', '6-12 months',
'["CMO", "Marketing Strategy", "Brand Development", "Product Launch", "Growth", "Analytics", "Google Analytics", "HubSpot", "Salesforce", "Content Marketing"]',
'Performance bonuses, flexible schedule, access to marketing tools and platforms',
'active', '2024-01-18', '2024-02-18'),

(3, 'Fractional Head of Sales',
'Build and scale sales organization from 2 to 20 people. Establish sales processes, training programs, and revenue operations. Implement CRM systems and develop scalable sales methodologies.',
'7+ years of sales leadership experience. Experience scaling sales teams from startup to growth stage. Strong background in B2B sales and enterprise accounts. Proven ability to design and implement sales processes. Experience with CRM implementation and sales operations.',
'Build and lead sales team. Develop sales processes and methodologies. Implement and optimize CRM systems. Create sales training and onboarding programs. Establish key performance metrics and reporting.',
140, 170, 'hourly', 'permanent', 'San Francisco, CA', FALSE, 'senior', '25-35', 'ongoing',
'["Sales Leadership", "Team Building", "Revenue Operations", "CRM", "B2B Sales", "Process Development", "Salesforce", "HubSpot", "Sales Training"]',
'Commission structure, equity options, professional development, travel allowance',
'active', '2024-01-20', '2024-02-20'),

(4, 'Fractional Chief Financial Officer',
'Oversee financial operations, fundraising preparation, and strategic planning for fintech startup preparing for Series A. Manage investor relations, financial modeling, and compliance requirements.',
'10+ years of finance and accounting leadership experience. Experience with Series A fundraising and investor relations. Strong background in financial modeling and valuation. Fintech or financial services industry experience required. CPA or MBA preferred.',
'Lead financial planning and analysis. Prepare for Series A fundraising. Manage investor relations and board reporting. Ensure regulatory compliance. Develop financial controls and processes.',
160, 200, 'hourly', 'permanent', 'Chicago, IL', TRUE, 'executive', '20-30', 'ongoing',
'["CFO", "Financial Planning", "Fundraising", "Strategic Planning", "FinTech", "Investor Relations", "Excel", "QuickBooks", "Financial Modeling"]',
'Equity participation, flexible schedule, remote work, professional memberships',
'active', '2024-01-22', '2024-02-22'),

(5, 'Fractional VP of Engineering',
'Scale engineering organization and establish technical architecture for AI/ML platform. Lead technical decisions, mentor senior engineers, and drive engineering excellence initiatives.',
'12+ years of engineering leadership experience. Deep expertise in AI/ML systems and data platforms. Experience with distributed systems and cloud architecture. Track record of scaling engineering teams. Strong background in Python, TensorFlow, and cloud platforms.',
'Lead engineering team and technical architecture. Establish engineering processes and best practices. Drive technical innovation and AI/ML initiatives. Mentor engineering talent and build technical culture.',
170, 200, 'hourly', 'permanent', 'Austin, TX', TRUE, 'executive', '25-35', 'ongoing',
'["VP Engineering", "AI/ML", "Python", "TensorFlow", "AWS", "Distributed Systems", "Team Leadership", "Architecture", "Data Engineering"]',
'Stock options, flexible work arrangements, conference attendance, learning budget',
'active', '2024-01-25', '2024-02-25'),

(6, 'Fractional DevOps Lead',
'Implement DevOps practices and cloud infrastructure automation. Build CI/CD pipelines, monitoring systems, and ensure scalable deployment processes.',
'5+ years of DevOps and infrastructure experience. Strong expertise in AWS/Azure, Docker, Kubernetes. Experience with CI/CD tools and infrastructure as code. Knowledge of monitoring and observability tools.',
'Design and implement CI/CD pipelines. Manage cloud infrastructure and automation. Establish monitoring and alerting systems. Optimize deployment processes and system reliability.',
120, 150, 'hourly', 'contract', 'Seattle, WA', TRUE, 'senior', '20-30', '3-6 months',
'["DevOps", "AWS", "Docker", "Kubernetes", "CI/CD", "Infrastructure", "Monitoring", "Terraform", "Jenkins", "Prometheus"]',
'Flexible schedule, remote work, technology allowance, professional development',
'active', '2024-01-28', '2024-02-28'),

(7, 'Fractional Product Manager',
'Lead product strategy and roadmap for design tool platform. Work with engineering and design teams to deliver user-centered product experiences.',
'6+ years of product management experience. Strong background in design tools or creative software. Experience with user research and data-driven product decisions. Technical background preferred.',
'Define product strategy and roadmap. Conduct user research and market analysis. Work with engineering and design teams. Manage product launches and feature rollouts.',
130, 160, 'hourly', 'temporary', 'Remote', TRUE, 'senior', '25-35', '6-12 months',
'["Product Management", "Product Strategy", "User Research", "Design Tools", "Agile", "Analytics", "Figma", "Jira", "User Experience"]',
'Performance bonuses, remote work, design software licenses, conference budget',
'active', '2024-01-30', '2024-03-01'),

(8, 'Fractional Digital Marketing Manager',
'Drive digital marketing initiatives for e-commerce platform. Manage paid advertising, SEO, content marketing, and conversion optimization.',
'4+ years of digital marketing experience in e-commerce. Proven track record with paid advertising platforms. Strong analytical skills and conversion optimization experience. Content marketing and SEO expertise.',
'Manage paid advertising campaigns. Optimize conversion rates and user acquisition. Develop content marketing strategy. Analyze performance metrics and ROI.',
90, 120, 'hourly', 'contract', 'Los Angeles, CA', TRUE, 'mid', '20-30', '6-12 months',
'["Digital Marketing", "PPC", "SEO", "Content Marketing", "Google Ads", "Facebook Ads", "Analytics", "Conversion Optimization", "E-commerce"]',
'Performance bonuses, marketing tool access, flexible schedule, remote work',
'active', '2024-02-01', '2024-03-01');

-- Insert Candidates
INSERT INTO candidates (first_name, last_name, email, phone, location, linkedin_url, portfolio_url, years_experience, current_title, bio, skills, availability, hourly_rate_min, hourly_rate_max, preferred_job_type, is_remote_only, profile_status) VALUES
('Sarah', 'Johnson', 'sarah.johnson@email.com', '+1-555-0101', 'San Francisco, CA', 'https://linkedin.com/in/sarahjohnson', 'https://sarahjohnson.dev', 12, 'Senior Engineering Manager', 
'Experienced technology leader with 12+ years building scalable systems and leading high-performing engineering teams. Passionate about mentoring developers and driving technical excellence.',
'["JavaScript", "Python", "React", "Node.js", "AWS", "Docker", "Kubernetes", "Team Leadership", "System Architecture", "DevOps"]',
'2-weeks', 160, 200, 'both', FALSE, 'active'),

('Michael', 'Chen', 'michael.chen@email.com', '+1-555-0102', 'New York, NY', 'https://linkedin.com/in/michaelchen', 'https://michaelchen.design', 8, 'Senior Product Manager', 
'Product leader focused on user-centered design and data-driven decision making. Experience launching products that serve millions of users.',
'["Product Management", "User Research", "Analytics", "Agile", "Product Strategy", "A/B Testing", "Figma", "SQL", "Python"]',
'immediate', 140, 180, 'permanent', FALSE, 'active'),

('Emily', 'Rodriguez', 'emily.rodriguez@email.com', '+1-555-0103', 'Chicago, IL', 'https://linkedin.com/in/emilyrodriguez', 'https://emilyrodriguez.marketing', 10, 'Marketing Director', 
'Growth-focused marketing executive with expertise in B2B SaaS and fintech. Track record of scaling marketing teams and driving 300% revenue growth.',
'["Marketing Strategy", "Growth Hacking", "B2B Marketing", "Content Marketing", "SEO", "PPC", "Marketing Automation", "Analytics", "Team Leadership"]',
'1-month', 120, 160, 'both', TRUE, 'active'),

('David', 'Thompson', 'david.thompson@email.com', '+1-555-0104', 'Austin, TX', 'https://linkedin.com/in/davidthompson', 'https://davidthompson.dev', 15, 'CTO', 
'Seasoned technology executive with experience building and scaling engineering organizations from 5 to 100+ people. Expert in cloud architecture and AI/ML systems.',
'["CTO", "Engineering Leadership", "AI/ML", "Cloud Architecture", "Python", "TensorFlow", "AWS", "Distributed Systems", "Team Scaling", "Strategic Planning"]',
'negotiable', 180, 250, 'permanent', FALSE, 'active'),

('Jessica', 'Kim', 'jessica.kim@email.com', '+1-555-0105', 'Seattle, WA', 'https://linkedin.com/in/jessicakim', 'https://jessicakim.design', 6, 'Senior UX Designer', 
'User experience designer passionate about creating intuitive and accessible digital experiences. Experience with design systems and user research.',
'["UX Design", "UI Design", "User Research", "Design Systems", "Figma", "Sketch", "Prototyping", "Usability Testing", "Accessibility"]',
'immediate', 100, 140, 'both', TRUE, 'active'),

('Robert', 'Williams', 'robert.williams@email.com', '+1-555-0106', 'Boston, MA', 'https://linkedin.com/in/robertwilliams', NULL, 20, 'CFO', 
'Finance executive with 20+ years of experience in fundraising, financial planning, and strategic operations. Previously CFO at 3 successful exits.',
'["CFO", "Financial Planning", "Fundraising", "Strategic Planning", "Financial Modeling", "Investor Relations", "M&A", "IPO Experience", "Team Leadership"]',
'negotiable', 150, 200, 'permanent', FALSE, 'active'),

('Amanda', 'Davis', 'amanda.davis@email.com', '+1-555-0107', 'Remote', 'https://linkedin.com/in/amandadavis', 'https://amandadavis.sales', 9, 'VP of Sales', 
'Sales leader with expertise in B2B SaaS and enterprise sales. Built sales organizations from ground up and consistently exceeded revenue targets.',
'["Sales Leadership", "B2B Sales", "Enterprise Sales", "Sales Process", "CRM", "Team Building", "Revenue Operations", "SaaS Sales", "Negotiation"]',
'immediate', 130, 170, 'both', TRUE, 'active'),

('James', 'Miller', 'james.miller@email.com', '+1-555-0108', 'Denver, CO', 'https://linkedin.com/in/jamesmiller', 'https://jamesmiller.dev', 7, 'DevOps Engineer', 
'DevOps engineer specializing in cloud infrastructure, automation, and CI/CD pipelines. Experience with large-scale distributed systems.',
'["DevOps", "AWS", "Docker", "Kubernetes", "CI/CD", "Infrastructure as Code", "Terraform", "Jenkins", "Monitoring", "Python"]',
'2-weeks', 110, 150, 'both', TRUE, 'active');

-- Insert Applications
INSERT INTO applications (job_id, candidate_id, cover_letter, resume_filename, resume_file_path, resume_file_size, status, applied_at, reviewed_at, notes, rating) VALUES
(1, 1, 'I am excited about the CTO opportunity at TechStart Inc. With 12+ years of engineering leadership experience, I have successfully scaled teams and built robust SaaS architectures. My experience aligns perfectly with your needs for technical leadership and startup growth.', 'sarah_johnson_resume.pdf', '/uploads/resumes/sarah_johnson_resume.pdf', 245760, 'shortlisted', '2024-01-16 10:30:00', '2024-01-18 14:20:00', 'Strong technical background and leadership experience. Great fit for our CTO needs.', 5),

(1, 4, 'As an experienced CTO with 15+ years in technology leadership, I am passionate about helping TechStart Inc scale its engineering organization. I have successfully led digital transformations and built high-performing teams across multiple startups.', 'david_thompson_resume.pdf', '/uploads/resumes/david_thompson_resume.pdf', 287340, 'interviewing', '2024-01-17 09:15:00', '2024-01-19 11:45:00', 'Excellent CTO experience. Currently in interview process. Very impressed with technical depth.', 5),

(2, 3, 'I am thrilled to apply for the CMO position at GrowthCo. With 10 years of marketing leadership in B2B SaaS and fintech, I have driven significant revenue growth and led successful product launches. I am confident I can help expand your market presence.', 'emily_rodriguez_resume.pdf', '/uploads/resumes/emily_rodriguez_resume.pdf', 198450, 'reviewed', '2024-01-19 16:45:00', '2024-01-22 10:30:00', 'Strong marketing background, particularly in B2B. Good candidate for CMO role.', 4),

(3, 7, 'The Head of Sales role at SalesForce Solutions perfectly matches my experience building sales organizations from the ground up. I have successfully scaled sales teams and implemented processes that drove consistent revenue growth in B2B SaaS environments.', 'amanda_davis_resume.pdf', '/uploads/resumes/amanda_davis_resume.pdf', 210890, 'shortlisted', '2024-01-21 14:20:00', '2024-01-23 09:15:00', 'Great sales leadership experience. Strong track record in B2B SaaS. Moving to next round.', 4),

(4, 6, 'I am interested in the CFO position at FinTech Innovations. With 20 years of finance leadership and extensive experience in fundraising and strategic planning, I can help prepare your company for Series A and establish strong financial foundations.', 'robert_williams_resume.pdf', '/uploads/resumes/robert_williams_resume.pdf', 232110, 'interviewing', '2024-01-23 11:30:00', '2024-01-25 15:20:00', 'Exceptional financial leadership experience. Perfect for our Series A preparation needs.', 5),

(6, 8, 'The DevOps Lead position at CloudScale Systems aligns perfectly with my expertise in cloud infrastructure and automation. I have extensive experience with AWS, Docker, and Kubernetes, and I am passionate about building scalable deployment processes.', 'james_miller_resume.pdf', '/uploads/resumes/james_miller_resume.pdf', 189670, 'reviewed', '2024-01-29 13:45:00', '2024-01-31 16:30:00', 'Strong DevOps background. Good technical skills for our infrastructure needs.', 4),

(7, 2, 'I am excited about the Product Manager opportunity at ProductCraft Labs. My 8 years of product management experience, combined with my background in design tools and user-centered approach, make me an ideal fit for leading your product strategy.', 'michael_chen_resume.pdf', '/uploads/resumes/michael_chen_resume.pdf', 156780, 'submitted', '2024-02-01 10:15:00', NULL, NULL, NULL),

(8, 3, 'The Digital Marketing Manager role at RetailTech Ventures presents an exciting opportunity to apply my e-commerce and digital marketing expertise. I have a proven track record in paid advertising, SEO, and conversion optimization that can drive your growth initiatives.', 'emily_rodriguez_resume_v2.pdf', '/uploads/resumes/emily_rodriguez_resume_v2.pdf', 201450, 'submitted', '2024-02-02 14:30:00', NULL, NULL, NULL);

-- Insert Employer Requests (from contact form)
INSERT INTO employer_requests (company_name, contact_name, email, phone, role_type, time_commitment, timeline, requirements, budget_range, status, priority, notes) VALUES
('InnovateLab', 'Jennifer Walsh', 'jennifer@innovatelab.com', '+1-555-0201', 'technology', '20-30', '1-2weeks', 'Looking for a fractional CTO to help with technical strategy and team leadership. We are a Series A startup with 25 employees building AI-powered analytics tools. Need someone with experience in machine learning and cloud architecture.', '150-200', 'new', 'high', 'Urgent CTO need for Series A startup'),

('MarketingPro Solutions', 'Tom Anderson', 'tom@marketingpro.com', '+1-555-0202', 'marketing', '30-40', 'immediate', 'Need a fractional CMO to lead our marketing team and drive customer acquisition. B2B SaaS company looking to scale from $1M to $5M ARR. Experience with enterprise sales cycles required.', '100-150', 'contacted', 'high', 'Called on 2024-01-20. Interested in immediate start.'),

('GreenTech Ventures', 'Lisa Parker', 'lisa@greentech.ventures', '+1-555-0203', 'strategy', '10-20', '1month', 'Seeking strategic advisor for sustainability technology company. Need help with business model validation, market entry strategy, and partnership development in the clean energy sector.', '100-150', 'in_progress', 'medium', 'Working on candidate matching. Client interested in industry expertise.'),

('HealthTech Innovations', 'Mark Johnson', 'mark@healthtech.com', '+1-555-0204', 'executive', '20-30', 'flexible', 'Healthcare startup looking for fractional COO to establish operations and scale the team. Experience in regulated industries and healthcare compliance required. Remote work acceptable.', '150-200', 'new', 'medium', 'Healthcare compliance experience required'),

('EduTech Platform', 'Rachel Green', 'rachel@edutech.platform', '+1-555-0205', 'technology', 'project', '2-4weeks', 'Need technical architect for 6-month project to rebuild our learning management system. Looking for expertise in microservices, API design, and scalable architecture for educational technology.', 'project', 'matched', 'low', 'Successfully matched with senior architect. Project starting soon.');

-- Insert Job Skills
INSERT INTO job_skills (job_id, skill_name, is_required, proficiency_level) VALUES
-- Job 1: CTO
(1, 'Team Leadership', TRUE, 'expert'),
(1, 'System Architecture', TRUE, 'expert'),
(1, 'AWS', TRUE, 'advanced'),
(1, 'Python', FALSE, 'advanced'),
(1, 'JavaScript', FALSE, 'intermediate'),
(1, 'Docker', TRUE, 'advanced'),
(1, 'Kubernetes', TRUE, 'advanced'),
(1, 'React', FALSE, 'intermediate'),

-- Job 2: CMO
(2, 'Marketing Strategy', TRUE, 'expert'),
(2, 'Brand Development', TRUE, 'expert'),
(2, 'Google Analytics', TRUE, 'advanced'),
(2, 'HubSpot', TRUE, 'advanced'),
(2, 'Content Marketing', TRUE, 'advanced'),
(2, 'Salesforce', FALSE, 'intermediate'),

-- Job 3: Head of Sales
(3, 'Sales Leadership', TRUE, 'expert'),
(3, 'B2B Sales', TRUE, 'expert'),
(3, 'CRM', TRUE, 'advanced'),
(3, 'Salesforce', TRUE, 'advanced'),
(3, 'Sales Training', TRUE, 'advanced'),
(3, 'Revenue Operations', TRUE, 'advanced'),

-- Job 4: CFO
(4, 'Financial Planning', TRUE, 'expert'),
(4, 'Fundraising', TRUE, 'expert'),
(4, 'Financial Modeling', TRUE, 'expert'),
(4, 'Excel', TRUE, 'advanced'),
(4, 'QuickBooks', TRUE, 'intermediate'),
(4, 'Investor Relations', TRUE, 'advanced');

-- Insert Candidate Skills
INSERT INTO candidate_skills (candidate_id, skill_name, proficiency_level, years_experience) VALUES
-- Sarah Johnson (Candidate 1)
(1, 'JavaScript', 'expert', 10),
(1, 'Python', 'expert', 8),
(1, 'React', 'advanced', 6),
(1, 'Node.js', 'advanced', 7),
(1, 'AWS', 'expert', 8),
(1, 'Docker', 'advanced', 5),
(1, 'Kubernetes', 'advanced', 4),
(1, 'Team Leadership', 'expert', 6),
(1, 'System Architecture', 'expert', 8),

-- Michael Chen (Candidate 2)
(2, 'Product Management', 'expert', 8),
(2, 'User Research', 'advanced', 6),
(2, 'Analytics', 'expert', 7),
(2, 'Agile', 'expert', 8),
(2, 'Product Strategy', 'expert', 5),
(2, 'Figma', 'advanced', 4),
(2, 'SQL', 'intermediate', 3),

-- Emily Rodriguez (Candidate 3)
(3, 'Marketing Strategy', 'expert', 10),
(3, 'Growth Hacking', 'expert', 6),
(3, 'B2B Marketing', 'expert', 8),
(3, 'Content Marketing', 'advanced', 7),
(3, 'SEO', 'advanced', 5),
(3, 'PPC', 'advanced', 6),
(3, 'Marketing Automation', 'advanced', 4),
(3, 'Team Leadership', 'advanced', 5);

-- Insert Application Status History
INSERT INTO application_status_history (application_id, old_status, new_status, changed_by, notes, changed_at) VALUES
(1, 'submitted', 'reviewed', 'John Smith', 'Initial review completed. Strong candidate.', '2024-01-18 14:20:00'),
(1, 'reviewed', 'shortlisted', 'John Smith', 'Moving to shortlist for technical interview.', '2024-01-20 10:15:00'),
(2, 'submitted', 'reviewed', 'John Smith', 'Excellent CTO background. Scheduling interview.', '2024-01-19 11:45:00'),
(2, 'reviewed', 'interviewing', 'Sarah Wilson', 'First interview scheduled for 2024-01-22.', '2024-01-21 09:30:00'),
(3, 'submitted', 'reviewed', 'Mike Davis', 'Good marketing background for CMO role.', '2024-01-22 10:30:00'),
(4, 'submitted', 'reviewed', 'Lisa Martinez', 'Strong sales leadership experience.', '2024-01-23 09:15:00'),
(4, 'reviewed', 'shortlisted', 'Lisa Martinez', 'Moving to shortlist for sales director interview.', '2024-01-25 14:45:00');

-- Insert Saved Jobs (candidate bookmarks)
INSERT INTO saved_jobs (candidate_id, job_id, saved_at) VALUES
(1, 2, '2024-01-16 12:30:00'),
(1, 5, '2024-01-18 15:45:00'),
(2, 1, '2024-01-19 09:20:00'),
(2, 7, '2024-02-01 10:15:00'),
(3, 2, '2024-01-17 14:30:00'),
(3, 8, '2024-02-02 14:30:00'),
(4, 1, '2024-01-16 16:45:00'),
(4, 5, '2024-01-25 11:20:00'),
(5, 7, '2024-01-28 10:30:00'),
(6, 4, '2024-01-22 13:15:00'),
(7, 3, '2024-01-20 16:20:00'),
(8, 6, '2024-01-28 12:45:00');

-- Insert Admin Users
INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role, is_active, last_login) VALUES
('admin', 'admin@flexi-careers.com', '$2b$12$LQv3c1yqBwuKh4UMjrjxVu4/FUQk2lUwY8YDHSv2gPgVn8h7DdqjO', 'System', 'Administrator', 'admin', TRUE, '2024-02-01 08:30:00'),
('recruiter1', 'john.smith@flexi-careers.com', '$2b$12$GFQk3lUwY8YDHSv2gPgVn8h7DdqjOLQv3c1yqBwuKh4UMjrjxVu4', 'John', 'Smith', 'recruiter', TRUE, '2024-02-01 09:15:00'),
('recruiter2', 'sarah.wilson@flexi-careers.com', '$2b$12$YDHSv2gPgVn8h7DdqjOLQv3c1yqBwuKh4UMjrjxVu4FUQk3lUwY8', 'Sarah', 'Wilson', 'recruiter', TRUE, '2024-02-01 10:45:00'),
('manager1', 'mike.davis@flexi-careers.com', '$2b$12$wuKh4UMjrjxVu4FUQk3lUwY8YDHSv2gPgVn8h7DdqjOLQv3c1yqB', 'Mike', 'Davis', 'manager', TRUE, '2024-01-31 16:20:00');