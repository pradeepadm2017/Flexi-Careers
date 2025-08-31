// Jobs Page Backend Integration
// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Global variables
let allJobs = [];
let filteredJobs = [];
let currentFilters = {
    search: '',
    location: '',
    job_type: '',
    experience_level: '',
    is_remote: ''
};

// Page initialization
document.addEventListener('DOMContentLoaded', async function() {
    initializeJobsPage();
});

async function initializeJobsPage() {
    try {
        // Show loading state
        showLoadingState(true);
        
        // Load jobs from backend
        allJobs = await fetchJobs();
        filteredJobs = [...allJobs];
        
        // Render jobs
        renderJobs(filteredJobs);
        
        // Setup event listeners
        setupEventListeners();
        
        // Hide loading state
        showLoadingState(false);
        
        console.log(`Loaded ${allJobs.length} jobs from backend`);
        
    } catch (error) {
        console.error('Error initializing jobs page:', error);
        showErrorState();
    }
}

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

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filter controls
    const filterControls = document.querySelectorAll('.filter-control');
    filterControls.forEach(control => {
        control.addEventListener('change', handleFilterChange);
    });
    
    // Sort controls
    const sortControls = document.querySelectorAll('input[name="sort"]');
    sortControls.forEach(control => {
        control.addEventListener('change', handleSortChange);
    });
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // View details buttons (using event delegation)
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('view-details-btn')) {
            e.preventDefault();
            const jobId = parseInt(e.target.getAttribute('data-job-id'));
            openJobModal(jobId);
        }
    });
    
    // Application submit button
    const submitBtn = document.getElementById('submitApplicationBtn');
    if (submitBtn) {
        console.log('Submit button found, adding click listener');
        submitBtn.addEventListener('click', handleApplicationSubmit);
    } else {
        console.log('Submit button not found!');
    }
    
    // Modal close events
    setupModalEvents();
}

// Search functionality
function handleSearch(event) {
    currentFilters.search = event.target.value.toLowerCase();
    applyFilters();
}

// Filter functionality
function handleFilterChange(event) {
    const filterType = event.target.name;
    const filterValue = event.target.value;
    
    currentFilters[filterType] = filterValue;
    applyFilters();
}

// Sort functionality
function handleSortChange(event) {
    const sortType = event.target.value;
    applySorting(sortType);
}

// Apply filters to jobs
function applyFilters() {
    filteredJobs = allJobs.filter(job => {
        // Search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search;
            const searchable = [
                job.title,
                job.company_name,
                job.description,
                job.requirements || '',
                job.location || '',
                ...(job.skills || [])
            ].join(' ').toLowerCase();
            
            if (!searchable.includes(searchTerm)) {
                return false;
            }
        }
        
        // Location filter
        if (currentFilters.location) {
            if (job.is_remote && currentFilters.location === 'remote') {
                // Job is remote
            } else if (job.location && job.location.toLowerCase().includes(currentFilters.location.toLowerCase())) {
                // Job location matches
            } else {
                return false;
            }
        }
        
        // Job type filter
        if (currentFilters.job_type && job.job_type !== currentFilters.job_type) {
            return false;
        }
        
        // Experience level filter
        if (currentFilters.experience_level && job.experience_level !== currentFilters.experience_level) {
            return false;
        }
        
        // Remote filter
        if (currentFilters.is_remote === 'true' && !job.is_remote) {
            return false;
        }
        
        return true;
    });
    
    renderJobs(filteredJobs);
    updateResultsCount();
}

// Apply sorting
function applySorting(sortType) {
    switch (sortType) {
        case 'newest':
            filteredJobs.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
            break;
        case 'oldest':
            filteredJobs.sort((a, b) => new Date(a.posted_date) - new Date(b.posted_date));
            break;
        case 'salary-high':
            filteredJobs.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
            break;
        case 'salary-low':
            filteredJobs.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0));
            break;
        case 'company':
            filteredJobs.sort((a, b) => a.company_name.localeCompare(b.company_name));
            break;
        default:
            filteredJobs.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
    }
    
    renderJobs(filteredJobs);
}

// Clear all filters
function clearAllFilters() {
    // Reset filter object
    currentFilters = {
        search: '',
        location: '',
        job_type: '',
        experience_level: '',
        is_remote: ''
    };
    
    // Reset form controls
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.filter-control').forEach(control => {
        control.value = '';
    });
    
    // Reset to all jobs
    filteredJobs = [...allJobs];
    renderJobs(filteredJobs);
    updateResultsCount();
}

