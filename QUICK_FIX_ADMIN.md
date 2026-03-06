# Quick Fix for Admin Panel "Failed to query user" Error

## 🚀 Quick Solution

Run this single command to fix all admin panel issues:

```bash
npm run db:fix-admin
```

This will automatically:
1. ✅ Check environment variables
2. ✅ Test database connection
3. ✅ Create database schema if needed
4. ✅ Create admin user if needed
5. ✅ Reset admin password to default

## 📋 What This Does

The fix script will:
- Verify your `.env` file has all required database credentials
- Test the connection to your AWS RDS database
- Create the `users` table if it doesn't exist
- Create or update the admin user with:
  - **Email:** `admin@alsafragrance.com`
  - **Password:** `admin123`

## 🔍 Diagnose Issues First (Optional)

If you want to see detailed information about what's wrong:

```bash
npm run db:diagnose
```

This will show you:
- Environment variable status
- Database connection status
- Table existence
- Table structure
- User query tests
- List of all users

## 📝 Manual Steps (If Script Doesn't Work)

### 1. Check Environment Variables

Make sure your `.env` file contains:

```env
MYSQL_HOST=alsafragrance.ctu4682g825l.eu-north-1.rds.amazonaws.com
MYSQL_PORT=3306
MYSQL_USER=bfsmanager
MYSQL_PASSWORD=ALSAFRAGRAN
MYSQL_DATABASE=mysql
MYSQL_SSL=true
```

### 2. Create Database Schema

```bash
npm run db:create-mysql-schema
```

### 3. Create Admin User

```bash
npm run db:create-admin
```

### 4. Verify Admin User

```bash
npm run db:check-admin
```

## 🎯 After Running the Fix

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to admin login:**
   ```
   http://localhost:3000/admin/login
   ```

3. **Login with:**
   - Email: `admin@alsafragrance.com`
   - Password: `admin123`

## ⚠️ Important Notes

- The default password is `admin123` - **change it after first login in production**
- The fix script is safe to run multiple times
- It won't delete existing data, only create what's missing

## 📚 More Help

For detailed troubleshooting, see: [ADMIN_PANEL_TROUBLESHOOTING.md](./ADMIN_PANEL_TROUBLESHOOTING.md)
