# Vercel Deployment Guide

## Quick Deploy to New Project

### Method 1: Vercel Dashboard (Easiest)

1. Visit https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import repository: `Sheetallinks/alsa-fragrance11`
4. Configure:
   - **Project Name**: Choose a unique name (e.g., `alsa-fragrance-v2`)
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)
5. **Environment Variables** (if needed):
   - `MONGODB_URI` - Your MongoDB connection string
   - `RESEND_API_KEY` - For email functionality (optional)
   - `SMTP_USER` - Email service user (optional)
   - `SMTP_PASS` - Email service password (optional)
   - Any other environment variables your app needs
6. Click **Deploy**

### Method 2: Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to new project
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No (to create new)
# - Project name? (Enter new name)
# - Directory? ./
# - Override settings? No
```

### Method 3: Disconnect and Reconnect

If you want to keep the same repo but create a fresh project:

1. Go to your existing Vercel project
2. Go to **Settings** → **General**
3. Scroll down and click **"Disconnect Git Repository"**
4. Then follow **Method 1** to create a new project with the same repo

## Important Notes

### Environment Variables
Make sure to add all required environment variables in the new project:
- Go to **Project Settings** → **Environment Variables**
- Add each variable for **Production**, **Preview**, and **Development** as needed

### Build Settings
The project should auto-detect:
- **Framework**: Next.js
- **Build Command**: `pnpm run build` or `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install` (since you have `pnpm-lock.yaml`)

### After Deployment
1. Check the deployment logs for any errors
2. Visit your new deployment URL
3. Test the home page and key functionality
4. Update any external services with the new URL if needed

## Troubleshooting

### If Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `package.json` has correct build script
- Check for any TypeScript errors (though they're ignored in config)

### If Home Page Doesn't Load
- Clear browser cache
- Check browser console for errors
- Verify the route is built correctly in build logs
- Check Vercel Function logs for runtime errors

## Current Project Status

✅ All fixes applied:
- Home page route properly configured
- Error handling added
- API routes fixed (checkout route.tsx → route.ts)
- Root route.tsx removed
- Metadata properly typed

Your project is ready to deploy!

