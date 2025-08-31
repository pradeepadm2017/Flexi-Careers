# Flexi-Careers Deployment Guide

## 🚀 Step-by-Step Deployment Instructions

### Prerequisites
- GitHub account (free)
- Render.com account (free)
- Neon.tech account (free)
- Netlify account (free)

### Step 1: Push Code to GitHub

1. Go to [GitHub.com](https://github.com) and create a new repository called "flexi-careers"
2. In your terminal, run:
```bash
cd /home/subha/flexi-careers
git init
git add .
git commit -m "Initial commit - Flexi-Careers application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flexi-careers.git
git push -u origin main
```

### Step 2: Set Up Production Database (Neon.tech)

1. Go to [Neon.tech](https://neon.tech)
2. Sign up for free account
3. Create a new project called "flexi-careers"
4. Note down the connection string (DATABASE_URL)
5. Run the database setup script (we'll create this)

### Step 3: Deploy Backend (Render.com)

1. Go to [Render.com](https://render.com)
2. Sign up and connect your GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repo "flexi-careers"
5. Configure:
   - Name: flexi-careers-api
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `cd backend && python app.py`
   - Add environment variables:
     - `DATABASE_URL`: [from Neon.tech]
     - `FLASK_ENV`: `production`
     - `SECRET_KEY`: `your-random-secret-key-123456789`

### Step 4: Deploy Frontend (Netlify)

1. Go to [Netlify.com](https://netlify.com)
2. Drag and drop your entire project folder
3. Or connect to GitHub repo
4. Site will be live at: `https://random-name-12345.netlify.app`

### Step 5: Update Frontend URLs

Update all API calls in your JavaScript files to point to your Render backend:
- Change `http://localhost:5000` to `https://your-app-name.onrender.com`

### Step 6: Test Everything

1. Visit your Netlify site
2. Test login functionality
3. Test staff management
4. Test employer requests and filtering
5. Ensure all features work

### Optional: Custom Domain

1. Buy domain from Namecheap/Google Domains
2. Point to Netlify in domain settings
3. Configure SSL certificate (automatic on Netlify)

## 🔧 Files Created for Production

- `requirements.txt` - Python dependencies
- `runtime.txt` - Python version
- `Procfile` - How to run the app
- `.env.example` - Environment variables template
- `app_production.py` - Production-ready Flask app
- `deploy.md` - This deployment guide

## 🌐 Expected URLs After Deployment

- **API Backend**: `https://your-app-name.onrender.com`
- **Admin Portal**: `https://your-site-name.netlify.app/admin/`
- **Main Site**: `https://your-site-name.netlify.app`

## 💰 Costs

- **Free Tier**: $0/month (with some limitations)
- **Custom Domain**: ~$10-15/year
- **Upgraded Hosting**: ~$7-20/month if you need more resources

## 🆘 Troubleshooting

- Check Render logs if backend doesn't work
- Check browser console for frontend errors
- Ensure CORS is configured correctly
- Verify database connection strings