// Jobs page functionality
document.addEventListener('DOMContentLoaded', function() {
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

    // Job Board Data
    const jobsData = [
        {
            id: 1,
            title: "Fractional Chief Technology Officer",
            company: "TechStart Inc.",
            location: "remote",
            locationDisplay: "Remote",
            type: "permanent",
            salary: "$180-220/hour",
            postedDate: "2024-08-28",
            description: "Lead technology strategy and development for growing SaaS startup. Oversee engineering team of 12, architecture decisions, and product roadmap. Drive digital transformation initiatives and establish scalable technology infrastructure for rapid growth.",
            tags: ["CTO", "SaaS", "Team Leadership", "Architecture", "Cloud", "Startup"],
            keywords: "cto technology officer saas engineering team leadership architecture startup",
            requirements: [
                "10+ years of technology leadership experience",
                "Experience scaling engineering teams (10-50 people)",
                "Strong background in SaaS architecture and cloud platforms",
                "Track record of successful digital transformation initiatives",
                "Experience with Series A-C stage startups"
            ]
        },
        {
            id: 2,
            title: "Fractional Chief Marketing Officer",
            company: "GrowthCo",
            location: "new-york",
            locationDisplay: "New York, NY",
            type: "temporary",
            salary: "$150-180/hour",
            postedDate: "2024-08-27",
            description: "Drive marketing strategy and brand development for Series B company. 6-month engagement to launch new product line and expand market presence.",
            tags: ["CMO", "Marketing Strategy", "Brand Development", "Product Launch"],
            keywords: "cmo marketing officer brand development product launch growth strategy"
        },
        {
            id: 3,
            title: "Fractional Head of Sales",
            company: "SalesForce Solutions",
            location: "san-francisco",
            locationDisplay: "San Francisco, CA",
            type: "permanent",
            salary: "$140-170/hour",
            postedDate: "2024-08-26",
            description: "Build and scale sales organization from 2 to 20 people. Establish sales processes, training programs, and revenue operations.",
            tags: ["Sales Leadership", "Team Building", "Revenue Operations", "Process Development"],
            keywords: "head of sales leadership team building revenue operations sales processes training"
        },
        {
            id: 4,
            title: "Fractional Chief Financial Officer",
            company: "FinTech Innovations",
            location: "chicago",
            locationDisplay: "Chicago, IL",
            type: "permanent",
            salary: "$160-200/hour",
            postedDate: "2024-08-25",
            description: "Oversee financial operations, fundraising preparation, and strategic planning for fintech startup preparing for Series A.",
            tags: ["CFO", "Financial Planning", "Fundraising", "Strategic Planning"],
            keywords: "cfo financial officer planning fundraising series a strategic planning fintech"
        },
        {
            id: 5,
            title: "Fractional VP of Engineering",
            company: "DevTools Corp",
            location: "remote",
            locationDisplay: "Remote",
            type: "temporary",
            salary: "$130-160/hour",
            postedDate: "2024-08-24",
            description: "Lead engineering transformation and implement best practices. 4-month project to modernize development processes and mentor engineering managers.",
            tags: ["VP Engineering", "Team Management", "Process Improvement", "Mentoring"],
            keywords: "vp engineering management process improvement mentoring development transformation"
        },
        {
            id: 6,
            title: "Fractional Head of Product",
            company: "ProductLabs",
            location: "austin",
            locationDisplay: "Austin, TX",
            type: "permanent",
            salary: "$120-150/hour",
            postedDate: "2024-08-23",
            description: "Define product strategy and roadmap for B2B SaaS platform. Work with engineering and design teams to deliver customer-focused features.",
            tags: ["Product Management", "Strategy", "Roadmap", "B2B SaaS"],
            keywords: "head of product strategy roadmap b2b saas platform product management customer focus"
        },
        {
            id: 7,
            title: "Fractional Chief Operating Officer",
            company: "Operations Excellence LLC",
            location: "boston",
            locationDisplay: "Boston, MA",
            type: "temporary",
            salary: "$170-200/hour",
            postedDate: "2024-08-22",
            description: "Streamline operations and improve efficiency for rapidly scaling e-commerce business. 8-month engagement to implement operational frameworks.",
            tags: ["COO", "Operations", "Process Optimization", "E-commerce"],
            keywords: "coo operations officer process optimization ecommerce efficiency scaling operational frameworks"
        },
        {
            id: 8,
            title: "Fractional Data Science Director",
            company: "DataDriven Analytics",
            location: "seattle",
            locationDisplay: "Seattle, WA",
            type: "permanent",
            salary: "$140-180/hour",
            postedDate: "2024-08-21",
            description: "Build data science capabilities and ML infrastructure. Lead team of 6 data scientists and establish analytics practices across the organization.",
            tags: ["Data Science", "Machine Learning", "Analytics", "Team Leadership"],
            keywords: "data science director machine learning ml analytics team leadership infrastructure practices"
        },
        {
            id: 9,
            title: "Fractional VP of Customer Success",
            company: "CustomerFirst SaaS",
            location: "remote",
            locationDisplay: "Remote",
            type: "permanent",
            salary: "$110-140/hour",
            postedDate: "2024-08-20",
            description: "Develop customer success program to reduce churn and increase expansion revenue. Build CS team and implement success metrics and processes.",
            tags: ["Customer Success", "Churn Reduction", "Expansion Revenue", "Team Building"],
            keywords: "vp customer success churn reduction expansion revenue team building cs metrics processes"
        },
        {
            id: 10,
            title: "Fractional Chief People Officer",
            company: "TalentGrowth Inc",
            location: "san-francisco",
            locationDisplay: "San Francisco, CA",
            type: "temporary",
            salary: "$130-160/hour",
            postedDate: "2024-08-19",
            description: "Design and implement people strategy for fast-growing startup. 6-month project to establish HR processes, culture, and talent acquisition.",
            tags: ["Chief People Officer", "HR Strategy", "Culture", "Talent Acquisition"],
            keywords: "chief people officer cpo hr strategy culture talent acquisition processes startup"
        },
        {
            id: 11,
            title: "Fractional Strategic Consultant",
            company: "Strategy Partners",
            location: "new-york",
            locationDisplay: "New York, NY",
            type: "temporary",
            salary: "$160-190/hour",
            postedDate: "2024-08-18",
            description: "Provide strategic guidance for market expansion and competitive positioning. 3-month engagement for Fortune 500 subsidiary entering new markets.",
            tags: ["Strategy Consulting", "Market Expansion", "Competitive Analysis", "Fortune 500"],
            keywords: "strategic consultant strategy market expansion competitive positioning fortune 500 subsidiary"
        },
        {
            id: 12,
            title: "Fractional Digital Transformation Lead",
            company: "TransformTech Solutions",
            location: "chicago",
            locationDisplay: "Chicago, IL",
            type: "permanent",
            salary: "$150-180/hour",
            postedDate: "2024-08-17",
            description: "Lead digital transformation initiatives across multiple business units. Implement modern technology stack and change management processes.",
            tags: ["Digital Transformation", "Change Management", "Technology Implementation", "Business Strategy"],
            keywords: "digital transformation lead change management technology implementation business strategy modern stack"
        },
        {
            id: 13,
            title: "Fractional VP of Revenue Operations",
            company: "RevOps Solutions",
            location: "remote",
            locationDisplay: "Remote",
            type: "permanent",
            salary: "$135-165/hour",
            postedDate: "2024-08-16",
            description: "Optimize revenue processes and implement sales operations infrastructure. Build reporting dashboards and establish KPIs for sales and marketing teams.",
            tags: ["Revenue Operations", "Sales Operations", "Analytics", "Process Optimization"],
            keywords: "vp revenue operations sales operations analytics process optimization dashboards kpis"
        },
        {
            id: 14,
            title: "Fractional Chief Security Officer",
            company: "SecureCloud Inc",
            location: "austin",
            locationDisplay: "Austin, TX",
            type: "temporary",
            salary: "$170-200/hour",
            postedDate: "2024-08-15",
            description: "Establish comprehensive security framework and compliance protocols. 9-month engagement to achieve SOC2 certification and implement security best practices.",
            tags: ["Chief Security Officer", "Cybersecurity", "Compliance", "SOC2"],
            keywords: "chief security officer cso cybersecurity compliance soc2 security framework protocols"
        },
        {
            id: 15,
            title: "Fractional Head of Talent Acquisition",
            company: "HiringPro Corp",
            location: "boston",
            locationDisplay: "Boston, MA",
            type: "permanent",
            salary: "$120-140/hour",
            postedDate: "2024-08-14",
            description: "Build and scale talent acquisition function for rapidly growing tech company. Establish recruiting processes, employer branding, and talent pipeline.",
            tags: ["Talent Acquisition", "Recruiting", "Employer Branding", "HR"],
            keywords: "head talent acquisition recruiting employer branding hr processes talent pipeline scaling"
        }
    ];

    let filteredJobs = [...jobsData];
    let currentPage = 1;
    const jobsPerPage = 8;

    // Job Board Elements
    const keywordSearch = document.getElementById('keyword-search');
    const locationFilter = document.getElementById('location-filter');
    const typeFilter = document.getElementById('type-filter');
    const sortBy = document.getElementById('sort-by');
    const jobListings = document.getElementById('job-listings');
    const jobCount = document.getElementById('job-count');
    const loadMoreBtn = document.getElementById('load-more');

    // Initialize job board
    if (jobListings) {
        renderJobs();
        updateJobCount();

        // Event listeners for filters
        keywordSearch?.addEventListener('input', debounce(filterJobs, 300));
        locationFilter?.addEventListener('change', filterJobs);
        typeFilter?.addEventListener('change', filterJobs);
        sortBy?.addEventListener('change', sortJobs);
        loadMoreBtn?.addEventListener('click', loadMoreJobs);
    }

    // Handle view details button clicks
    function handleViewDetails() {
        const jobId = parseInt(this.getAttribute('data-job-id'));
        openJobModal(jobId);
    }

    // Debounce function for search input
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

    // Filter jobs based on search criteria
    function filterJobs() {
        const keyword = keywordSearch?.value.toLowerCase() || '';
        const location = locationFilter?.value || '';
        const type = typeFilter?.value || '';

        filteredJobs = jobsData.filter(job => {
            const matchesKeyword = keyword === '' || job.keywords.includes(keyword) || 
                                  job.title.toLowerCase().includes(keyword) ||
                                  job.company.toLowerCase().includes(keyword) ||
                                  job.tags.some(tag => tag.toLowerCase().includes(keyword));
            const matchesLocation = location === '' || job.location === location;
            const matchesType = type === '' || job.type === type;

            return matchesKeyword && matchesLocation && matchesType;
        });

        currentPage = 1;
        sortJobs();
    }

    // Sort jobs based on selected criteria
    function sortJobs() {
        const sortValue = sortBy?.value || 'date-desc';

        filteredJobs.sort((a, b) => {
            switch (sortValue) {
                case 'date-desc':
                    return new Date(b.postedDate) - new Date(a.postedDate);
                case 'date-asc':
                    return new Date(a.postedDate) - new Date(b.postedDate);
                case 'location':
                    return a.locationDisplay.localeCompare(b.locationDisplay);
                default:
                    return 0;
            }
        });

        renderJobs();
        updateJobCount();
    }

    // Render jobs to the DOM
    function renderJobs(append = false) {
        if (!jobListings) return;

        const startIndex = append ? (currentPage - 1) * jobsPerPage : 0;
        const endIndex = currentPage * jobsPerPage;
        const jobsToShow = filteredJobs.slice(startIndex, endIndex);

        if (!append) {
            jobListings.innerHTML = '';
        }

        if (jobsToShow.length === 0 && !append) {
            jobListings.innerHTML = `
                <div class="no-results">
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search criteria or filters to find more opportunities.</p>
                </div>
            `;
            loadMoreBtn.style.display = 'none';
            return;
        }

        jobsToShow.forEach(job => {
            const jobCard = createJobCard(job);
            jobListings.appendChild(jobCard);
        });

        // Add event listeners to newly created View Details buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            // Remove existing event listener if any
            button.removeEventListener('click', handleViewDetails);
            // Add new event listener
            button.addEventListener('click', handleViewDetails);
        });

        // Show/hide load more button
        const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
        loadMoreBtn.style.display = currentPage >= totalPages ? 'none' : 'block';
    }

    // Create job card HTML
    function createJobCard(job) {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        
        const postedDate = formatDate(job.postedDate);
        const tagsHTML = job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('');

        jobCard.innerHTML = `
            <div class="job-header">
                <div>
                    <h3 class="job-title">${job.title}</h3>
                    <div class="job-company">${job.company}</div>
                </div>
                <div class="job-date">${postedDate}</div>
            </div>
            
            <div class="job-meta">
                <div class="job-meta-item">
                    <span class="icon">📍</span>
                    <span>${job.locationDisplay}</span>
                </div>
                <div class="job-meta-item">
                    <span class="icon">💰</span>
                    <span>${job.salary}</span>
                </div>
                <div class="job-meta-item">
                    <span class="job-type ${job.type}">${job.type.charAt(0).toUpperCase() + job.type.slice(1)}</span>
                </div>
            </div>
            
            <p class="job-description">${job.description}</p>
            
            <div class="job-tags">
                ${tagsHTML}
            </div>
            
            <div class="job-footer">
                <div class="job-salary">${job.salary}</div>
                <button class="btn btn-primary apply-btn view-details-btn" data-job-id="${job.id}">View Details</button>
            </div>
        `;

        return jobCard;
    }

    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 14) return '1 week ago';
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    }

    // Update job count display
    function updateJobCount() {
        if (jobCount) {
            jobCount.textContent = filteredJobs.length;
        }
    }

    // Load more jobs
    function loadMoreJobs() {
        currentPage++;
        renderJobs(true);
    }

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

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Global functions for modal

    function populateModal(job) {
        console.log('Populating modal with job:', job);
        
        const elements = {
            modalJobTitle: document.getElementById('modalJobTitle'),
            modalCompany: document.getElementById('modalCompany'),
            modalLocation: document.getElementById('modalLocation'),
            modalSalary: document.getElementById('modalSalary'),
            modalType: document.getElementById('modalType'),
            modalPosted: document.getElementById('modalPosted'),
            modalDescription: document.getElementById('modalDescription')
        };
        
        // Check if all elements exist
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`Element ${key} not found`);
                return;
            }
        }
        
        elements.modalJobTitle.textContent = job.title;
        elements.modalCompany.textContent = job.company;
        elements.modalLocation.textContent = job.locationDisplay;
        elements.modalSalary.textContent = job.salary;
        elements.modalType.textContent = job.type.charAt(0).toUpperCase() + job.type.slice(1);
        elements.modalPosted.textContent = formatDate(job.postedDate);
        elements.modalDescription.textContent = job.description;

        // Populate requirements (use generic ones if not specified)
        const requirementsList = document.getElementById('modalRequirements');
        requirementsList.innerHTML = '';
        const requirements = job.requirements || [
            "5+ years of relevant leadership experience",
            "Strong background in the required domain",
            "Experience with scaling teams and processes",
            "Excellent communication and interpersonal skills",
            "Startup or high-growth company experience preferred"
        ];
        requirements.forEach(req => {
            const li = document.createElement('li');
            li.textContent = req;
            requirementsList.appendChild(li);
        });

        // Populate tags
        const tagsContainer = document.getElementById('modalTags');
        tagsContainer.innerHTML = '';
        job.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'modal-tag';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });

        // Set up apply button
        const applyBtn = document.getElementById('modalApplyBtn');
        applyBtn.onclick = function() {
            window.openApplicationModal(job.id, job.title, job.company, job.locationDisplay);
        };
    }

    // Apply to job function
    window.applyToJob = function(jobId, jobTitle, company) {
        window.closeModal();
        alert(`Thank you for your interest in the ${jobTitle} position at ${company}!\n\nIn a real application, this would:\n• Redirect to an application form\n• Collect your resume and cover letter\n• Send your application to the hiring manager\n• Provide application tracking updates`);
    };
    
    // Make data globally accessible
    window.jobsData = jobsData;
    window.populateModal = populateModal;
    
    // Add global event delegation for View Details buttons
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('view-details-btn')) {
            e.preventDefault();
            const jobId = parseInt(e.target.getAttribute('data-job-id'));
            window.openJobModal(jobId);
        }
    });
    
    // Handle application form submission
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate submission delay
            setTimeout(() => {
                // Get form data
                const formData = new FormData(this);
                const firstName = formData.get('firstName');
                const lastName = formData.get('lastName');
                const jobTitle = document.getElementById('applicationJobTitleSummary').textContent;
                const company = document.getElementById('applicationJobCompany').textContent;
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Close modal
                window.closeApplicationModal();
                
                // Show success message
                showNotification(`Thank you ${firstName} ${lastName}! Your application for the ${jobTitle} position at ${company} has been submitted successfully. We will review your application and get back to you within 2-3 business days.`, 'success');
            }, 1500);
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

// Global modal functions for jobs page (outside DOMContentLoaded)
window.openJobModal = function(jobId) {
    // Get the jobs data from the global scope
    const jobsData = window.jobsData || [];
    const job = jobsData.find(j => j.id === jobId);
    
    const modal = document.getElementById('jobModal');
    
    if (!modal || !job) {
        return;
    }
    
    // Call the populateModal function
    if (typeof window.populateModal === 'function') {
        window.populateModal(job);
    }
    modal.style.display = 'block';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
};

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
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>${type === 'success' ? '✓' : '⚠'}</span>
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