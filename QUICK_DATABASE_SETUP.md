# 🚀 Quick Database Setup - Turso (5 Minutes)

## Step-by-Step Guide

### Step 1: Create Turso Account & Database

1. **Go to [turso.tech](https://turso.tech)**
2. **Sign up** (use GitHub for fastest signup)
3. **Create Database:**
   - Click "Create Database"
   - Name: `alsa-fragrance`
   - Location: Choose closest to you
   - Click "Create"

### Step 2: Get Your Connection String

1. **Click on your database** (`alsa-fragrance`)
2. **Go to "Connect" tab**
3. **Copy the connection string**
   - It looks like: `libsql://alsa-fragrance-xxxxx-xxxx.turso.io`
   - **Save this!** You'll need it in the next step

### Step 3: Add to Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
2. **Select your project** (`alsa-fragrance11`)
3. **Go to Settings → Environment Variables**
4. **Add New Variable:**
   - **Name**: `DATABASE_URL`
   - **Value**: Paste your Turso connection string
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

### Step 4: Install Turso CLI (One Time)

Open your terminal and run:

```bash
npm install -g @libsql/client
```

Or if you prefer local install:

```bash
npm install @libsql/client
```

### Step 5: Run Database Migrations

In your project folder, run:

```bash
npx prisma migrate deploy
```

This will create all your tables in the online database.

### Step 6: Create Admin User

```bash
npm run db:create-admin
```

This creates the admin user:
- Email: `admin@alsafragrance.com`
- Password: `admin123`

### Step 7: Redeploy on Vercel

1. **Push any changes to GitHub** (if you made any)
2. **Go to Vercel Dashboard**
3. **Click "Redeploy"** on your latest deployment
   - Or Vercel will auto-deploy if you pushed to GitHub

### Step 8: Test Your Site

1. **Visit your Vercel URL**
2. **Should see homepage** (no more 404!)
3. **Test admin login:**
   - Go to `/admin/login`
   - Email: `admin@alsafragrance.com`
   - Password: `admin123`

## ✅ Done!

Your database is now online and working on Vercel!

## Troubleshooting

### Error: "Database not found"
- Make sure you copied the full connection string from Turso
- Check it starts with `libsql://`

### Error: "Migration failed"
- Make sure `DATABASE_URL` is set in Vercel
- Try running `npx prisma generate` first
- Then run `npx prisma migrate deploy`

### Still Getting 404?
- Check Vercel build logs for errors
- Make sure `DATABASE_URL` environment variable is set
- Verify the connection string is correct

## Need Help?

If you get stuck, share:
1. The error message you see
2. Which step you're on
3. Screenshot of Vercel environment variables (hide the actual connection string)

