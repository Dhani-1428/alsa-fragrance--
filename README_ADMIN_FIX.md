# Admin Panel Database Connection Fix

## Problem
Getting error: **"Failed to query user"** when trying to access the admin panel.

## Solution

### Option 1: Quick Fix (Recommended)
```bash
npm run db:fix-admin
```

This single command will fix all issues automatically.

### Option 2: Step-by-Step Diagnosis
```bash
# 1. Diagnose the issue
npm run db:diagnose

# 2. Create database schema (if needed)
npm run db:create-mysql-schema

# 3. Create admin user (if needed)
npm run db:create-admin

# 4. Verify everything works
npm run db:check-admin
```

## Files Created/Updated

### New Diagnostic & Fix Tools
- ✅ `scripts/diagnose-database.ts` - Comprehensive database diagnostic tool
- ✅ `scripts/fix-admin-panel.ts` - One-command fix for all admin panel issues
- ✅ `ADMIN_PANEL_TROUBLESHOOTING.md` - Detailed troubleshooting guide
- ✅ `QUICK_FIX_ADMIN.md` - Quick reference guide

### Updated Files
- ✅ `app/api/auth/login/route.ts` - Improved error messages with specific solutions
- ✅ `package.json` - Added npm scripts: `db:diagnose` and `db:fix-admin`

## What Was Fixed

1. **Better Error Messages** - Login route now provides specific error messages with solutions
2. **Database Connection Diagnostics** - New script checks all aspects of database connectivity
3. **Automatic Fix Script** - One command fixes all common issues
4. **Comprehensive Documentation** - Step-by-step guides for troubleshooting

## Common Issues Resolved

| Issue | Solution |
|-------|----------|
| Missing environment variables | Script checks and reports missing vars |
| Database connection failed | Detailed error messages with solutions |
| Users table doesn't exist | Auto-creates schema |
| Admin user doesn't exist | Auto-creates admin user |
| Wrong table structure | Validates and reports structure issues |

## Next Steps

1. Run the fix: `npm run db:fix-admin`
2. Start your server: `npm run dev`
3. Login at: `http://localhost:3000/admin/login`
4. Use credentials:
   - Email: `admin@alsafragrance.com`
   - Password: `admin123`

## Documentation

- **Quick Fix:** See [QUICK_FIX_ADMIN.md](./QUICK_FIX_ADMIN.md)
- **Detailed Guide:** See [ADMIN_PANEL_TROUBLESHOOTING.md](./ADMIN_PANEL_TROUBLESHOOTING.md)
- **Database Setup:** See [DATABASE_SETUP.md](./DATABASE_SETUP.md)
