// Backend Integration for Flexi-Careers Frontend
// API Configuration
const API_BASE_URL = 'https://flexi-careers.onrender.com/api';

// Global variables
let featuredJobs = [];
let allJobs = [];
let companies = [];
let platformStats = {};

// API Functions
async function fetchJobs(filters = {}) {
    try {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params.append(key, filters[key]);
            }
        });
        
        const response = await fetch(`${API_BASE_URL}/jobs?${params}`);
        const data = await response.json();
        
        if (data.success) {
            return data.jobs;
        } else {
            throw new Error(data.error || 'Failed to fetch jobs');
        }
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
}

async function fetchJobDetails(jobId) {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
        const data = await response.json();
        
        if (data.success) {
            return data.job;
        } else {
            throw new Error(data.error || 'Failed to fetch job details');
        }
    } catch (error) {
        console.error('Error fetching job details:', error);
        return null;
    }
}

async function submitApplication(jobId, formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
            method: 'POST',
            body: formData  // FormData automatically sets correct Content-Type
        });
        
        const data = await response.json();
        
        if (data.success) {
            return data;
        } else {
            throw new Error(data.error || 'Failed to submit application');
        }
    } catch (error) {
        console.error('Error submitting application:', error);
        throw error;
    }
}

async function submitEmployerRequest(requestData) {
    try {
        const response = await fetch(`${API_BASE_URL}/employer-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            return data;
        } else {
            throw new Error(data.error || 'Failed to submit request');
        }
    } catch (error) {
        console.error('Error submitting employer request:', error);
        throw error;
    }
}

async function fetchPlatformStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        const data = await response.json();
        
        if (data.success) {
            return data.stats;
        } else {
            throw new Error(data.error || 'Failed to fetch stats');
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
        return {};
    }
}

// Enhanced Mobile menu functionality
document.addEventListener('DOMContentLoaded', async function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // If it's an external link or page, don't prevent default
            if (targetId.includes('.html') || !targetId.startsWith('#')) {
                return; // Allow normal navigation
            }
            
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'var(--background-white)';
            header.style.backdropFilter = 'none';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe job cards, benefit cards, and steps
    const animatedElements = document.querySelectorAll('.job-card, .benefit-card, .step');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.querySelector(`[data-tab="${targetTab}"].tab-content`).classList.add('active');
        });
    });

    // Load platform data
    await loadInitialData();

    // Enhanced employer contact form
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(this);
                // Handle role type - use "other" field if "other" is selected
                const roleType = formData.get('role-type');
                const otherRole = formData.get('other-role');
                const finalRoleType = roleType === 'other' ? otherRole : roleType;
                
                // Handle budget range - combine min and max into a range string
                const budgetMin = formData.get('budget-min');
                const budgetMax = formData.get('budget-max');
                let budgetRange = '';
                
                if (budgetMin && budgetMax) {
                    budgetRange = `$${budgetMin}-${budgetMax}`;
                } else if (budgetMin === '120+') {
                    budgetRange = '$120+';
                } else if (budgetMin) {
                    budgetRange = `$${budgetMin}+`;
                } else if (budgetMax) {
                    budgetRange = `Up to $${budgetMax}`;
                }
                
                const requestData = {
                    company_name: formData.get('company'),
                    contact_name: formData.get('contact-name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    role_type: finalRoleType,
                    role_title: formData.get('role-title'),
                    time_commitment: formData.get('commitment'),
                    timeline: formData.get('timeline'),
                    requirements: formData.get('requirements'),
                    budget_range: budgetRange
                };
                
                console.log('Submitting employer request with data:', requestData);
                const result = await submitEmployerRequest(requestData);
                
                // Show success message
                showNotification('Thank you for your request! We will contact you within 24 hours to discuss your fractional talent needs.', 'success');
                
                // Reset form
                this.reset();
                
            } catch (error) {
                showNotification('There was an error submitting your request. Please try again.', 'error');
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Add event listeners to View Details buttons using event delegation
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('view-details-btn')) {
            e.preventDefault();
            const jobId = parseInt(e.target.getAttribute('data-job-id'));
            window.openJobModal(jobId);
        }
    });

    // Modal functionality
    const modal = document.getElementById('jobModal');
    const modalClose = document.querySelector('.modal-close');

    // Close modal when clicking X
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Application form handling
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            try {
                // Get form data
                const formData = new FormData(this);
                const jobId = parseInt(document.getElementById('applicationJobId').value);
                
                // Validate jobId
                if (!jobId || isNaN(jobId)) {
                    throw new Error('Invalid job ID');
                }
                
                const result = await submitApplication(jobId, formData);
                
                const firstName = formData.get('firstName');
                const lastName = formData.get('lastName');
                const jobTitle = document.getElementById('applicationJobTitleSummary').textContent;
                const company = document.getElementById('applicationJobCompany').textContent;
                
                // Close modal
                window.closeApplicationModal();
                
                // Show success message
                showNotification(`Thank you ${firstName} ${lastName}! Your application for the ${jobTitle} position at ${company} has been submitted successfully. We will review your application and get back to you within 2-3 business days.`, 'success');
                
            } catch (error) {
                showNotification('There was an error submitting your application. Please try again.', 'error');
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }
    
    // Scroll to top functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Enhanced form validation
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
});

// Load initial data from backend
async function loadInitialData() {
    try {
        // Load jobs and platform stats
        const [jobsData, statsData] = await Promise.all([
            fetchJobs(),
            fetchPlatformStats()
        ]);
        
        featuredJobs = jobsData.slice(0, 4); // First 4 jobs for featured section
        allJobs = jobsData;
        platformStats = statsData;
        
        // Render featured jobs on homepage
        renderFeaturedJobs();
        
        // Update stats if on homepage
        updatePlatformStats();
        
    } catch (error) {
        console.error('Error loading initial data:', error);
        // Fallback to show message or use static data
        showNotification('Some features may be limited due to connection issues.', 'warning');
    }
}

// Render featured jobs
function renderFeaturedJobs() {
    const featuredJobsContainer = document.getElementById('featured-jobs');
    if (!featuredJobsContainer || featuredJobs.length === 0) return;
    
    featuredJobsContainer.innerHTML = '';
    
    featuredJobs.forEach(job => {
        const jobCard = createFeaturedJobCard(job);
        featuredJobsContainer.appendChild(jobCard);
    });
}

// Create featured job card HTML
function createFeaturedJobCard(job) {
    const jobCard = document.createElement('div');
    jobCard.className = 'featured-job-card';
    
    // Format salary
    const salaryText = job.salary_min && job.salary_max 
        ? `$${job.salary_min}-${job.salary_max}/${job.salary_type}`
        : 'Competitive';
    
    // Format location
    const locationText = job.is_remote 
        ? (job.location ? `${job.location} / Remote` : 'Remote')
        : (job.location || 'Location TBD');
        
    // Format posted date
    const postedDate = new Date(job.posted_date);
    const now = new Date();
    const daysDiff = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24));
    const postedText = daysDiff === 0 ? 'Today' : 
                      daysDiff === 1 ? '1 day ago' : 
                      `${daysDiff} days ago`;
    
    jobCard.innerHTML = `
        <h3 class="featured-job-title">${job.title}</h3>
        <div class="featured-job-company">${job.company_name}</div>
        
        <div class="featured-job-meta">
            <div class="featured-job-meta-item">
                <span class="icon">📍</span>
                <span>${locationText}</span>
            </div>
            <div class="featured-job-meta-item">
                <span class="icon">💰</span>
                <span>${salaryText}</span>
            </div>
            <div class="featured-job-meta-item">
                <span class="job-type ${job.job_type}">${job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1)}</span>
            </div>
            <div class="featured-job-meta-item">
                <span class="icon">🕐</span>
                <span>${postedText}</span>
            </div>
        </div>
        
        <p class="featured-job-description">${job.description.substring(0, 150)}${job.description.length > 150 ? '...' : ''}</p>
        
        <div class="featured-job-footer">
            <div class="featured-job-salary">${salaryText}</div>
            <button class="btn btn-primary btn-sm view-details-btn" data-job-id="${job.id}">View Details</button>
        </div>
    `;

    return jobCard;
}

// Update platform statistics
function updatePlatformStats() {
    if (Object.keys(platformStats).length === 0) return;
    
    // Update stats on homepage if elements exist
    const statsElements = {
        'active-jobs-count': platformStats.active_jobs,
        'companies-count': platformStats.companies,
        'applications-count': platformStats.total_applications
    };
    
    Object.keys(statsElements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = statsElements[id] || '0';
        }
    });
}

// Global modal functions
window.openJobModal = async function(jobId) {
    const modal = document.getElementById('jobModal');
    if (!modal) return;
    
    try {
        // Show loading state
        modal.style.display = 'block';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Fetch detailed job information
        const job = await fetchJobDetails(jobId);
        
        if (!job) {
            showNotification('Job details could not be loaded.', 'error');
            return;
        }
        
        // Populate modal with job details
        populateModal(job);
        
    } catch (error) {
        console.error('Error opening job modal:', error);
        showNotification('Error loading job details.', 'error');
        window.closeModal();
    }
};

function populateModal(job) {
    // Populate basic info with error handling
    const setTextContent = (id, content) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    };
    
    setTextContent('modalJobTitle', job.title);
    setTextContent('modalCompany', job.company_name);
    setTextContent('modalLocation', job.is_remote ? 
        (job.location ? `${job.location} / Remote` : 'Remote') : 
        (job.location || 'Location TBD'));
    
    const salaryText = job.salary_min && job.salary_max 
        ? `$${job.salary_min}-${job.salary_max}/${job.salary_type}`
        : 'Competitive';
    setTextContent('modalSalary', salaryText);
    setTextContent('modalType', job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1));
    
    const postedDate = new Date(job.posted_date);
    const now = new Date();
    const daysDiff = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24));
    const postedText = daysDiff === 0 ? 'Today' : 
                      daysDiff === 1 ? '1 day ago' : 
                      `${daysDiff} days ago`;
    setTextContent('modalPosted', postedText);
    setTextContent('modalDescription', job.description);

    // Populate requirements
    const requirementsList = document.getElementById('modalRequirements');
    if (requirementsList) {
        requirementsList.innerHTML = '';
        if (job.requirements) {
            // Split requirements by line breaks or bullet points
            const requirements = job.requirements.split('\n').filter(req => req.trim());
            requirements.forEach(req => {
                const li = document.createElement('li');
                li.textContent = req.replace(/^[•\-\*]\s*/, ''); // Remove bullet points
                requirementsList.appendChild(li);
            });
        }
    }

    // Populate tags from skills or create from job data
    const tagsContainer = document.getElementById('modalTags');
    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        
        const tags = [];
        
        // Add job type and experience level as tags
        if (job.job_type) tags.push(job.job_type);
        if (job.experience_level) tags.push(job.experience_level);
        if (job.industry) tags.push(job.industry);
        if (job.is_remote) tags.push('Remote');
        
        // Add required skills as tags
        if (job.required_skills && job.required_skills.length > 0) {
            job.required_skills.forEach(skill => {
                if (skill.is_required) {
                    tags.push(skill.skill_name);
                }
            });
        }
        
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'modal-tag';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });
    }

    // Set up apply button
    const applyBtn = document.getElementById('modalApplyBtn');
    if (applyBtn) {
        applyBtn.onclick = function() {
            window.openApplicationModal(job.id, job.title, job.company_name, job.location);
        };
    }
}

window.closeModal = function() {
    const modal = document.getElementById('jobModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
};

// Application Modal Functions
window.openApplicationModal = function(jobId, jobTitle, company, location) {
    // Close job details modal first
    window.closeModal();
    
    // Open application modal
    const applicationModal = document.getElementById('applicationModal');
    if (!applicationModal) return;
    
    // Populate job details in application form
    document.getElementById('applicationJobTitle').textContent = `Apply for ${jobTitle}`;
    document.getElementById('applicationJobTitleSummary').textContent = jobTitle;
    document.getElementById('applicationJobCompany').textContent = company;
    document.getElementById('applicationJobLocation').textContent = location;
    
    // Store job ID for form submission
    const jobIdInput = document.getElementById('applicationJobId');
    if (jobIdInput) {
        jobIdInput.value = jobId;
    } else {
        // Create hidden input if it doesn't exist
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'applicationJobId';
        hiddenInput.value = jobId;
        document.getElementById('applicationForm').appendChild(hiddenInput);
    }
    
    // Clear form
    document.getElementById('applicationForm').reset();
    
    // Show modal
    applicationModal.style.display = 'block';
    applicationModal.classList.add('show');
    document.body.style.overflow = 'hidden';
};

window.closeApplicationModal = function() {
    const applicationModal = document.getElementById('applicationModal');
    if (applicationModal) {
        applicationModal.style.display = 'none';
        applicationModal.classList.remove('show');
        document.body.style.overflow = '';
    }
};

// Utility functions
function validateField(field) {
    const isValid = field.checkValidity();
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('error');
    }
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}-message`;
    
    const icon = type === 'success' ? '✓' : 
                 type === 'error' ? '✗' : 
                 type === 'warning' ? '⚠' : 'ℹ';
                 
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>${icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Enhanced modal close functionality
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            if (modal.id === 'jobModal') {
                window.closeModal();
            } else if (modal.id === 'applicationModal') {
                window.closeApplicationModal();
            }
        });
    }
});

