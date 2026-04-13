# Vercel Deployment Guide - Smart Expense Tracker PWA

## Overview

Your Smart Expense Tracker PWA is now ready for deployment to Vercel! This guide covers:
- Setting up a GitHub repository
- Connecting to Vercel
- Configuring environment variables
- Deploying your PWA
- Testing on multiple devices

## Prerequisites

- GitHub account (https://github.com)
- Vercel account (free tier available at https://vercel.com)

## Step-by-Step Deployment

### 1. Create GitHub Repository

Push your local git repository to GitHub:

```bash
# Create a new repository on GitHub first at https://github.com/new
# Then run these commands (replace with your GitHub username and repo name):

git remote add origin https://github.com/YOUR_USERNAME/smart-expense-tracker.git
git branch -M main
git push -u origin main
```

**Expected Output:**
```
Counting objects: 102, done.
...
To https://github.com/YOUR_USERNAME/smart-expense-tracker.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### 2. Connect to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" and choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub account
4. Click "Import Project"
5. Select your `smart-expense-tracker` repository
6. Click "Import"

### 3. Configure Build Settings

When importing, Vercel should auto-detect:
- **Framework**: Vite
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install` (at root level)

**If not auto-detected, set manually:**

1. Go to Project Settings → Build & Development Settings
2. Set:
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install`

### 4. Environment Variables (Optional)

If your backend API has a specific URL:

1. Go to Project Settings → Environment Variables
2. Add new variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-api.com` (or leave as default `http://localhost:5000`)

### 5. Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Once complete, you'll get a Vercel URL like: `https://smart-expense-tracker-abc123.vercel.app`

## Testing Your PWA

### Desktop Testing

1. Visit your Vercel URL in a browser
2. Open DevTools (F12 → Application tab)
3. Check:
   - ✅ Manifest.json is loaded
   - ✅ Service Worker is registered (Status: activated and running)
   - ✅ Cache Storage shows cached files

### Mobile Testing

#### On iPhone/iPad:
1. Open Safari
2. Navigate to your Vercel URL
3. Tap Share → "Add to Home Screen"
4. Name the shortcut and add
5. App appears on home screen with icon
6. Tap to launch - should show as standalone app (no address bar)

#### On Android:
1. Open Chrome
2. Navigate to your Vercel URL
3. Tap menu (3 dots) → "Add to Home Screen" or "Install app"
4. Confirm installation
5. App appears on home screen with icon
6. Tap to launch - should show as standalone app

### Offline Testing

After installing PWA:

1. **Enable Offline Mode:**
   - DevTools → Network tab
   - Checkbox "Offline"

2. **Test Functionality:**
   - Dashboard loads ✅
   - Records display (cached from previous visit) ✅
   - Can view reports ✅
   - Buttons are disabled with offline message ✅

3. **Disable Offline Mode:**
   - Uncheck "Offline" in DevTools
   - Refresh - app should sync and work normally

## Post-Deployment

### Update Domain Name (Optional)

To use a custom domain:

1. Go to Vercel Project Settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Set Up Auto-Deploys

Vercel automatically deploys when you push to `main` branch:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys!
```

### Monitor Deployments

- View all deployments: Project → Deployments tab
- View logs: Click deployment → click "View Build Logs"
- Rollback if needed: Click "Promote to Production" on a previous deployment

## Troubleshooting

### Build Fails

**Check build logs:**
1. Go to Vercel dashboard → Your project
2. Click failed deployment
3. Click "View Build Logs"
4. Look for error messages

**Common issues:**
- Missing dependencies: Ensure `package.json` in root and `frontend/` are correct
- Wrong build command: Verify `cd frontend && npm install && npm run build`
- Environment variables: Check VITE_* variables are set

### Service Worker Not Registering

1. Check browser console for errors
2. Ensure `service-worker.js` is in `frontend/public/`
3. Verify `index.html` has registration script
4. Hard refresh (Ctrl+Shift+R) to clear cache

### PWA Not Installing

1. **Check manifest.json:**
   - Must be valid JSON (copy URL into JSON validator)
   - Must include `name`, `short_name`, `icons`, `display`
   - Icons must exist (ours use data URIs - should work)

2. **Check HTTPS:** PWA requires HTTPS
   - Vercel always uses HTTPS ✅

3. **Check service worker:** Must be registered and active
   - See "Service Worker Not Registering" above

### App Slow or Large Bundle

The build warning about 523KB is normal for Vite. To optimize:

```bash
# Add code splitting (edit frontend/vite.config.js):
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        icons: ['lucide-react']
      }
    }
  }
}
```

## Testing Checklist

- [ ] Web app loads at Vercel URL
- [ ] Mobile responsive (test at 375px width)
- [ ] Can add expense record
- [ ] Can view dashboard
- [ ] Can view reports
- [ ] Voice input works (if backend is running)
- [ ] Can install as PWA on phone
- [ ] Offline mode works
- [ ] Touch targets are 48px+ (mobile)
- [ ] App icon displays on home screen

## Next Steps

After deployment, you can:

1. **Start Phase 2: React Native Development**
   - Create mobile app for Google Play Store
   - Share backend with web app

2. **Set Up Backend Hosting**
   - Deploy Flask backend to Railway, Render, or Heroku
   - Update `VITE_API_URL` environment variable

3. **Analytics & Monitoring**
   - Set up Vercel Analytics (free tier available)
   - Monitor performance and usage

4. **Custom Domain**
   - Set up custom domain in Vercel
   - Configure DNS records

## Useful Links

- Vercel Docs: https://vercel.com/docs
- PWA Best Practices: https://web.dev/progressive-web-apps/
- Service Workers: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- Manifest.json Reference: https://web.dev/add-manifest/

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser DevTools console
3. Verify manifest.json and service-worker.js exist
4. Ensure all environment variables are set
5. Test locally first: `cd frontend && npm run preview`

---

**Status: Ready for Vercel Deployment** ✅

Your PWA is production-ready and can now be deployed to millions of users worldwide!
