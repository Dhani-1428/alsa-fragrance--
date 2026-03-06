# Complete Database Fix - "Database table not found" Error

## ✅ Root Cause

The error occurs because:
1. The connection pool was created with the old database name (`mysql`)
2. Even after updating `.env`, the running server still has the cached pool
3. Queries are executed against the wrong database

## 🔧 Complete Solution

### Step 1: Verify Database Setup
```bash
npm run db:verify
```

Should show:
```
✅ Table 'users' exists
✅ Table 'products' exists
✅ Table 'orders' exists
✅ All required tables exist in the database!
```

### Step 2: Check .env File
Make sure your `.env` file has:
```env
MYSQL_DATABASE=alsafragrance
```

NOT:
```env
MYSQL_DATABASE=mysql  ❌ Wrong!
```

### Step 3: Restart Your Server
**This is CRITICAL!**

1. **Stop the server**: Press `Ctrl+C` in the terminal
2. **Restart**: `npm run dev`
3. **Wait for**: "Ready" message

### Step 4: Clear Browser Cache
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or: DevTools (F12) → Right-click refresh → "Empty Cache and Hard Reload"

### Step 5: Test Admin Login
- Go to: `http://localhost:3000/admin/login`
- Email: `admin@alsafragrance.com`
- Password: `admin123`

## What Was Fixed in Code

1. ✅ **Query Function Enhanced**
   - Now explicitly switches to correct database before each query
   - Automatically detects and fixes database mismatches

2. ✅ **Better Error Handling**
   - All model functions now provide helpful error messages
   - Clear instructions to run `npm run db:setup`

3. ✅ **Connection Pool Management**
   - Pool automatically recreates when database config changes
   - Database verification on connection

## If Still Not Working

### Option 1: Force Database Setup
```bash
npm run db:setup
```

This will:
- Create database if needed
- Create all tables
- Verify everything is correct

### Option 2: Reset Connection Pool
The code now automatically handles this, but if needed:
1. Stop server
2. Delete `.next` folder: `rm -rf .next` (or `rmdir /s .next` on Windows)
3. Restart: `npm run dev`

### Option 3: Full Diagnostic
```bash
npm run db:diagnose
```

This will show exactly what's wrong.

## Verification Checklist

- [ ] `.env` file has `MYSQL_DATABASE=alsafragrance`
- [ ] Tables exist (run `npm run db:verify`)
- [ ] Server has been restarted after .env update
- [ ] Browser cache cleared
- [ ] Admin user exists (run `npm run db:check-admin`)

## Common Mistakes

1. ❌ **Not restarting server** - Most common issue!
2. ❌ **Wrong database in .env** - Still set to `mysql`
3. ❌ **Old browser cache** - Shows cached error
4. ❌ **Multiple .env files** - Check root directory only

## Quick Test

After restarting, test the connection:
```bash
npm run db:diagnose
```

All checks should pass. If they do, the admin panel will work after server restart.
