# Flexi-Careers - Fractional Employment Platform

A modern, responsive website for connecting fractional professionals with innovative companies.

## Features

### 🎨 Design
- **Warm, sophisticated color palette** using rust (#9A3F3F), terracotta (#C1856D), sandy beige (#E6CFA9), and cream (#FBF9D1)
- **Responsive design** optimized for desktop, tablet, and mobile
- **Modern UI/UX** with smooth animations and hover effects
- **Accessibility features** including focus states and semantic HTML

### 💼 Job Board
- **Featured opportunities** on homepage
- **Full job listings** page with search and filtering
- **Detailed job modals** with requirements, skills, and company info
- **Application system** with professional form and validation

### 🚀 Interactive Features
- **Smooth scrolling navigation** with active states
- **Professional application forms** with file upload for resumes
- **Loading states** and success notifications
- **Scroll-to-top** functionality
- **Keyboard navigation** support (ESC to close modals)

### 📱 Mobile Optimized
- **Mobile-first responsive design**
- **Touch-friendly interfaces**
- **Optimized typography** for readability
- **Compressed layouts** for smaller screens

## File Structure

```
flexi-careers/
├── index.html          # Homepage with featured opportunities
├── jobs.html           # Full job board with search/filter
├── styles.css          # Complete styling and responsive design
├── script.js           # Homepage functionality and modal system
├── jobs.js             # Job board functionality and filtering
└── README.md           # Documentation
```

## Key Sections

### Homepage (index.html)
- **Hero section** with compelling call-to-action
- **Featured opportunities** (4 curated jobs)
- **How it works** - 3-step process
- **Benefits** - Tabbed content for candidates vs employers
- **About section** with company story
- **Employer contact form** for talent matching
- **Contact information** and navigation

### Jobs Page (jobs.html)
- **Search functionality** by keywords
- **Filtering** by location and job type
- **Sorting** options (date, location)
- **15 detailed job listings** with full information
- **Load more** functionality for pagination
- **Same modal system** for job details and applications

### Application System
- **Professional forms** with validation
- **Required fields**: First name, last name, email, phone, resume
- **Optional**: Cover letter
- **File upload** support for resumes (PDF, DOC, DOCX)
- **Success notifications** with personalized messages
- **Loading states** during submission

## Technical Features

### Performance
- **Optimized images** from Unsplash
- **CSS animations** with hardware acceleration
- **Lazy loading** considerations
- **Minimal JavaScript** for fast loading

### Browser Support
- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **Responsive breakpoints** at 768px and 480px
- **Progressive enhancement** approach
- **Print styles** included

### Accessibility
- **Semantic HTML** structure
- **ARIA labels** for interactive elements
- **Focus management** for modals
- **Keyboard navigation** support
- **Color contrast** compliant
- **Screen reader** friendly

## Usage

1. **Open index.html** in a web browser to view the homepage
2. **Navigate to jobs.html** to browse all job opportunities
3. **Click "View Details"** on any job to see full information
4. **Click "Apply Now"** to submit an application
5. **Use the employer form** on homepage to request talent

## Customization

### Colors
All colors are defined as CSS custom properties in `:root` for easy theming:
- `--primary-color`: Main brand color
- `--secondary-color`: Complementary accent
- `--accent-color`: Highlighting and CTAs
- `--cream-light`: Light backgrounds

### Content
- **Job data** is stored in JavaScript arrays for easy modification
- **Company information** can be updated in HTML
- **Images** can be replaced with new Unsplash URLs or local files

## Future Enhancements

- **Backend integration** for real job data and applications
- **User authentication** for candidate profiles
- **Advanced search** with salary ranges and skills
- **Company profiles** and detailed pages
- **Email notifications** for applications
- **Admin dashboard** for job management

---

Built with modern web technologies and best practices for optimal user experience.