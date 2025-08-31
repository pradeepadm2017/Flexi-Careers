// Mobile menu functionality
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

    // Form submission
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would typically send the form data to your server
            // For now, we'll just show a success message
            alert('Thank you for your request! We will contact you within 24 hours to discuss your fractional talent needs.');
            
            // Reset form
            this.reset();
        });
    }

    // Featured Jobs for Homepage with detailed information
    const featuredJobsData = [
        {
            id: 1,
            title: "Fractional Chief Technology Officer",
            company: "TechStart Inc.",
            location: "Remote",
            type: "permanent",
            salary: "$180-220/hour",
            description: "Lead technology strategy and development for growing SaaS startup. Oversee engineering team of 12, architecture decisions, and product roadmap. Drive digital transformation initiatives and establish scalable technology infrastructure for rapid growth.",
            postedDate: "2 days ago",
            requirements: [
                "10+ years of technology leadership experience",
                "Experience scaling engineering teams (10-50 people)",
                "Strong background in SaaS architecture and cloud platforms",
                "Track record of successful digital transformation initiatives",
                "Experience with Series A-C stage startups"
            ],
            tags: ["CTO", "SaaS", "Team Leadership", "Architecture", "Cloud", "Startup"]
        },
        {
            id: 2,
            title: "Fractional Chief Marketing Officer",
            company: "GrowthCo",
            location: "New York, NY",
            type: "temporary",
            salary: "$150-180/hour",
            description: "Drive marketing strategy and brand development for Series B company. 6-month engagement to launch new product line and expand market presence. Lead cross-functional teams to execute integrated marketing campaigns.",
            postedDate: "3 days ago",
            requirements: [
                "8+ years of senior marketing leadership experience",
                "Proven track record in product launches and brand development",
                "Experience with Series B-C stage companies",
                "Strong analytical skills and data-driven approach",
                "Experience managing marketing budgets $1M+"
            ],
            tags: ["CMO", "Marketing Strategy", "Brand Development", "Product Launch", "Growth", "Analytics"]
        },
        {
            id: 3,
            title: "Fractional Head of Sales",
            company: "SalesForce Solutions",
            location: "San Francisco, CA",
            type: "permanent",
            salary: "$140-170/hour",
            description: "Build and scale sales organization from 2 to 20 people. Establish sales processes, training programs, and revenue operations. Implement CRM systems and develop scalable sales methodologies.",
            postedDate: "4 days ago",
            requirements: [
                "7+ years of sales leadership experience",
                "Experience scaling sales teams from startup to growth stage",
                "Strong background in B2B sales and enterprise accounts",
                "Proven ability to design and implement sales processes",
                "Experience with CRM implementation and sales operations"
            ],
            tags: ["Sales Leadership", "Team Building", "Revenue Operations", "CRM", "B2B Sales", "Process Development"]
        },
        {
            id: 4,
            title: "Fractional Chief Financial Officer",
            company: "FinTech Innovations",
            location: "Chicago, IL",
            type: "permanent",
            salary: "$160-200/hour",
            description: "Oversee financial operations, fundraising preparation, and strategic planning for fintech startup preparing for Series A. Manage investor relations, financial modeling, and compliance requirements.",
            postedDate: "5 days ago",
            requirements: [
                "10+ years of finance and accounting leadership experience",
                "Experience with Series A fundraising and investor relations",
                "Strong background in financial modeling and valuation",
                "Fintech or financial services industry experience required",
                "CPA or MBA preferred"
            ],
            tags: ["CFO", "Financial Planning", "Fundraising", "Strategic Planning", "FinTech", "Investor Relations"]
        }
    ];

    // Render featured jobs on homepage
    const featuredJobsContainer = document.getElementById('featured-jobs');
    if (featuredJobsContainer) {
        featuredJobsData.forEach(job => {
            const jobCard = createFeaturedJobCard(job);
            featuredJobsContainer.appendChild(jobCard);
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

    // Create featured job card HTML
    function createFeaturedJobCard(job) {
        const jobCard = document.createElement('div');
        jobCard.className = 'featured-job-card';
        
        jobCard.innerHTML = `
            <h3 class="featured-job-title">${job.title}</h3>
            <div class="featured-job-company">${job.company}</div>
            
            <div class="featured-job-meta">
                <div class="featured-job-meta-item">
                    <span class="icon">📍</span>
                    <span>${job.location}</span>
                </div>
                <div class="featured-job-meta-item">
                    <span class="icon">💰</span>
                    <span>${job.salary}</span>
                </div>
                <div class="featured-job-meta-item">
                    <span class="job-type ${job.type}">${job.type.charAt(0).toUpperCase() + job.type.slice(1)}</span>
                </div>
                <div class="featured-job-meta-item">
                    <span class="icon">🕐</span>
                    <span>${job.postedDate}</span>
                </div>
            </div>
            
            <p class="featured-job-description">${job.description}</p>
            
            <div class="featured-job-footer">
                <div class="featured-job-salary">${job.salary}</div>
                <button class="btn btn-primary btn-sm view-details-btn" data-job-id="${job.id}">View Details</button>
            </div>
        `;

        return jobCard;
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


    function populateModal(job) {
        // Populate basic info with error handling
        const setTextContent = (id, content) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = content;
            } else {
                throw new Error(`Element ${id} not found`);
            }
        };
        
        setTextContent('modalJobTitle', job.title);
        setTextContent('modalCompany', job.company);
        setTextContent('modalLocation', job.location);
        setTextContent('modalSalary', job.salary);
        setTextContent('modalType', job.type.charAt(0).toUpperCase() + job.type.slice(1));
        setTextContent('modalPosted', job.postedDate);
        setTextContent('modalDescription', job.description);

        // Populate requirements
        const requirementsList = document.getElementById('modalRequirements');
        if (requirementsList) {
            requirementsList.innerHTML = '';
            if (job.requirements && job.requirements.length > 0) {
                job.requirements.forEach(req => {
                    const li = document.createElement('li');
                    li.textContent = req;
                    requirementsList.appendChild(li);
                });
            }
        }

        // Populate tags
        const tagsContainer = document.getElementById('modalTags');
        if (tagsContainer) {
            tagsContainer.innerHTML = '';
            if (job.tags && job.tags.length > 0) {
                job.tags.forEach(tag => {
                    const span = document.createElement('span');
                    span.className = 'modal-tag';
                    span.textContent = tag;
                    tagsContainer.appendChild(span);
                });
            }
        }

        // Set up apply button
        const applyBtn = document.getElementById('modalApplyBtn');
        if (applyBtn) {
            applyBtn.onclick = function() {
                window.openApplicationModal(job.id, job.title, job.company, job.location);
            };
        }
    }

    // Apply to job function
    window.applyToJob = function(jobId, jobTitle, company) {
        window.closeModal();
        alert(`Thank you for your interest in the ${jobTitle} position at ${company}!\n\nIn a real application, this would:\n• Redirect to an application form\n• Collect your resume and cover letter\n• Send your application to the hiring manager\n• Provide application tracking updates`);
    };
    
    // Make data globally accessible
    window.featuredJobsData = featuredJobsData;
    window.populateModal = populateModal;
});

// Global modal functions (outside DOMContentLoaded)
window.openJobModal = function(jobId) {
    // Get the featured jobs data from the global scope
    const featuredJobsData = window.featuredJobsData || [];
    const job = featuredJobsData.find(j => j.id === jobId);
    
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

// Handle application form submission and additional functionality
document.addEventListener('DOMContentLoaded', function() {
    // Application form handling
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