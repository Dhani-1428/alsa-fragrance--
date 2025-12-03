# Fixing Internal Server Error

## Common Causes

1. **Database not initialized** - Run migrations
2. **Prisma client not generated** - Run `npm run db:generate`
3. **JSON parsing errors** - Fixed in API routes
4. **Database locked** - Stop other processes using the database

## Steps to Fix

### 1. Stop the Dev Server
Press `Ctrl+C` in the terminal where `npm run dev` is running

### 2. Clear Cache and Restart
```bash
# Remove Next.js cache
Remove-Item -Recurse -Force .next

# Regenerate Prisma client
npm run db:generate

# Start server again
npm run dev
```

### 3. Check Terminal for Actual Error
Look at the terminal output when the error occurs. It should show:
- The actual error message
- Which API route failed
- Stack trace

### 4. Verify Database
```bash
# Check if database exists
Test-Path prisma\dev.db

# If needed, create/update database
npx prisma migrate dev
```

## What I Fixed

1. ✅ Added error handling for JSON parsing in products API
2. ✅ Added better error messages in login API
3. ✅ Fixed Prisma client import path
4. ✅ Created index.ts for cleaner imports

## If Error Persists

Check the terminal output and share:
1. The exact error message
2. Which page/route triggered it
3. Any stack trace shown

