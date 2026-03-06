# Fix Admin Panel "Database table not found" Error

## ✅ Solution

The database has been set up correctly, but you need to **restart your Next.js development server** to pick up the new database configuration.

## Steps to Fix

### 1. Stop Your Development Server
Press `Ctrl+C` in the terminal where your server is running.

### 2. Restart the Server
```bash
npm run dev
```

### 3. Clear Browser Cache (Optional but Recommended)
- Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac) to hard refresh
- Or open DevTools (F12) → Right-click refresh button → "Empty Cache and Hard Reload"

### 4. Login to Admin Panel
- Go to: `http://localhost:3000/admin/login`
- Email: `admin@alsafragrance.com`
- Password: `admin123`

## What Was Fixed

1. ✅ **Database Created**: `alsafragrance` database
2. ✅ **Tables Created**: `users`, `products`, `orders`
3. ✅ **Admin User Created**: Ready to login
4. ✅ **Connection Pool**: Now dynamically recreates when database config changes
5. ✅ **Error Handling**: Better error messages with solutions

## Verification

Run this to verify everything is working:
```bash
npm run db:diagnose
```

You should see:
- ✅ All environment variables present
- ✅ Database connection successful
- ✅ All tables exist
- ✅ Admin user found

## If Still Having Issues

1. **Check .env file** - Make sure it has:
   ```env
   MYSQL_DATABASE=alsafragrance
   ```

2. **Restart server** - This is critical! The server caches the connection pool.

3. **Run diagnostic**:
   ```bash
   npm run db:diagnose
   ```

4. **Recreate database** (if needed):
   ```bash
   npm run db:setup
   ```

## Why Restart is Needed

Next.js caches modules and database connections. When you update the `.env` file:
- The connection pool was created with the old database name (`mysql`)
- Even though `.env` is updated, the running server still has the old pool in memory
- Restarting the server creates a new pool with the correct database (`alsafragrance`)

The code now automatically detects database config changes and recreates the pool, but you still need to restart once after updating `.env`.
