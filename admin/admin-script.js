// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.companies = [];
        this.jobs = [];
        this.applications = [];
        this.employerRequests = [];
        this.staff = [];
        this.analytics = {};
        
        this.init();
    }

    async init() {
        // Check authentication
        this.checkAuth();
        
        // Load initial data  
        this.loadMockData();
        this.setupEventListeners();
        
        // Load data asynchronously in the right order
        await this.loadStaff(); // Load staff members first
        this.loadRealApplications(); // Load real applications from API
        this.loadRealEmployerRequests(); // Load real employer requests from API
        this.loadDashboard();
    }

    checkAuth() {
        const user = localStorage.getItem('admin_user');
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        const userData = JSON.parse(user);
        document.getElementById('admin-name').textContent = userData.username;
    }

    setupEventListeners() {
        // Form submissions
        document.getElementById('add-company-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCompany();
        });

        document.getElementById('add-job-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addJob();
        });

        document.getElementById('add-staff-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addStaff();
        });

        // Toggle login details visibility
        document.getElementById('staff-create-login').addEventListener('change', (e) => {
            const loginDetails = document.getElementById('login-details');
            loginDetails.style.display = e.target.checked ? 'block' : 'none';
        });

        // Modal close on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }

    // Load mock data for companies and jobs
    loadMockData() {
        this.companies = [
            { id: 1, name: 'TechStart Inc.', industry: 'Technology', location: 'San Francisco, CA', jobs_count: 2 },
            { id: 2, name: 'GrowthCo', industry: 'Marketing Tech', location: 'New York, NY', jobs_count: 1 },
            { id: 3, name: 'FinTech Innovations', industry: 'FinTech', location: 'Chicago, IL', jobs_count: 1 },
            { id: 4, name: 'DataDriven Corp', industry: 'AI/ML', location: 'Austin, TX', jobs_count: 1 },
            { id: 5, name: 'CloudScale Systems', industry: 'Cloud Computing', location: 'Seattle, WA', jobs_count: 1 }
        ];

        this.jobs = [
            { 
                id: 1, 
                title: 'Fractional Chief Technology Officer', 
                company_id: 1, 
                company_name: 'TechStart Inc.',
                posted_date: '2024-01-15', 
                applications_count: 2, 
                status: 'active' 
            },
            { 
                id: 2, 
                title: 'Fractional Chief Marketing Officer', 
                company_id: 2, 
                company_name: 'GrowthCo',
                posted_date: '2024-01-18', 
                applications_count: 1, 
                status: 'active' 
            }
        ];
        
        this.applications = []; // Will be loaded from API
        this.employerRequests = []; // Will be loaded from API
    }
    
    // Load real applications from API
    async loadRealApplications() {
        try {
            // Load applications from API
            const response = await fetch('http://localhost:5000/admin/api/applications');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.applications = data.applications;
                    console.log(`Loaded ${this.applications.length} applications from API`);
                } else {
                    console.error('Failed to load applications:', data.error);
                    this.applications = [];
                }
            } else {
                console.error('Applications API not available, using mock data');
                this.applications = [];
            }
        } catch (error) {
            console.error('Error loading applications:', error);
            this.applications = [];
        }
        
        // Load mock data for companies and jobs for now
        this.loadMockCompaniesAndJobs();
    }
    
    // Load real employer requests from API
    async loadRealEmployerRequests() {
        try {
            // Load employer requests from API
            const response = await fetch('http://localhost:5000/admin/api/employer-requests');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.employerRequests = data.requests;
                    console.log(`Loaded ${this.employerRequests.length} employer requests from API`);
                } else {
                    console.error('Failed to load employer requests:', data.error);
                    this.employerRequests = [];
                }
            } else {
                console.error('Employer requests API not available');
                this.employerRequests = [];
            }
        } catch (error) {
            console.error('Error loading employer requests:', error);
            this.employerRequests = [];
        }
    }
    
    // Load staff members from API and update UI
    async loadStaff() {
        try {
            const response = await fetch('http://localhost:5000/admin/api/staff');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.staff = data.staff;
                    console.log(`Loaded ${this.staff.length} staff members from API`);
                    
                    // Update staff table if we're on the staff section
                    if (this.currentSection === 'staff') {
                        this.updateStaffTable();
                    }
                    
                    // Update staff filter in employer requests
                    this.updateStaffFilter();
                } else {
                    console.error('Failed to load staff:', data.error);
                    this.staff = [];
                }
            } else {
                console.error('Staff API not available');
                this.staff = [];
            }
        } catch (error) {
            console.error('Error loading staff:', error);
            this.staff = [];
        }
    }

    // Update staff table display
    updateStaffTable() {
        const tbody = document.getElementById('staff-table');
        if (!tbody) return;

        let filteredStaff = this.staff;
        
        // Apply filters
        const statusFilter = document.getElementById('staff-status-filter')?.value;
        const roleFilter = document.getElementById('staff-role-filter')?.value;
        
        if (statusFilter && statusFilter !== 'all') {
            filteredStaff = filteredStaff.filter(staff => staff.status === statusFilter);
        }
        
        if (roleFilter && roleFilter !== 'all') {
            filteredStaff = filteredStaff.filter(staff => 
                staff.role.toLowerCase().includes(roleFilter.toLowerCase())
            );
        }

        tbody.innerHTML = filteredStaff.map(staff => {
            const permissions = [];
            if (staff.is_admin) permissions.push('Admin');
            if (staff.can_assign_requests) permissions.push('Can Assign');
            
            return `
                <tr>
                    <td><strong>${staff.first_name} ${staff.last_name}</strong>
                        ${staff.username ? `<br><small>@${staff.username}</small>` : ''}
                    </td>
                    <td>${staff.email}</td>
                    <td>${staff.role}</td>
                    <td>${staff.department || 'Not specified'}</td>
                    <td>
                        ${permissions.length > 0 ? 
                            permissions.map(p => `<span class="permission-badge">${p}</span>`).join(' ') :
                            '<span style="color: #999;">None</span>'
                        }
                    </td>
                    <td><span class="status-badge status-${staff.status}">${staff.status}</span></td>
                    <td>${staff.hire_date ? this.formatDate(staff.hire_date) : 'Not specified'}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary" onclick="adminPanel.viewStaff(${staff.id})">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="adminPanel.editStaff(${staff.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteStaff(${staff.id})" 
                                ${staff.is_admin ? 'disabled title="Cannot delete admin users"' : ''}>
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Update staff filter dropdown in employer requests
    updateStaffFilter() {
        const staffFilter = document.getElementById('request-assigned-filter');
        if (!staffFilter || !this.staff || this.staff.length === 0) return;

        // Get current selection to preserve it
        const currentValue = staffFilter.value;

        // Build base options
        let optionsHTML = `
            <option value="all">All Staff</option>
            <option value="unassigned">Unassigned</option>
        `;
        
        // Add staff options
        const staffOptions = this.staff
            .filter(staff => staff.status === 'active')
            .map(staff => `<option value="${staff.first_name} ${staff.last_name}">${staff.first_name} ${staff.last_name}</option>`)
            .join('');
        
        optionsHTML += staffOptions;
        staffFilter.innerHTML = optionsHTML;
        
        // Restore previous selection if it still exists
        if (currentValue && [...staffFilter.options].some(opt => opt.value === currentValue)) {
            staffFilter.value = currentValue;
        }
        
        console.log(`Staff filter updated with ${this.staff.length} staff members`);
    }

    // Staff management functions
    showAddStaffModal() {
        // Reset form and modal
        document.getElementById('add-staff-form').reset();
        document.getElementById('login-details').style.display = 'none';
        document.querySelector('#add-staff-modal .modal-header h3').innerHTML = '<i class="fas fa-user-plus"></i> Add New Staff Member';
        document.querySelector('#add-staff-form button[type="submit"]').textContent = 'Add Staff Member';
        this.editingStaffId = null;
        
        // Set default hire date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('staff-hire-date').value = today;
        
        document.getElementById('add-staff-modal').style.display = 'block';
    }

    async addStaff() {
        const form = document.getElementById('add-staff-form');
        const formData = new FormData(form);
        
        // Convert FormData to object
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (key === 'can_assign_requests' || key === 'is_admin' || key === 'create_login_account') {
                data[key] = form.querySelector(`[name="${key}"]`).checked;
            } else {
                data[key] = value;
            }
        }

        try {
            const url = this.editingStaffId ? 
                `http://localhost:5000/admin/api/staff/${this.editingStaffId}` : 
                'http://localhost:5000/admin/api/staff';
            
            const method = this.editingStaffId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.closeModal('add-staff-modal');
                    this.loadStaff(); // Refresh staff list
                    this.showNotification(
                        this.editingStaffId ? 'Staff member updated successfully!' : 'Staff member added successfully!', 
                        'success'
                    );
                } else {
                    this.showNotification(result.error || 'Failed to save staff member', 'error');
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error saving staff:', error);
            this.showNotification('Failed to save staff member. Please try again.', 'error');
        }
    }

    async viewStaff(staffId) {
        const staff = this.staff.find(s => s.id === staffId);
        if (!staff) return;

        const modal = document.getElementById('view-staff-modal');
        const detailsContainer = document.getElementById('staff-details');

        const permissions = [];
        if (staff.is_admin) permissions.push('Administrator');
        if (staff.can_assign_requests) permissions.push('Can Assign Requests');

        detailsContainer.innerHTML = `
            <div class="staff-details">
                <div class="detail-section">
                    <h4><i class="fas fa-user"></i> Personal Information</h4>
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${staff.first_name} ${staff.last_name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${staff.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${staff.phone || 'Not provided'}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-briefcase"></i> Employment Information</h4>
                    <div class="detail-row">
                        <span class="detail-label">Role:</span>
                        <span class="detail-value">${staff.role}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Department:</span>
                        <span class="detail-value">${staff.department || 'Not specified'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Hire Date:</span>
                        <span class="detail-value">${staff.hire_date ? this.formatDate(staff.hire_date) : 'Not specified'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">
                            <span class="status-badge status-${staff.status}">${staff.status}</span>
                        </span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-key"></i> Permissions & Access</h4>
                    <div class="detail-row">
                        <span class="detail-label">Login Account:</span>
                        <span class="detail-value">${staff.username ? `@${staff.username}` : 'No login account'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Permissions:</span>
                        <span class="detail-value">
                            ${permissions.length > 0 ? 
                                permissions.map(p => `<span class="permission-badge">${p}</span>`).join(' ') :
                                '<span style="color: #999;">None</span>'
                            }
                        </span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-cogs"></i> Actions</h4>
                    <div class="status-actions">
                        <button class="btn btn-primary btn-sm" onclick="adminPanel.editStaff(${staff.id})">
                            <i class="fas fa-edit"></i> Edit Staff
                        </button>
                        ${!staff.is_admin ? `
                            <button class="btn btn-danger btn-sm" onclick="adminPanel.deleteStaff(${staff.id})">
                                <i class="fas fa-trash"></i> Delete Staff
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    editStaff(staffId) {
        const staff = this.staff.find(s => s.id === staffId);
        if (!staff) return;

        // Set editing mode
        this.editingStaffId = staffId;
        
        // Fill form with staff data
        document.getElementById('staff-first-name').value = staff.first_name;
        document.getElementById('staff-last-name').value = staff.last_name;
        document.getElementById('staff-email').value = staff.email;
        document.getElementById('staff-phone').value = staff.phone || '';
        document.getElementById('staff-role').value = staff.role;
        document.getElementById('staff-department').value = staff.department || '';
        document.getElementById('staff-hire-date').value = staff.hire_date || '';
        document.getElementById('staff-status').value = staff.status;
        document.getElementById('staff-can-assign').checked = staff.can_assign_requests;
        document.getElementById('staff-is-admin').checked = staff.is_admin;
        
        // Update modal title and button text
        document.querySelector('#add-staff-modal .modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Edit Staff Member';
        document.querySelector('#add-staff-form button[type="submit"]').textContent = 'Update Staff Member';
        
        // Hide login creation section for existing staff
        document.getElementById('staff-create-login').checked = false;
        document.getElementById('login-details').style.display = 'none';
        document.getElementById('staff-create-login').closest('.form-group').style.display = 'none';
        
        // Close view modal if open
        this.closeModal('view-staff-modal');
        
        // Show edit modal
        document.getElementById('add-staff-modal').style.display = 'block';
    }

    async deleteStaff(staffId) {
        const staff = this.staff.find(s => s.id === staffId);
        if (!staff) return;

        if (staff.is_admin) {
            this.showNotification('Cannot delete administrator accounts', 'error');
            return;
        }

        if (confirm(`Are you sure you want to delete ${staff.first_name} ${staff.last_name}? This action cannot be undone.`)) {
            try {
                const response = await fetch(`http://localhost:5000/admin/api/staff/${staffId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        this.loadStaff(); // Refresh staff list
                        this.closeModal('view-staff-modal');
                        this.showNotification('Staff member deleted successfully', 'success');
                    } else {
                        this.showNotification(result.error || 'Failed to delete staff member', 'error');
                    }
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                console.error('Error deleting staff:', error);
                this.showNotification('Failed to delete staff member. Please try again.', 'error');
            }
        }
    }

    filterStaff() {
        this.updateStaffTable();
    }

    // Setup event listeners for request filters
    setupRequestFilters() {
        const statusFilter = document.getElementById('request-status-filter');
        const priorityFilter = document.getElementById('request-priority-filter');
        const assignedFilter = document.getElementById('request-assigned-filter');
        
        // Create bound handler if it doesn't exist
        if (!this.filterRequestsHandler) {
            this.filterRequestsHandler = () => this.filterRequests();
        }
        
        if (statusFilter) {
            statusFilter.removeEventListener('change', this.filterRequestsHandler);
            statusFilter.addEventListener('change', this.filterRequestsHandler);
            console.log('Status filter listener added');
        }
        
        if (priorityFilter) {
            priorityFilter.removeEventListener('change', this.filterRequestsHandler);
            priorityFilter.addEventListener('change', this.filterRequestsHandler);
            console.log('Priority filter listener added');
        }
        
        if (assignedFilter) {
            assignedFilter.removeEventListener('change', this.filterRequestsHandler);
            assignedFilter.addEventListener('change', this.filterRequestsHandler);
            console.log('Assigned filter listener added');
        }
        
        console.log('Request filter event listeners set up');
    }
    
    loadMockCompaniesAndJobs() {
        this.companies = [
            { id: 1, name: 'TechStart Inc.', industry: 'Technology', location: 'San Francisco, CA', jobs_count: 2 },
            { id: 2, name: 'GrowthCo', industry: 'Marketing Tech', location: 'New York, NY', jobs_count: 1 },
            { id: 3, name: 'FinTech Innovations', industry: 'FinTech', location: 'Chicago, IL', jobs_count: 1 },
            { id: 4, name: 'DataDriven Corp', industry: 'AI/ML', location: 'Austin, TX', jobs_count: 1 },
            { id: 5, name: 'CloudScale Systems', industry: 'Cloud Computing', location: 'Seattle, WA', jobs_count: 1 }
        ];

        this.jobs = [
            { 
                id: 1, 
                title: 'Fractional Chief Technology Officer', 
                company_id: 1, 
                company_name: 'TechStart Inc.',
                posted_date: '2024-01-15', 
                applications_count: 2, 
                status: 'active' 
            },
            { 
                id: 2, 
                title: 'Fractional Chief Marketing Officer', 
                company_id: 2, 
                company_name: 'GrowthCo',
                posted_date: '2024-01-18', 
                applications_count: 1, 
                status: 'active' 
            },
            { 
                id: 3, 
                title: 'Fractional Chief Financial Officer', 
                company_id: 3, 
                company_name: 'FinTech Innovations',
                posted_date: '2024-01-22', 
                applications_count: 1, 
                status: 'active' 
            },
            { 
                id: 4, 
                title: 'Fractional VP of Engineering', 
                company_id: 4, 
                company_name: 'DataDriven Corp',
                posted_date: '2024-01-25', 
                applications_count: 0, 
                status: 'paused' 
            }
        ];


        this.employerRequests = [
            {
                id: 1,
                company_name: 'HealthTech Innovations',
                contact_name: 'Mark Johnson',
                email: 'mark@healthtech.com',
                phone: '+1-555-0201',
                role_type: 'Executive',
                time_commitment: '20-30 hours',
                timeline: '1-2 weeks',
                budget_range: '150-200',
                priority: 'high',
                status: 'new',
                assigned_to: '',
                requirements: 'We are seeking a seasoned healthcare executive to serve as our fractional Chief Medical Officer. The ideal candidate will have:\n\n• 10+ years of clinical leadership experience\n• Experience with digital health platforms and telemedicine\n• Strong regulatory knowledge (FDA, HIPAA compliance)\n• Track record of scaling healthcare operations\n• Medical degree with active license preferred\n\nResponsibilities will include:\n• Developing clinical protocols and guidelines\n• Ensuring regulatory compliance across all products\n• Leading clinical advisory board\n• Supporting product development with clinical insights\n• Establishing partnerships with healthcare providers\n\nThis is a great opportunity to shape the future of digital healthcare while maintaining flexibility in your schedule.',
                notes: 'Initial contact made via website form. Company is well-funded Series B startup.',
                created_at: '2024-02-01 10:30:00'
            },
            {
                id: 2,
                company_name: 'FinanceFlow',
                contact_name: 'Sandra Kim',
                email: 'sandra@financeflow.com',
                phone: '+1-555-0202',
                role_type: 'Executive',
                time_commitment: '15-20 hours',
                timeline: 'immediate',
                budget_range: '180-250',
                priority: 'urgent',
                status: 'contacted',
                assigned_to: 'recruiter1',
                requirements: 'Seeking a fractional CFO for our fast-growing fintech startup. We need someone who can:\n\n• Lead financial planning and analysis\n• Prepare for Series C funding round\n• Establish robust financial controls\n• Manage investor relations\n• Build scalable finance operations\n\nRequired qualifications:\n• CPA with Big 4 experience\n• 8+ years of finance leadership in fintech/SaaS\n• Experience with venture funding rounds\n• Strong Excel/financial modeling skills\n• Familiarity with fintech regulations\n\nWe are preparing for a $50M Series C and need someone who can help us present compelling financials to investors while building the foundation for future growth.',
                notes: 'Spoke with Sandra on 2/3. Very interested, budget is flexible for right candidate. Meeting scheduled for next week.',
                created_at: '2024-02-02 14:15:00'
            },
            {
                id: 3,
                company_name: 'EcoTech Solutions',
                contact_name: 'David Chen',
                email: 'david@ecotech.com',
                phone: '+1-555-0203',
                role_type: 'Technology',
                time_commitment: '25-30 hours',
                timeline: '1 month',
                budget_range: '120-180',
                priority: 'medium',
                status: 'in_progress',
                assigned_to: 'manager1',
                requirements: 'Looking for a fractional CTO to help scale our clean energy platform. Key needs:\n\n• Oversee technical architecture for IoT platform\n• Lead team of 12 engineers\n• Implement DevOps and CI/CD practices\n• Make build vs buy decisions for key components\n• Establish technical roadmap aligned with business goals\n\nRequired experience:\n• 10+ years of technology leadership\n• Experience with IoT and edge computing\n• Cloud platforms (AWS/Azure preferred)\n• Team leadership and mentoring experience\n• Previous experience in cleantech/sustainability sector preferred\n\nWe have a solid MVP and early customers, but need senior technical leadership to scale efficiently and maintain code quality as we grow.',
                notes: 'Currently interviewing candidates. David is technical himself (former engineer) so looking for someone with deep expertise.',
                created_at: '2024-01-28 09:45:00'
            },
            {
                id: 4,
                company_name: 'RetailNext',
                contact_name: 'Lisa Martinez',
                email: 'lisa@retailnext.com',
                phone: '+1-555-0204',
                role_type: 'Marketing',
                time_commitment: '20-25 hours',
                timeline: 'flexible',
                budget_range: '100-150',
                priority: 'medium',
                status: 'matched',
                assigned_to: 'recruiter2',
                requirements: 'Seeking fractional CMO for e-commerce retail platform. Responsibilities include:\n\n• Develop comprehensive marketing strategy\n• Lead digital marketing initiatives (SEO, SEM, social)\n• Build brand awareness in competitive retail space\n• Optimize customer acquisition and retention\n• Manage marketing budget and ROI analysis\n\nIdeal candidate profile:\n• 8+ years of marketing leadership in e-commerce/retail\n• Strong digital marketing background\n• Experience with D2C brands\n• Data-driven approach to marketing\n• Previous fractional/consulting experience preferred\n\nWe are a bootstrapped company looking to scale efficiently. Need someone who can maximize impact with limited budget while building foundation for future growth.',
                notes: 'Matched with Emily Rodriguez from our candidate pool. Contract negotiation in progress.',
                created_at: '2024-01-25 16:20:00'
            }
        ];
    }

    // Navigation
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');
        
        // Add active class to nav item
        document.querySelector(`a[onclick="showSection('${sectionName}')"]`).parentElement.classList.add('active');

        this.currentSection = sectionName;

        // Load section data
        switch(sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'companies':
                this.loadCompanies();
                break;
            case 'jobs':
                this.loadJobs();
                break;
            case 'applications':
                this.loadApplications();
                break;
            case 'staff':
                this.loadStaff();
                break;
            case 'employer-requests':
                // Use setTimeout to ensure DOM elements are ready
                setTimeout(() => {
                    this.updateStaffFilter(); // Ensure staff filter is populated
                    this.setupRequestFilters(); // Setup filter event listeners
                    this.loadEmployerRequests();
                }, 50);
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }

    // Dashboard
    loadDashboard() {
        // Update stats
        document.getElementById('total-companies').textContent = this.companies.length;
        document.getElementById('active-jobs').textContent = this.jobs.filter(j => j.status === 'active').length;
        document.getElementById('total-applications').textContent = this.applications.length;
        document.getElementById('pending-requests').textContent = this.employerRequests.filter(r => r.status === 'new').length;

        // Load recent applications
        const recentApplications = this.applications
            .sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at))
            .slice(0, 5);

        const recentContainer = document.getElementById('recent-applications');
        recentContainer.innerHTML = recentApplications.map(app => `
            <div class="activity-item">
                <strong>${app.first_name} ${app.last_name}</strong> applied to 
                <strong>${app.job_title}</strong> at ${app.company_name}
                <br><small>${this.formatDate(app.applied_at)} - Status: ${app.status}</small>
            </div>
        `).join('');

        // Load urgent requests
        const urgentRequests = this.employerRequests
            .filter(req => req.priority === 'urgent' || req.priority === 'high')
            .slice(0, 5);

        const urgentContainer = document.getElementById('urgent-requests');
        urgentContainer.innerHTML = urgentRequests.map(req => `
            <div class="activity-item">
                <strong>${req.company_name}</strong> needs ${req.role_type} talent
                <br><small>Priority: ${req.priority} - ${this.formatDate(req.created_at)}</small>
            </div>
        `).join('');
    }

    // Companies Management
    loadCompanies() {
        const tbody = document.getElementById('companies-table');
        tbody.innerHTML = this.companies.map(company => `
            <tr>
                <td><strong>${company.name}</strong></td>
                <td>${company.industry || 'Not specified'}</td>
                <td>${company.location || 'Not specified'}</td>
                <td>${company.jobs_count}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminPanel.editCompany(${company.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteCompany(${company.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    showAddCompanyModal() {
        // Only reset if not in editing mode
        if (!this.editingCompanyId) {
            this.resetCompanyModal();
        }
        document.getElementById('add-company-modal').style.display = 'block';
    }

    resetCompanyModal() {
        // Reset modal for adding new company
        this.editingCompanyId = null;
        document.querySelector('#add-company-modal .modal-header h3').innerHTML = '<i class="fas fa-building"></i> Add New Company';
        document.querySelector('#add-company-form button[type="submit"]').textContent = 'Add Company';
    }

    addCompany() {
        const form = document.getElementById('add-company-form');
        const formData = new FormData(form);
        
        if (this.editingCompanyId) {
            // Update existing company
            const company = this.companies.find(c => c.id === this.editingCompanyId);
            if (company) {
                company.name = formData.get('name');
                company.industry = formData.get('industry');
                company.location = formData.get('location');
                company.website = formData.get('website');
                company.size = formData.get('size');
                company.founded_year = formData.get('founded_year');
                company.description = formData.get('description');
                company.logo_url = formData.get('logo_url');
            }
            this.showNotification('Company updated successfully!', 'success');
            this.editingCompanyId = null;
        } else {
            // Add new company
            const newCompany = {
                id: Math.max(...this.companies.map(c => c.id)) + 1,
                name: formData.get('name'),
                industry: formData.get('industry'),
                location: formData.get('location'),
                website: formData.get('website'),
                size: formData.get('size'),
                founded_year: formData.get('founded_year'),
                description: formData.get('description'),
                logo_url: formData.get('logo_url'),
                jobs_count: 0
            };

            this.companies.push(newCompany);
            this.showNotification('Company added successfully!', 'success');
        }

        this.closeModal('add-company-modal');
        this.loadCompanies();
        form.reset();
        
        // Reset modal for adding
        this.resetCompanyModal();
    }

    editCompany(companyId) {
        const company = this.companies.find(c => c.id === companyId);
        if (company) {
            // Set editing mode
            this.editingCompanyId = companyId;
            
            // Pre-fill form with company data
            document.getElementById('company-name').value = company.name;
            document.getElementById('company-industry').value = company.industry || '';
            document.getElementById('company-location').value = company.location || '';
            document.getElementById('company-website').value = company.website || '';
            document.getElementById('company-size').value = company.size || '';
            document.getElementById('company-founded').value = company.founded_year || '';
            document.getElementById('company-description').value = company.description || '';
            document.getElementById('company-logo').value = company.logo_url || '';
            
            // Update modal title and button text
            document.querySelector('#add-company-modal .modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Edit Company';
            document.querySelector('#add-company-form button[type="submit"]').textContent = 'Update Company';
            
            this.showAddCompanyModal();
        }
    }

    deleteCompany(companyId) {
        if (confirm('Are you sure you want to delete this company? This will also delete all associated jobs.')) {
            this.companies = this.companies.filter(c => c.id !== companyId);
            this.jobs = this.jobs.filter(j => j.company_id !== companyId);
            this.loadCompanies();
            this.showNotification('Company deleted successfully!', 'success');
        }
    }

    // Jobs Management
    loadJobs() {
        // Load companies for job form
        const companySelect = document.getElementById('job-company');
        companySelect.innerHTML = '<option value="">Select Company</option>' + 
            this.companies.map(company => `<option value="${company.id}">${company.name}</option>`).join('');

        // Load job application filters
        const jobFilter = document.getElementById('application-job-filter');
        if (jobFilter) {
            jobFilter.innerHTML = '<option value="all">All Jobs</option>' + 
                this.jobs.map(job => `<option value="${job.id}">${job.title}</option>`).join('');
        }

        // Load jobs table
        const tbody = document.getElementById('jobs-table');
        let filteredJobs = this.jobs;
        
        const statusFilter = document.getElementById('job-status-filter').value;
        if (statusFilter !== 'all') {
            filteredJobs = filteredJobs.filter(job => job.status === statusFilter);
        }

        tbody.innerHTML = filteredJobs.map(job => {
            // Find the company name by company_id
            const company = this.companies.find(c => c.id === job.company_id);
            const companyName = company ? company.name : 'Unknown Company';
            
            return `
            <tr>
                <td><strong>${job.title}</strong></td>
                <td>${companyName}</td>
                <td>${this.formatDate(job.posted_date)}</td>
                <td>${job.applications_count}</td>
                <td><span class="status-badge status-${job.status}">${job.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminPanel.editJob(${job.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="adminPanel.toggleJobStatus(${job.id})">
                        <i class="fas fa-pause"></i> ${job.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteJob(${job.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
        }).join('');
    }

    showAddJobModal() {
        // Only reset if not in editing mode
        if (!this.editingJobId) {
            this.resetJobModal();
        }
        document.getElementById('add-job-modal').style.display = 'block';
    }

    resetJobModal() {
        // Reset modal for adding new job
        this.editingJobId = null;
        document.querySelector('#add-job-modal .modal-header h3').innerHTML = '<i class="fas fa-briefcase"></i> Post New Job';
        document.querySelector('#add-job-form button[type="submit"]').textContent = 'Post Job';
    }

    addJob() {
        const form = document.getElementById('add-job-form');
        const formData = new FormData(form);
        
        const companyId = parseInt(formData.get('company_id'));
        const company = this.companies.find(c => c.id === companyId);
        
        if (this.editingJobId) {
            // Update existing job
            const job = this.jobs.find(j => j.id === this.editingJobId);
            if (job) {
                const oldCompanyId = job.company_id;
                const oldCompany = this.companies.find(c => c.id === oldCompanyId);
                
                job.title = formData.get('title');
                job.company_id = companyId;
                job.company_name = company ? company.name : 'Unknown Company';
                job.job_type = formData.get('job_type');
                job.location = formData.get('location');
                job.is_remote = formData.get('is_remote') === 'true';
                job.experience_level = formData.get('experience_level');
                job.hours_per_week = formData.get('hours_per_week');
                job.duration = formData.get('duration');
                job.salary_min = parseInt(formData.get('salary_min')) || null;
                job.salary_max = parseInt(formData.get('salary_max')) || null;
                job.salary_type = formData.get('salary_type');
                job.application_deadline = formData.get('application_deadline');
                job.description = formData.get('description');
                job.requirements = formData.get('requirements');
                job.responsibilities = formData.get('responsibilities');
                job.benefits = formData.get('benefits');
                
                // Update company job counts if company changed
                if (oldCompanyId !== companyId) {
                    if (oldCompany) oldCompany.jobs_count--;
                    if (company) company.jobs_count++;
                }
            }
            this.showNotification('Job updated successfully!', 'success');
            this.editingJobId = null;
        } else {
            // Add new job
            const newJob = {
                id: Math.max(...this.jobs.map(j => j.id)) + 1,
                title: formData.get('title'),
                company_id: companyId,
                company_name: company ? company.name : 'Unknown Company',
                posted_date: new Date().toISOString().split('T')[0],
                applications_count: 0,
                status: 'active',
                job_type: formData.get('job_type'),
                location: formData.get('location'),
                is_remote: formData.get('is_remote') === 'true',
                experience_level: formData.get('experience_level'),
                hours_per_week: formData.get('hours_per_week'),
                duration: formData.get('duration'),
                salary_min: parseInt(formData.get('salary_min')) || null,
                salary_max: parseInt(formData.get('salary_max')) || null,
                salary_type: formData.get('salary_type'),
                application_deadline: formData.get('application_deadline'),
                description: formData.get('description'),
                requirements: formData.get('requirements'),
                responsibilities: formData.get('responsibilities'),
                benefits: formData.get('benefits')
            };

            this.jobs.push(newJob);
            
            // Update company job count
            if (company) {
                company.jobs_count++;
            }
            
            this.showNotification('Job posted successfully!', 'success');
        }

        this.closeModal('add-job-modal');
        this.loadJobs();
        form.reset();
        
        // Reset modal for adding
        this.resetJobModal();
    }

    filterJobs() {
        this.loadJobs();
    }

    toggleJobStatus(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (job) {
            job.status = job.status === 'active' ? 'paused' : 'active';
            this.loadJobs();
            this.showNotification(`Job ${job.status === 'active' ? 'activated' : 'paused'} successfully!`, 'success');
        }
    }

    editJob(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (job) {
            // Set editing mode
            this.editingJobId = jobId;
            
            // Pre-fill form with job data
            document.getElementById('job-title').value = job.title;
            document.getElementById('job-company').value = job.company_id;
            document.getElementById('job-type').value = job.job_type;
            document.getElementById('job-location').value = job.location || '';
            document.getElementById('job-remote').value = job.is_remote ? 'true' : 'false';
            document.getElementById('job-experience').value = job.experience_level || '';
            document.getElementById('job-hours').value = job.hours_per_week || '';
            document.getElementById('job-duration').value = job.duration || '';
            document.getElementById('job-salary-min').value = job.salary_min || '';
            document.getElementById('job-salary-max').value = job.salary_max || '';
            document.getElementById('job-salary-type').value = job.salary_type || 'hourly';
            document.getElementById('job-deadline').value = job.application_deadline || '';
            document.getElementById('job-description').value = job.description || '';
            document.getElementById('job-requirements').value = job.requirements || '';
            document.getElementById('job-responsibilities').value = job.responsibilities || '';
            document.getElementById('job-benefits').value = job.benefits || '';
            
            // Update modal title and button text
            document.querySelector('#add-job-modal .modal-header h3').innerHTML = '<i class="fas fa-edit"></i> Edit Job';
            document.querySelector('#add-job-form button[type="submit"]').textContent = 'Update Job';
            
            this.showAddJobModal();
        }
    }

    deleteJob(jobId) {
        if (confirm('Are you sure you want to delete this job? This will also delete all associated applications.')) {
            const job = this.jobs.find(j => j.id === jobId);
            if (job) {
                const company = this.companies.find(c => c.id === job.company_id);
                if (company) {
                    company.jobs_count--;
                }
            }
            
            this.jobs = this.jobs.filter(j => j.id !== jobId);
            this.applications = this.applications.filter(a => a.job_id !== jobId);
            this.loadJobs();
            this.showNotification('Job deleted successfully!', 'success');
        }
    }

    // Applications Management
    loadApplications() {
        const tbody = document.getElementById('applications-table');
        let filteredApplications = this.applications;
        
        const statusFilter = document.getElementById('application-status-filter').value;
        const jobFilter = document.getElementById('application-job-filter').value;
        
        if (statusFilter !== 'all') {
            filteredApplications = filteredApplications.filter(app => app.status === statusFilter);
        }
        
        if (jobFilter !== 'all') {
            filteredApplications = filteredApplications.filter(app => app.job_id == jobFilter);
        }

        tbody.innerHTML = filteredApplications.map(app => `
            <tr>
                <td><strong>${app.first_name} ${app.last_name}</strong><br><small>${app.email}</small></td>
                <td>${app.job_title}</td>
                <td>${app.company_name}</td>
                <td>${this.formatDate(app.applied_at)}</td>
                <td><span class="status-badge status-${app.status}">${app.status}</span></td>
                <td>${this.renderRating(app.rating)}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminPanel.viewApplication(${app.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <div class="dropdown" style="display: inline-block;">
                        <select onchange="adminPanel.updateApplicationStatus(${app.id}, this.value)" style="padding: 4px 8px; font-size: 0.8rem;">
                            <option value="">Change Status</option>
                            <option value="submitted" ${app.status === 'submitted' ? 'selected' : ''}>Submitted</option>
                            <option value="reviewed" ${app.status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
                            <option value="interviewing" ${app.status === 'interviewing' ? 'selected' : ''}>Interviewing</option>
                            <option value="shortlisted" ${app.status === 'shortlisted' ? 'selected' : ''}>Shortlisted</option>
                            <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                            <option value="hired" ${app.status === 'hired' ? 'selected' : ''}>Hired</option>
                        </select>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    filterApplications() {
        this.loadApplications();
    }

    viewApplication(applicationId) {
        const app = this.applications.find(a => a.id === applicationId);
        if (!app) return;

        const modal = document.getElementById('view-application-modal');
        const detailsContainer = document.getElementById('application-details');

        detailsContainer.innerHTML = `
            <div class="application-details">
                <div class="detail-section">
                    <h4><i class="fas fa-user"></i> Candidate Information</h4>
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${app.first_name} ${app.last_name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${app.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${app.phone || 'Not provided'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Applied:</span>
                        <span class="detail-value">${this.formatDate(app.applied_at)}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-briefcase"></i> Job Information</h4>
                    <div class="detail-row">
                        <span class="detail-label">Position:</span>
                        <span class="detail-value">${app.job_title}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Company:</span>
                        <span class="detail-value">${app.company_name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">
                            <span class="status-badge status-${app.status}">${app.status}</span>
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Rating:</span>
                        <span class="detail-value">${this.renderRating(app.rating)}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4><i class="fas fa-file-text"></i> Cover Letter</h4>
                <div class="cover-letter-content">${app.cover_letter || 'No cover letter provided'}</div>
                <button class="btn btn-secondary btn-sm" onclick="adminPanel.downloadCoverLetter(${app.id})">
                    <i class="fas fa-download"></i> Download Cover Letter
                </button>
            </div>

            <div class="detail-section">
                <h4><i class="fas fa-file-pdf"></i> Resume</h4>
                ${app.resume_filename ? `
                    <div class="resume-info">
                        <p><strong>File:</strong> ${app.resume_filename}</p>
                        <p><strong>Size:</strong> ${this.formatFileSize(app.resume_file_size)}</p>
                        <p><strong>Uploaded:</strong> ${this.formatDate(app.applied_at)}</p>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="adminPanel.downloadResume(${app.id})">
                        <i class="fas fa-download"></i> Download Resume
                    </button>
                ` : '<p>No resume uploaded</p>'}
            </div>

            <div class="detail-section">
                <h4><i class="fas fa-cogs"></i> Status Actions</h4>
                <div class="status-actions">
                    <button class="btn btn-success btn-sm" onclick="adminPanel.updateApplicationStatus(${app.id}, 'reviewed')">
                        Mark as Reviewed
                    </button>
                    <button class="btn btn-info btn-sm" onclick="adminPanel.updateApplicationStatus(${app.id}, 'interviewing')">
                        Schedule Interview
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="adminPanel.updateApplicationStatus(${app.id}, 'shortlisted')">
                        Add to Shortlist
                    </button>
                    <button class="btn btn-success btn-sm" onclick="adminPanel.updateApplicationStatus(${app.id}, 'hired')">
                        Hire Candidate
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="adminPanel.updateApplicationStatus(${app.id}, 'rejected')">
                        Reject Application
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    updateApplicationStatus(applicationId, newStatus) {
        if (!newStatus) return;
        
        const app = this.applications.find(a => a.id === applicationId);
        if (app) {
            app.status = newStatus;
            this.loadApplications();
            this.closeModal('view-application-modal');
            this.showNotification(`Application status updated to ${newStatus}`, 'success');
        }
    }

    // Employer Requests Management
    async loadEmployerRequests() {
        try {
            // Wait a bit to ensure DOM elements are available
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Get filter values with safe fallbacks
            const statusFilter = document.getElementById('request-status-filter')?.value || 'all';
            const priorityFilter = document.getElementById('request-priority-filter')?.value || 'all';
            const assignedFilter = document.getElementById('request-assigned-filter')?.value || 'all';
            
            console.log(`Loading employer requests with filters: status=${statusFilter}, priority=${priorityFilter}, assigned=${assignedFilter}`);
            
            // Build query parameters
            const params = new URLSearchParams();
            if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
            if (priorityFilter && priorityFilter !== 'all') params.append('priority', priorityFilter);
            if (assignedFilter && assignedFilter !== 'all') params.append('assigned_staff', assignedFilter);
            
            const url = `http://localhost:5000/admin/api/employer-requests${params.toString() ? '?' + params.toString() : ''}`;
            console.log(`Fetching: ${url}`);
            
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.employerRequests = data.requests;
                    console.log(`Loaded ${this.employerRequests.length} employer requests from API with filters`);
                    this.updateEmployerRequestsTable();
                } else {
                    console.error('Failed to load employer requests:', data.error);
                    this.employerRequests = [];
                    this.updateEmployerRequestsTable();
                }
            } else {
                console.error('Employer requests API not available');
                this.employerRequests = [];
                this.updateEmployerRequestsTable();
            }
        } catch (error) {
            console.error('Error loading employer requests:', error);
            // Fall back to empty data
            this.employerRequests = [];
            this.updateEmployerRequestsTable();
        }
    }

    updateEmployerRequestsTable() {
        const tbody = document.getElementById('requests-table');
        if (!tbody) return;

        tbody.innerHTML = this.employerRequests.map(req => `
            <tr>
                <td><strong>${req.company_name}</strong></td>
                <td>${req.contact_name}<br><small>${req.email}</small></td>
                <td>${req.role_type}</td>
                <td><span class="status-badge priority-${req.priority}">${req.priority}</span></td>
                <td><span class="status-badge status-${req.status}">${req.status}</span></td>
                <td>${req.assigned_to || '<span style="color: #999;">Unassigned</span>'}</td>
                <td>${this.formatDate(req.created_at)}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminPanel.viewRequest(${req.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="adminPanel.assignRequest(${req.id})" style="margin-left: 5px;">
                        <i class="fas fa-user-plus"></i> ${req.assigned_to ? 'Reassign' : 'Assign'}
                    </button>
                    <select onchange="adminPanel.updateRequestStatus(${req.id}, this.value)" style="padding: 4px 8px; font-size: 0.8rem; margin-left: 5px;">
                        <option value="">Status</option>
                        <option value="new" ${req.status === 'new' ? 'selected' : ''}>New</option>
                        <option value="contacted" ${req.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="in_progress" ${req.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                        <option value="matched" ${req.status === 'matched' ? 'selected' : ''}>Matched</option>
                        <option value="closed" ${req.status === 'closed' ? 'selected' : ''}>Closed</option>
                    </select>
                </td>
            </tr>
        `).join('');
    }

    filterRequests() {
        console.log('filterRequests() called');
        const statusFilter = document.getElementById('request-status-filter')?.value;
        const priorityFilter = document.getElementById('request-priority-filter')?.value;
        const assignedFilter = document.getElementById('request-assigned-filter')?.value;
        console.log(`Filter values: status=${statusFilter}, priority=${priorityFilter}, assigned=${assignedFilter}`);
        this.loadEmployerRequests();
    }

    viewRequest(requestId) {
        const request = this.employerRequests.find(r => r.id === requestId);
        if (!request) return;

        const modal = document.getElementById('view-request-modal');
        const detailsContainer = document.getElementById('request-details');

        detailsContainer.innerHTML = `
            <div class="application-details">
                <div class="detail-section">
                    <h4><i class="fas fa-building"></i> Company Information</h4>
                    <div class="detail-row">
                        <span class="detail-label">Company:</span>
                        <span class="detail-value"><strong>${request.company_name}</strong></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Contact:</span>
                        <span class="detail-value">${request.contact_name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${request.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${request.phone || 'Not provided'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Submitted:</span>
                        <span class="detail-value">${this.formatDate(request.created_at)}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-briefcase"></i> Role Information</h4>
                    <div class="detail-row">
                        <span class="detail-label">Role Type:</span>
                        <span class="detail-value">${request.role_type}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Commitment:</span>
                        <span class="detail-value">${request.time_commitment}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Timeline:</span>
                        <span class="detail-value">${request.timeline}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Budget:</span>
                        <span class="detail-value">$${request.budget_range}/hour</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">
                            <span class="status-badge status-${request.status}">${request.status}</span>
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Priority:</span>
                        <span class="detail-value">
                            <span class="status-badge priority-${request.priority}">${request.priority}</span>
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Assigned To:</span>
                        <span class="detail-value">${request.assigned_to || 'Unassigned'}</span>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h4><i class="fas fa-list-ul"></i> Requirements & Description</h4>
                <div class="cover-letter-content">${request.requirements}</div>
            </div>

            ${request.notes ? `
                <div class="detail-section">
                    <h4><i class="fas fa-sticky-note"></i> Internal Notes</h4>
                    <div class="cover-letter-content">${request.notes}</div>
                    <button class="btn btn-secondary btn-sm" onclick="adminPanel.editRequestNotes(${request.id})">
                        <i class="fas fa-edit"></i> Edit Notes
                    </button>
                </div>
            ` : `
                <div class="detail-section">
                    <h4><i class="fas fa-sticky-note"></i> Internal Notes</h4>
                    <p><em>No notes added yet</em></p>
                    <button class="btn btn-secondary btn-sm" onclick="adminPanel.addRequestNotes(${request.id})">
                        <i class="fas fa-plus"></i> Add Notes
                    </button>
                </div>
            `}

            <div class="detail-section">
                <h4><i class="fas fa-cogs"></i> Actions</h4>
                <div class="status-actions">
                    <button class="btn btn-success btn-sm" onclick="adminPanel.updateRequestStatus(${request.id}, 'contacted')">
                        Mark as Contacted
                    </button>
                    <button class="btn btn-info btn-sm" onclick="adminPanel.updateRequestStatus(${request.id}, 'in_progress')">
                        Start Progress
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="adminPanel.updateRequestStatus(${request.id}, 'matched')">
                        Mark as Matched
                    </button>
                    <button class="btn btn-success btn-sm" onclick="adminPanel.updateRequestStatus(${request.id}, 'closed')">
                        Close Request
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="adminPanel.assignRequest(${request.id})">
                        <i class="fas fa-user-plus"></i> Assign Staff
                    </button>
                    <button class="btn btn-info btn-sm" onclick="adminPanel.contactEmployer(${request.id})">
                        <i class="fas fa-envelope"></i> Contact Employer
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    updateRequestStatus(requestId, newStatus) {
        if (!newStatus) return;
        
        const request = this.employerRequests.find(r => r.id === requestId);
        if (request) {
            request.status = newStatus;
            this.loadEmployerRequests();
            this.closeModal('view-request-modal');
            this.showNotification(`Request status updated to ${newStatus}`, 'success');
        }
    }

    async assignRequest(requestId) {
        if (this.staff.length === 0) {
            this.showNotification('No staff members loaded. Please refresh the page.', 'error');
            return;
        }

        const request = this.employerRequests.find(r => r.id === requestId);
        if (!request) {
            this.showNotification('Request not found.', 'error');
            return;
        }

        // Create assignment modal
        const modalHtml = `
            <div id="assign-request-modal" class="modal" style="display: block;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-user-plus"></i> Assign Request to Staff</h3>
                        <span class="close" onclick="adminPanel.closeModal('assign-request-modal')">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="assignment-details">
                            <h4><i class="fas fa-building"></i> Request Details</h4>
                            <p><strong>Company:</strong> ${request.company_name}</p>
                            <p><strong>Role:</strong> ${request.role_type}</p>
                            <p><strong>Priority:</strong> <span class="status-badge priority-${request.priority}">${request.priority}</span></p>
                            <p><strong>Current Assignment:</strong> ${request.assigned_to || 'Unassigned'}</p>
                        </div>
                        
                        <div class="staff-selection">
                            <h4><i class="fas fa-users"></i> Select Staff Member</h4>
                            <select id="staff-select" class="form-control" style="margin: 10px 0; padding: 8px; width: 100%;">
                                <option value="">-- Select Staff Member --</option>
                                ${this.staff.map(staff => `
                                    <option value="${staff.id}" ${request.assigned_to === `${staff.first_name} ${staff.last_name}` ? 'selected' : ''}>
                                        ${staff.first_name} ${staff.last_name} - ${staff.role}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="assignment-note">
                            <h4><i class="fas fa-sticky-note"></i> Assignment Note (Optional)</h4>
                            <textarea id="assignment-note" class="form-control" 
                                placeholder="Add any notes about this assignment..." 
                                style="width: 100%; min-height: 80px; margin: 10px 0; padding: 8px;"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="adminPanel.closeModal('assign-request-modal')">
                            Cancel
                        </button>
                        <button type="button" class="btn btn-primary" onclick="adminPanel.confirmAssignment(${requestId})">
                            <i class="fas fa-check"></i> Assign Request
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if present
        const existingModal = document.getElementById('assign-request-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    async confirmAssignment(requestId) {
        const staffSelect = document.getElementById('staff-select');
        const assignmentNote = document.getElementById('assignment-note');
        
        if (!staffSelect.value) {
            this.showNotification('Please select a staff member.', 'warning');
            return;
        }

        const selectedStaff = this.staff.find(staff => staff.id == staffSelect.value);
        if (!selectedStaff) {
            this.showNotification('Selected staff member not found.', 'error');
            return;
        }

        try {
            // Make API call to assign the request
            const response = await fetch(`http://localhost:5000/admin/api/employer-requests/${requestId}/assign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    staff_id: selectedStaff.id,
                    staff_name: `${selectedStaff.first_name} ${selectedStaff.last_name}`,
                    assignment_note: assignmentNote.value || null
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Update local data
                    const request = this.employerRequests.find(r => r.id === requestId);
                    if (request) {
                        request.assigned_to = `${selectedStaff.first_name} ${selectedStaff.last_name}`;
                    }

                    // Close modal and refresh views
                    this.closeModal('assign-request-modal');
                    this.loadEmployerRequests(); // Refresh the table
                    
                    // If request details modal is open, refresh it too
                    const requestModal = document.getElementById('view-request-modal');
                    if (requestModal && requestModal.style.display === 'block') {
                        this.viewRequest(requestId);
                    }

                    this.showNotification(`Request successfully assigned to ${selectedStaff.first_name} ${selectedStaff.last_name}`, 'success');
                } else {
                    this.showNotification(data.error || 'Failed to assign request', 'error');
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error assigning request:', error);
            this.showNotification('Failed to assign request. Please try again.', 'error');
        }
    }

    contactEmployer(requestId) {
        const request = this.employerRequests.find(r => r.id === requestId);
        if (request) {
            // Simulate opening email client
            const subject = `Re: ${request.role_type} Position Request - Flexi-Careers`;
            const body = `Hi ${request.contact_name},

Thank you for your interest in finding fractional talent through Flexi-Careers.

I wanted to follow up on your request for a ${request.role_type} role. We have received your requirements and are currently reviewing potential candidates from our network.

Based on your specifications:
- Role Type: ${request.role_type}
- Time Commitment: ${request.time_commitment}
- Budget Range: $${request.budget_range}/hour
- Timeline: ${request.timeline}

I will be in touch within the next 24-48 hours with potential candidate profiles that match your requirements.

Best regards,
Flexi-Careers Team`;

            const mailtoLink = `mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(mailtoLink);
            
            this.showNotification('Email client opened', 'success');
        }
    }

    addRequestNotes(requestId) {
        const notes = prompt('Add internal notes for this request:');
        if (notes) {
            const request = this.employerRequests.find(r => r.id === requestId);
            if (request) {
                request.notes = notes;
                this.showNotification('Notes added successfully', 'success');
                this.viewRequest(requestId); // Refresh the view
            }
        }
    }

    editRequestNotes(requestId) {
        const request = this.employerRequests.find(r => r.id === requestId);
        if (request) {
            const notes = prompt('Edit internal notes:', request.notes);
            if (notes !== null) {
                request.notes = notes;
                this.showNotification('Notes updated successfully', 'success');
                this.viewRequest(requestId); // Refresh the view
            }
        }
    }

    // Analytics
    loadAnalytics() {
        // Application status distribution
        const statusStats = {};
        this.applications.forEach(app => {
            statusStats[app.status] = (statusStats[app.status] || 0) + 1;
        });

        document.getElementById('status-chart').innerHTML = Object.entries(statusStats)
            .map(([status, count]) => `
                <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #eee;">
                    <span class="status-badge status-${status}">${status}</span>
                    <strong>${count}</strong>
                </div>
            `).join('');

        // Popular jobs
        const jobStats = this.jobs
            .sort((a, b) => b.applications_count - a.applications_count)
            .slice(0, 5);

        document.getElementById('popular-jobs').innerHTML = jobStats
            .map(job => `
                <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #eee;">
                    <span>${job.title}</span>
                    <strong>${job.applications_count} apps</strong>
                </div>
            `).join('');

        // Skills demand (mock data)
        const skillsData = [
            { skill: 'Leadership', count: 8 },
            { skill: 'Strategy', count: 6 },
            { skill: 'Python', count: 4 },
            { skill: 'AWS', count: 3 },
            { skill: 'Marketing', count: 3 }
        ];

        document.getElementById('skills-demand').innerHTML = skillsData
            .map(item => `
                <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #eee;">
                    <span>${item.skill}</span>
                    <strong>${item.count} jobs</strong>
                </div>
            `).join('');

        // Traffic stats (mock data)
        document.getElementById('traffic-stats').innerHTML = `
            <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #eee;">
                <span>Page Views</span>
                <strong>1,234</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #eee;">
                <span>Job Views</span>
                <strong>456</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #eee;">
                <span>Applications</span>
                <strong>78</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px;">
                <span>Contact Forms</span>
                <strong>12</strong>
            </div>
        `;
    }

    // Download functions
    downloadResume(applicationId) {
        const app = this.applications.find(a => a.id === applicationId);
        if (!app || !app.resume_filename) {
            this.showNotification('No resume file available', 'warning');
            return;
        }

        // Download the actual uploaded resume file
        const fileUrl = `http://localhost:5000/uploads/resumes/${app.resume_filename}`;
        
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = app.resume_filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('Resume download started!', 'success');
    }

    downloadCoverLetter(applicationId) {
        const app = this.applications.find(a => a.id === applicationId);
        if (!app || !app.cover_letter) {
            this.showNotification('No cover letter available', 'warning');
            return;
        }

        const filename = `${app.first_name}_${app.last_name}_Cover_Letter.txt`;
        const content = `Cover Letter\n${'='.repeat(50)}\n\nCandidate: ${app.first_name} ${app.last_name}\nEmail: ${app.email}\nPhone: ${app.phone || 'Not provided'}\nPosition: ${app.job_title}\nCompany: ${app.company_name}\nApplied: ${app.applied_at}\n\n${'='.repeat(50)}\n\n${app.cover_letter}`;
        
        this.downloadFile(content, filename, 'text/plain');
        
        this.showNotification('Cover letter downloaded successfully!', 'success');
    }

    generateSamplePDF(app, type) {
        // Generate sample PDF-like content (in real implementation, this would be actual PDF generation)
        const content = type === 'resume' ? 
            `${app.first_name} ${app.last_name} - Resume
${'='.repeat(50)}

CONTACT INFORMATION
Email: ${app.email}
Phone: ${app.phone || 'Not provided'}

PROFESSIONAL EXPERIENCE
• Senior Technology Leader with 15+ years experience
• Led engineering teams of 50+ developers
• Scaled systems to serve millions of users
• Expert in cloud architecture and DevOps practices

TECHNICAL SKILLS
• Languages: JavaScript, Python, Java, Go
• Cloud Platforms: AWS, GCP, Azure
• Databases: PostgreSQL, MongoDB, Redis
• DevOps: Docker, Kubernetes, CI/CD

EDUCATION
• MBA in Technology Management
• BS in Computer Science

This is a sample resume generated for demonstration purposes.
In a real application, this would be the actual PDF content.` :
            app.cover_letter;

        return content;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    // Utility functions
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatFileSize(bytes) {
        if (!bytes) return 'Unknown';
        
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    renderRating(rating) {
        if (!rating) return 'No rating';
        
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(`<span class="star ${i <= rating ? 'filled' : ''}">★</span>`);
        }
        return `<div class="rating-display">${stars.join('')}</div>`;
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            
            // Reset modal states and clear forms when closing
            if (modalId === 'add-company-modal') {
                document.getElementById('add-company-form').reset();
                this.resetCompanyModal();
            } else if (modalId === 'add-job-modal') {
                document.getElementById('add-job-form').reset();
                this.resetJobModal();
            } else if (modalId === 'assign-request-modal') {
                // Remove the dynamically created assignment modal
                modal.remove();
            } else if (modalId === 'add-staff-modal') {
                document.getElementById('add-staff-form').reset();
                document.getElementById('login-details').style.display = 'none';
                document.getElementById('staff-create-login').closest('.form-group').style.display = 'block';
                this.editingStaffId = null;
            }
        }
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'danger' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 3000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear stored user data
            localStorage.removeItem('admin_user');
            // Redirect to login page
            window.location.href = 'login.html';
        }
    }
}

// Global functions for HTML onclick events
function showSection(section) {
    adminPanel.showSection(section);
}

function showAddCompanyModal() {
    adminPanel.showAddCompanyModal();
}

function showAddJobModal() {
    adminPanel.showAddJobModal();
}

function showAddStaffModal() {
    adminPanel.showAddStaffModal();
}

function filterRequests() {
    adminPanel.filterRequests();
}

function filterApplications() {
    adminPanel.filterApplications();
}

function filterJobs() {
    adminPanel.filterJobs();
}

function filterStaff() {
    adminPanel.filterStaff();
}

function closeModal(modalId) {
    adminPanel.closeModal(modalId);
}

function logout() {
    adminPanel.logout();
}

// Initialize admin panel when page loads
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});