// Function to toggle the "Other" role field visibility
function toggleOtherRoleField() {
    const roleTypeSelect = document.getElementById('role-type');
    const otherRoleGroup = document.getElementById('other-role-group');
    const otherRoleInput = document.getElementById('other-role');
    
    if (roleTypeSelect.value === 'other') {
        otherRoleGroup.style.display = 'block';
        otherRoleInput.setAttribute('required', 'required');
    } else {
        otherRoleGroup.style.display = 'none';
        otherRoleInput.removeAttribute('required');
        otherRoleInput.value = ''; // Clear the field when hidden
    }
}

// Function to update budget max options based on min selection
function updateBudgetMax() {
    const budgetMin = document.getElementById('budget-min');
    const budgetMax = document.getElementById('budget-max');
    
    if (budgetMin.value === '120+') {
        // If user selects $120+, clear and disable the max field
        budgetMax.value = '';
        budgetMax.disabled = true;
        budgetMax.innerHTML = '<option value="">N/A (Open ended)</option>';
    } else if (budgetMin.value === '') {
        // If no minimum is selected, show all max options
        budgetMax.disabled = false;
        budgetMax.innerHTML = `
            <option value="">Select maximum</option>
            <option value="30">$30</option>
            <option value="40">$40</option>
            <option value="50">$50</option>
            <option value="60">$60</option>
            <option value="70">$70</option>
            <option value="80">$80</option>
            <option value="90">$90</option>
            <option value="100">$100</option>
            <option value="110">$110</option>
            <option value="120">$120</option>
        `;
    } else {
        // Filter max options to be greater than min
        const minValue = parseInt(budgetMin.value);
        budgetMax.disabled = false;
        let maxOptions = '<option value="">Select maximum</option>';
        
        for (let value = 30; value <= 120; value += 10) {
            if (value > minValue) {
                maxOptions += `<option value="${value}">$${value}</option>`;
            }
        }
        
        budgetMax.innerHTML = maxOptions;
        
        // Clear current selection if it's now invalid
        if (budgetMax.value && parseInt(budgetMax.value) <= minValue) {
            budgetMax.value = '';
        }
    }
}