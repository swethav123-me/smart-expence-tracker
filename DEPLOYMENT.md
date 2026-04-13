# Deployment Guide - Smart Expense Tracker

## Frontend Deployment (Vercel/Netlify)

### Option 1: Deploy to Vercel (Recommended)

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure Environment**
   - Set `VITE_API_URL` to your backend URL in Vercel dashboard
   - Project Settings → Environment Variables

### Option 2: Deploy to Netlify

1. **Build and Deploy**
   ```bash
   cd frontend
   npm run build
   # Drag dist/ folder to Netlify
   ```

2. **Environment Variables**
   - Netlify → Site Settings → Build & Deploy → Environment
   - Add `VITE_API_URL=https://your-api.com/api`

---

## Backend Deployment

### Option 1: Railway.app (Simple)

1. **Prepare Backend**
   ```bash
   # Update requirements.txt to include gunicorn
   pip install gunicorn
   pip freeze > backend/requirements.txt
   ```

2. **Create Procfile** (`backend/Procfile`)
   ```
   web: gunicorn app:app
   ```

3. **Deploy**
   - Connect GitHub repo to Railway
   - Select `backend` directory
   - Set environment variables

### Option 2: Render.com

1. **Create Web Service**
   - Connect GitHub repository
   - Environment: `Python 3.11`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`

2. **Set Environment Variables**
   ```
   FLASK_ENV=production
   JWT_SECRET_KEY=your-secret-key-here
   DATABASE_URL=postgresql://...
   ```

### Option 3: Heroku

1. **Setup** (Requires Heroku Account)
   ```bash
   heroku login
   heroku create your-app-name
   ```

2. **Deploy**
   ```bash
   cd backend
   git push heroku main
   ```

---

## Database Migration to PostgreSQL

For production, replace SQLite with PostgreSQL:

### Backend Changes

1. **Install PostgreSQL driver**
   ```bash
   pip install psycopg2-binary
   ```

2. **Update `backend/.env`**
   ```
   DATABASE_URL=postgresql://username:password@hostname:5432/dbname
   ```

3. **Models work unchanged** - SQLAlchemy handles the switch

---

## Production Checklist

- [ ] JWT_SECRET_KEY changed to strong random value
- [ ] CORS origins restricted to your domain
- [ ] HTTPS enforced on all endpoints
- [ ] Database backups configured
- [ ] Error logging setup
- [ ] API rate limiting added
- [ ] CSRF protection enabled
- [ ] Sensitive data not in logs

---

## Health Check

After deployment, verify:

```bash
# Frontend loads
curl https://your-frontend.vercel.app

# Backend API responds
curl https://your-backend-api.com/api/health

# Can login
curl -X POST https://your-backend-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'
```

---

## Monitoring

### Frontend (Vercel)
- Real-time performance metrics
- Deployment history
- Error tracking via Sentry (optional)

### Backend (Railway/Render)
- Log monitoring
- Resource usage
- Automatic restarts on crashes

---

## Custom Domain

1. **Update DNS** to point to deployed services
2. **SSL/TLS** - Auto-provisioned by Vercel/Railway/Render
3. **Update API URL** in frontend environment variables

---

**Deployment Complete! 🚀**
