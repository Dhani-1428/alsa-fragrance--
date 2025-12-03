# ✅ Turso Database Setup Checklist

## Your Current Setup is Perfect! ✅

Your Prisma schema is already configured for SQLite, which works perfectly with Turso. No code changes needed!

---

## Step-by-Step Setup

### ✅ Step 1: Create Turso Account & Database

1. **Go to:** https://turso.tech
2. **Sign up** (use GitHub for fastest signup)
3. **Create Database:**
   - Click **"Create Database"** button
   - **Name:** `alsa-fragrance` (or any name you like)
   - **Location:** Choose closest to you (e.g., `iad` for US East)
   - Click **"Create"**

### ✅ Step 2: Get Your Connection String

1. **Click on your database** (the one you just created)
2. **Go to "Connect" tab** (or "Overview" → "Connect")
3. **Copy the connection string**
   - It will look like: `libsql://alsa-fragrance-xxxxx-xxxx.turso.io`
   - **Important:** Copy the entire string!

### ✅ Step 3: Add to Vercel Environment Variables

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Select your project:** `alsa-fragrance11` (or your project name)
3. **Go to:** Settings → Environment Variables
4. **Click "Add New"**
5. **Fill in:**
   - **Key:** `DATABASE_URL`
   - **Value:** Paste your Turso connection string
   - **Environment:** Select all three:
     - ☑️ Production
     - ☑️ Preview  
     - ☑️ Development
6. **Click "Save"**

### ✅ Step 4: Install Turso CLI (Optional but Recommended)

Open your terminal in the project folder and run:

```bash
npm install -g @libsql/client
```

Or install locally:

```bash
npm install @libsql/client
```

### ✅ Step 5: Run Database Migrations

In your project folder, run:

```bash
npx prisma migrate deploy
```

This creates all your tables (User, Product) in your Turso database.

**Expected output:**
```
✅ Applied migration: 20251112172930_init
✅ Applied migration: 20251112180731_update_user_role_default
```

### ✅ Step 6: Create Admin User

Run this command to create your admin account:

```bash
npm run db:create-admin
```

This creates:
- **Email:** `admin@alsafragrance.com`
- **Password:** `admin123`

### ✅ Step 7: Redeploy on Vercel

**Option A: Auto-deploy (if connected to GitHub)**
- Just push any changes to GitHub
- Vercel will automatically redeploy

**Option B: Manual redeploy**
1. Go to Vercel Dashboard → Your Project
2. Go to "Deployments" tab
3. Click "..." on latest deployment
4. Click "Redeploy"

### ✅ Step 8: Test Your Site

1. **Visit your Vercel URL**
   - Should see homepage (no more 404!)
2. **Test admin login:**
   - Go to: `https://your-site.vercel.app/admin/login`
   - Email: `admin@alsafragrance.com`
   - Password: `admin123`

---

## 🎉 Done!

Your database is now online and working!

---

## Troubleshooting

### ❌ Error: "Environment variable not found: DATABASE_URL"

**Fix:**
- Make sure you added `DATABASE_URL` in Vercel
- Check it's set for all environments (Production, Preview, Development)
- Redeploy after adding the variable

### ❌ Error: "Migration failed" or "Database not found"

**Fix:**
- Verify your Turso connection string is correct
- Make sure it starts with `libsql://`
- Try running: `npx prisma generate` first, then `npx prisma migrate deploy`

### ❌ Still Getting 404 on Vercel

**Fix:**
- Check Vercel build logs for errors
- Make sure `DATABASE_URL` is set correctly
- Verify the connection string format is correct
- Try redeploying

### ❌ Can't connect to database locally

**Fix:**
- For local development, you can still use your local SQLite database
- Or add `DATABASE_URL` to `.env.local` file:
  ```
  DATABASE_URL=your-turso-connection-string-here
  ```

---

## Quick Test Commands

After setup, test your connection:

```bash
# Generate Prisma client
npx prisma generate

# Check database connection
npx prisma db pull

# View your data (if Turso CLI is installed)
turso db shell alsa-fragrance
```

---

## Need Help?

If you get stuck:
1. Check the error message
2. Verify your connection string is correct
3. Make sure environment variables are set in Vercel
4. Check Vercel build logs

**You're all set! Follow the steps above and your database will be online in minutes.** 🚀