// Render jobs to the page
function renderJobs(jobs) {
    const jobsContainer = document.getElementById('job-listings');
    if (!jobsContainer) return;
    
    if (jobs.length === 0) {
        jobsContainer.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No jobs found</h3>
                <p>Try adjusting your search criteria or filters</p>
                <button class="btn btn-primary" onclick="clearAllFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }
    
    jobsContainer.innerHTML = jobs.map(job => createJobCard(job)).join('');
    
    // Re-initialize animations
    initializeAnimations();
}

// Create individual job card
function createJobCard(job) {
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
                      
    // Format hours per week
    const hoursText = job.hours_per_week || 'Flexible';
    
    // Format duration
    const durationText = job.duration || 'Ongoing';
    
    // Create skills tags
    const skillsTags = job.skills && job.skills.length > 0 
        ? job.skills.slice(0, 5).map(skill => `<span class="skill-tag">${skill}</span>`).join('')
        : '';
    
    return `
        <div class="job-card" data-job-id="${job.id}">
            <div class="job-header">
                <div class="job-title-section">
                    <h3 class="job-title">${job.title}</h3>
                    <div class="company-info">
                        <span class="company-name">${job.company_name}</span>
                        ${job.industry ? `<span class="company-industry"> • ${job.industry}</span>` : ''}
                    </div>
                </div>
                <div class="job-meta-top">
                    <span class="job-type job-type-${job.job_type}">${job.job_type}</span>
                    ${job.is_remote ? '<span class="remote-badge">Remote</span>' : ''}
                </div>
            </div>
            
            <div class="job-details">
                <div class="job-meta">
                    <div class="meta-item">
                        <i class="icon location-icon">📍</i>
                        <span>${locationText}</span>
                    </div>
                    <div class="meta-item">
                        <i class="icon salary-icon">💰</i>
                        <span>${salaryText}</span>
                    </div>
                    <div class="meta-item">
                        <i class="icon time-icon">🕐</i>
                        <span>${hoursText}</span>
                    </div>
                    <div class="meta-item">
                        <i class="icon duration-icon">📅</i>
                        <span>${durationText}</span>
                    </div>
                </div>
                
                <p class="job-description">${job.description.substring(0, 200)}${job.description.length > 200 ? '...' : ''}</p>
                
                ${skillsTags ? `<div class="skills-container">${skillsTags}</div>` : ''}
            </div>
            
            <div class="job-footer">
                <div class="job-footer-left">
                    <span class="posted-date">Posted ${postedText}</span>
                    ${job.application_count ? `<span class="application-count">${job.application_count} applications</span>` : ''}
                </div>
                <div class="job-footer-right">
                    <button class="btn btn-outline view-details-btn" data-job-id="${job.id}">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('job-count');
    if (resultsCount) {
        const count = filteredJobs.length;
        resultsCount.textContent = count;
    }
}

// Initialize animations for new content
function initializeAnimations() {
    const jobCards = document.querySelectorAll('.job-card');
    
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

    jobCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Modal functionality
async function openJobModal(jobId) {
    const modal = document.getElementById('jobModal');
    if (!modal) return;
    
    try {
        // Show loading state
        modal.style.display = 'block';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Show loading in modal
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <div class="modal-loading">
                <div class="loading-spinner"></div>
                <p>Loading job details...</p>
            </div>
        `;
        
        // Fetch detailed job information
        const job = await fetchJobDetails(jobId);
        
        if (!job) {
            showNotification('Job details could not be loaded.', 'error');
            closeModal();
            return;
        }
        
        // Populate modal with job details
        populateJobModal(job);
        
    } catch (error) {
        console.error('Error opening job modal:', error);
        showNotification('Error loading job details.', 'error');
        closeModal();
    }
}

