# Online Database Setup Guide

## Quick Setup Options

### Option 1: Turso (SQLite-Compatible) - EASIEST ⭐

**Why Turso?**
- ✅ Works with your existing SQLite schema (no changes needed)
- ✅ Free tier available
- ✅ Fast and easy setup
- ✅ Perfect for Vercel deployments

**Steps:**

1. **Sign up at [turso.tech](https://turso.tech)**
   - Go to https://turso.tech
   - Sign up with GitHub (easiest)

2. **Create Database:**
   - Click "Create Database"
   - Name it: `alsa-fragrance`
   - Choose a location close to you
   - Click "Create"

3. **Get Connection String:**
   - After creating, click on your database
   - Go to "Connect" tab
   - Copy the connection string (looks like: `libsql://alsa-fragrance-xxx.turso.io`)

4. **Add to Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add new variable:
     - **Name**: `DATABASE_URL`
     - **Value**: Your Turso connection string
     - **Scope**: Production, Preview, Development
   - Click "Save"

5. **Install Turso CLI (for migrations):**
   ```bash
   npm install -g @libsql/client
   ```

6. **Run Migrations:**
   ```bash
   npx prisma migrate deploy
   ```

7. **Redeploy on Vercel:**
   - Push changes to GitHub
   - Vercel will auto-deploy
   - Or manually redeploy from Vercel dashboard

**Done!** Your database is now online and working.

---

### Option 2: Vercel Postgres (Recommended for Production)

**Why Vercel Postgres?**
- ✅ Integrated with Vercel
- ✅ Automatic backups
- ✅ Free tier available
- ✅ Better for production apps

**Steps:**

1. **Create Postgres Database:**
   - Go to Vercel Dashboard → Your Project
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Click "Create"

2. **Update Prisma Schema:**
   - I'll update `prisma/schema.prisma` to use PostgreSQL
   - Change `provider = "sqlite"` to `provider = "postgresql"`

3. **Environment Variable:**
   - Vercel automatically adds `DATABASE_URL`
   - Verify it's set in: Settings → Environment Variables

4. **Run Migrations:**
   ```bash
   npx prisma migrate deploy
   ```

5. **Redeploy:**
   - Push changes to GitHub
   - Vercel will auto-deploy

---

### Option 3: Supabase (Free PostgreSQL)

**Why Supabase?**
- ✅ Free tier with generous limits
- ✅ Great dashboard
- ✅ Easy to use

**Steps:**

1. **Sign up at [supabase.com](https://supabase.com)**
   - Create account
   - Create new project

2. **Get Connection String:**
   - Go to Project Settings → Database
   - Copy "Connection string" (URI format)
   - It looks like: `postgresql://postgres:[password]@[host]:5432/postgres`

3. **Update Prisma Schema:**
   - Change to PostgreSQL (I'll help with this)

4. **Add to Vercel:**
   - Add `DATABASE_URL` environment variable
   - Use the connection string from Supabase

5. **Run Migrations:**
   ```bash
   npx prisma migrate deploy
   ```

---

## Which Should You Choose?

- **Turso**: Best if you want the easiest migration (no schema changes)
- **Vercel Postgres**: Best if you want everything in one place
- **Supabase**: Best if you want a free PostgreSQL with great tools

## Need Help?

Tell me which option you want, and I'll help you set it up step by step!

