# Vercel Deployment Guide - Fixing 404 Errors

## Problem: 404 Errors After Deployment

If you're seeing 404 errors on Vercel, it's likely due to:

1. **SQLite Database Issue**: SQLite file databases don't work on Vercel (serverless)
2. **Missing Environment Variables**: Database and API keys not configured
3. **Build Failures**: Database connection errors during build

## Solution: Set Up Cloud Database

### Option 1: Use Vercel Postgres (Recommended)

1. **Create Vercel Postgres Database:**
   - Go to Vercel Dashboard → Your Project → Storage → Create Database
   - Select "Postgres"
   - Create database

2. **Update Prisma Schema:**
   Change `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Run Migrations:**
   ```bash
   npx prisma migrate deploy
   ```

4. **Environment Variables:**
   - Vercel automatically adds `DATABASE_URL` when you create Postgres
   - Make sure it's set in: Project Settings → Environment Variables

### Option 2: Use Turso (SQLite-Compatible Cloud)

1. **Sign up at [turso.tech](https://turso.tech)**
2. **Create database and get connection string**
3. **Add to Vercel Environment Variables:**
   - Name: `DATABASE_URL`
   - Value: Your Turso connection string (starts with `libsql://`)

4. **Update Prisma Schema:**
   ```prisma
   datasource db {
     provider = "sqlite"  // Keep as sqlite
     url      = env("DATABASE_URL")
   }
   ```

### Option 3: Use Any PostgreSQL Database

1. **Get PostgreSQL connection string** (from Railway, Supabase, Neon, etc.)
2. **Update Prisma Schema** to use `postgresql`
3. **Add `DATABASE_URL` to Vercel Environment Variables**

## Required Environment Variables for Vercel

Add these in **Vercel Dashboard → Project → Settings → Environment Variables**:

### Required:
- ✅ `DATABASE_URL` - Your database connection string
- ✅ `RESEND_API_KEY` - Email service API key (`re_cqDrdgLp_Bp4iGdNqyZwRVDdx3gc29WYa`)

### Optional (for full functionality):
- `STRIPE_SECRET_KEY` - For payment processing
- `STRIPE_PUBLISHABLE_KEY` - For payment processing
- `NEXTAUTH_SECRET` - For authentication (generate random string)
- `NEXTAUTH_URL` - Your Vercel deployment URL

## Steps to Fix 404 Error

### Step 1: Set Up Database

Choose one of the options above and configure your database.

### Step 2: Add Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add all required variables
5. **Important**: Select all environments (Production, Preview, Development)

### Step 3: Update Prisma Schema (if using PostgreSQL)

If switching to PostgreSQL, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 4: Regenerate Prisma Client

```bash
npx prisma generate
```

### Step 5: Run Database Migrations

**For PostgreSQL:**
```bash
npx prisma migrate deploy
```

**For Turso/SQLite:**
```bash
npx prisma migrate deploy
```

### Step 6: Redeploy on Vercel

1. Push changes to GitHub (if not already done)
2. Vercel will automatically redeploy
3. Or manually trigger: Vercel Dashboard → Deployments → Redeploy

## Verify Deployment

1. **Check Build Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on latest deployment
   - Check "Build Logs" for any errors

2. **Test the Site:**
   - Visit your Vercel URL
   - Should see homepage (not 404)
   - Test contact form
   - Test product pages

3. **Check API Routes:**
   - Visit: `https://your-site.vercel.app/api/test-resend`
   - Should return JSON (not 404)

## Common Issues

### Issue: Still Getting 404

**Solution:**
- Check build logs for errors
- Verify `DATABASE_URL` is set correctly
- Make sure Prisma migrations ran successfully
- Check that `next.config.mjs` doesn't have errors

### Issue: Database Connection Errors

**Solution:**
- Verify `DATABASE_URL` format is correct
- For PostgreSQL: `postgresql://user:password@host:port/database`
- For Turso: `libsql://database-name.turso.io`
- Check database is accessible from internet (not localhost)

### Issue: Build Fails

**Solution:**
- Check build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`
- Verify `prisma generate` runs during build (it should automatically)
- Check for TypeScript errors

## Quick Fix Checklist

- [ ] Database configured (Vercel Postgres, Turso, or other)
- [ ] `DATABASE_URL` added to Vercel environment variables
- [ ] `RESEND_API_KEY` added to Vercel environment variables
- [ ] Prisma schema updated (if switching to PostgreSQL)
- [ ] Prisma client regenerated (`npx prisma generate`)
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Changes committed and pushed to GitHub
- [ ] Vercel redeployed
- [ ] Build logs checked for errors
- [ ] Site tested on Vercel URL

## Need Help?

If you're still seeing 404 errors:
1. Check Vercel build logs
2. Check Vercel function logs
3. Verify environment variables are set
4. Test database connection locally with production URL