function populateJobModal(job) {
    const modal = document.getElementById('jobModal');
    const modalContent = modal.querySelector('.modal-content');
    
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
                      
    // Create requirements list
    const requirementsList = job.requirements 
        ? job.requirements.split('\n').filter(req => req.trim()).map(req => 
            `<li>${req.replace(/^[•\-\*]\s*/, '')}</li>`
          ).join('')
        : '<li>Requirements will be discussed during the application process</li>';
    
    // Create responsibilities list
    const responsibilitiesList = job.responsibilities 
        ? job.responsibilities.split('\n').filter(resp => resp.trim()).map(resp => 
            `<li>${resp.replace(/^[•\-\*]\s*/, '')}</li>`
          ).join('')
        : '';
    
    // Create skills tags
    const tags = [];
    if (job.job_type) tags.push(job.job_type);
    if (job.experience_level) tags.push(job.experience_level);
    if (job.industry) tags.push(job.industry);
    if (job.is_remote) tags.push('Remote');
    
    const skillsTags = tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${job.title}</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        
        <div class="modal-body">
            <div class="job-summary">
                <div class="company-section">
                    <h3 class="company-name">${job.company_name}</h3>
                    ${job.company_description ? `<p class="company-description">${job.company_description}</p>` : ''}
                </div>
                
                <div class="job-meta-detailed">
                    <div class="meta-row">
                        <div class="meta-item">
                            <strong>Location:</strong> ${locationText}
                        </div>
                        <div class="meta-item">
                            <strong>Salary:</strong> ${salaryText}
                        </div>
                    </div>
                    <div class="meta-row">
                        <div class="meta-item">
                            <strong>Type:</strong> ${job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1)}
                        </div>
                        <div class="meta-item">
                            <strong>Posted:</strong> ${postedText}
                        </div>
                    </div>
                    ${job.hours_per_week ? `
                    <div class="meta-row">
                        <div class="meta-item">
                            <strong>Hours/Week:</strong> ${job.hours_per_week}
                        </div>
                        ${job.duration ? `<div class="meta-item"><strong>Duration:</strong> ${job.duration}</div>` : ''}
                    </div>
                    ` : ''}
                </div>
                
                ${skillsTags ? `<div class="modal-tags">${skillsTags}</div>` : ''}
            </div>
            
            <div class="job-description-section">
                <h3>Job Description</h3>
                <div class="job-description-full">${job.description.replace(/\n/g, '<br>')}</div>
            </div>
            
            <div class="job-requirements-section">
                <h3>Requirements</h3>
                <ul class="requirements-list">${requirementsList}</ul>
            </div>
            
            ${responsibilitiesList ? `
            <div class="job-responsibilities-section">
                <h3>Responsibilities</h3>
                <ul class="responsibilities-list">${responsibilitiesList}</ul>
            </div>
            ` : ''}
            
            ${job.benefits ? `
            <div class="job-benefits-section">
                <h3>Benefits</h3>
                <div class="job-benefits">${job.benefits.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
        </div>
        
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            <button class="btn btn-primary" onclick="openApplicationModal(${job.id}, '${job.title}', '${job.company_name}', '${locationText}')">
                Apply Now
            </button>
        </div>
    `;
}

function closeModal() {
    const modal = document.getElementById('jobModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Application modal functions
function openApplicationModal(jobId, jobTitle, company, location) {
    closeModal(); // Close job details modal
    
    const applicationModal = document.getElementById('applicationModal');
    if (!applicationModal) return;
    
    // Populate job details
    document.getElementById('applicationJobTitle').textContent = `Apply for ${jobTitle}`;
    document.getElementById('applicationJobTitleSummary').textContent = jobTitle;
    document.getElementById('applicationJobCompany').textContent = company;
    document.getElementById('applicationJobLocation').textContent = location;
    
    // Store job ID
    const jobIdInput = document.getElementById('applicationJobId');
    if (jobIdInput) {
        jobIdInput.value = jobId;
    } else {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'applicationJobId';
        hiddenInput.value = jobId;
        document.getElementById('applicationForm').appendChild(hiddenInput);
    }
    
    // Clear and show form
    document.getElementById('applicationForm').reset();
    applicationModal.style.display = 'block';
    applicationModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeApplicationModal() {
    const applicationModal = document.getElementById('applicationModal');
    if (applicationModal) {
        applicationModal.style.display = 'none';
        applicationModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Handle application form submission
async function handleApplicationSubmit(event) {
    console.log('Submit button clicked!');
    event.preventDefault();
    
    const submitBtn = event.target;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
        const applicationForm = document.getElementById('applicationForm');
        if (!applicationForm) {
            throw new Error('Application form not found');
        }
        
        const formData = new FormData(applicationForm);
        const jobId = parseInt(document.getElementById('applicationJobId').value);
        
        // Validate jobId
        if (!jobId || isNaN(jobId)) {
            throw new Error('Invalid job ID');
        }
        
        await submitApplication(jobId, formData);
        
        closeApplicationModal();
        
        const firstName = formData.get('firstName');
        showNotification(
            `Thank you ${firstName}! Your application has been submitted successfully. We'll review it and get back to you within 2-3 business days.`, 
            'success'
        );
        
    } catch (error) {
        showNotification('There was an error submitting your application. Please try again.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Setup modal events
function setupModalEvents() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        const jobModal = document.getElementById('jobModal');
        const applicationModal = document.getElementById('applicationModal');
        
        if (e.target === jobModal) {
            closeModal();
        } else if (e.target === applicationModal) {
            closeApplicationModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                if (modal.id === 'jobModal') {
                    closeModal();
                } else if (modal.id === 'applicationModal') {
                    closeApplicationModal();
                }
            });
        }
    });
}

// Loading state management
function showLoadingState(show) {
    const jobsContainer = document.getElementById('jobsContainer');
    if (!jobsContainer) return;
    
    if (show) {
        jobsContainer.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading jobs...</p>
            </div>
        `;
    }
}

function showErrorState() {
    const jobsContainer = document.getElementById('jobsContainer');
    if (!jobsContainer) return;
    
    jobsContainer.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Unable to load jobs</h3>
            <p>Please check your connection and try again</p>
            <button class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>
    `;
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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