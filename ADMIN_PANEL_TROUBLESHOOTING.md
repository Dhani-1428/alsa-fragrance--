# Admin Panel Troubleshooting Guide

If you're getting the error **"Failed to query user"** when trying to access the admin panel, follow this guide to diagnose and fix the issue.

## Quick Diagnosis

Run the diagnostic script to check all database connections:

```bash
npx ts-node scripts/diagnose-database.ts
```

This will check:
1. ✅ Environment variables
2. ✅ Database connection
3. ✅ Table existence
4. ✅ Table structure
5. ✅ User queries

## Common Issues and Solutions

### Issue 1: Missing Environment Variables

**Error:** `Missing required MySQL environment variables`

**Solution:**
1. Create or update your `.env` file in the project root:
   ```env
   MYSQL_HOST=alsafragrance.ctu4682g825l.eu-north-1.rds.amazonaws.com
   MYSQL_PORT=3306
   MYSQL_USER=bfsmanager
   MYSQL_PASSWORD=ALSAFRAGRAN
   MYSQL_DATABASE=mysql
   MYSQL_SSL=true
   ```

2. Restart your development server after updating `.env`

### Issue 2: Database Connection Failed

**Error:** `Cannot connect to MySQL server` or `ECONNREFUSED`

**Possible Causes:**
- Database server is not accessible
- Wrong host/port
- Firewall blocking connection
- SSL configuration issue

**Solution:**
1. Verify your database credentials are correct
2. Check that the database server is running and accessible
3. If using AWS RDS, verify:
   - Security group allows connections from your IP
   - Database is publicly accessible (if needed)
   - SSL is properly configured

4. Test connection manually:
   ```bash
   npx ts-node scripts/diagnose-database.ts
   ```

### Issue 3: Database/Table Does Not Exist

**Error:** `Table 'users' doesn't exist` or `ER_BAD_DB_ERROR`

**Solution:**
1. Create the database schema:
   ```bash
   npx ts-node scripts/create-mysql-schema.ts
   ```

2. This will create:
   - `users` table
   - `products` table
   - `orders` table

### Issue 4: Users Table Structure Incorrect

**Error:** `Unknown column` or query fails

**Solution:**
1. Recreate the schema (this is safe, it uses `CREATE TABLE IF NOT EXISTS`):
   ```bash
   npx ts-node scripts/create-mysql-schema.ts
   ```

2. If the table exists but has wrong structure, you may need to drop and recreate:
   ```sql
   DROP TABLE IF EXISTS users;
   ```
   Then run the schema creation script again.

### Issue 5: No Admin User Exists

**Error:** `Invalid email or password` (but connection works)

**Solution:**
1. Create an admin user:
   ```bash
   npx ts-node scripts/create-admin.ts
   ```

2. Default admin credentials:
   - Email: `admin@alsafragrance.com`
   - Password: `admin123`

### Issue 6: SSL Certificate Issues

**Error:** SSL connection errors

**Solution:**
1. The connection should work with `MYSQL_SSL=true` and `rejectUnauthorized: false`
2. For better security, download the SSL certificate:
   ```bash
   npx ts-node scripts/download-rds-certificate.ts
   ```
3. Then add to `.env`:
   ```env
   MYSQL_SSL_CA=./certs/global-bundle.pem
   ```

## Step-by-Step Fix

Follow these steps in order:

### Step 1: Check Environment Variables

```bash
# Verify .env file exists and has correct values
cat .env
```

Should contain:
- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_SSL=true`

### Step 2: Run Diagnostic Script

```bash
npx ts-node scripts/diagnose-database.ts
```

This will tell you exactly what's wrong.

### Step 3: Create Database Schema (if needed)

```bash
npx ts-node scripts/create-mysql-schema.ts
```

### Step 4: Create Admin User (if needed)

```bash
npx ts-node scripts/create-admin.ts
```

### Step 5: Test Admin Login

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/admin/login`

3. Login with:
   - Email: `admin@alsafragrance.com`
   - Password: `admin123`

## Verification Commands

### Check if tables exist:
```bash
npx ts-node scripts/diagnose-database.ts
```

### Check if admin user exists:
```bash
npx ts-node scripts/check-admin.ts
```

### List all users:
```bash
npx ts-node scripts/diagnose-database.ts
# (This will list users in step 6)
```

## Database Connection Test

You can also test the connection directly:

```bash
npx ts-node -e "
import connectDB from './lib/mysql';
connectDB().then(() => {
  console.log('✅ Connection successful!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
});
"
```

## Still Having Issues?

1. **Check server logs** - Look for detailed error messages in your terminal
2. **Enable debug mode** - Set `NODE_ENV=development` in your `.env` for more detailed errors
3. **Check database server** - Verify the AWS RDS instance is running and accessible
4. **Review error details** - The diagnostic script provides specific error codes and solutions

## Error Code Reference

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `ECONNREFUSED` | Cannot connect to server | Check host/port, firewall |
| `ER_ACCESS_DENIED_ERROR` | Wrong username/password | Check credentials |
| `ER_BAD_DB_ERROR` | Database doesn't exist | Create database or check name |
| `ETIMEDOUT` | Connection timeout | Check network, SSL config |
| `ENOTFOUND` | Host not found | Check MYSQL_HOST value |

## Need More Help?

If you've followed all steps and still have issues:

1. Run the diagnostic script and save the output
2. Check your `.env` file (without showing passwords)
3. Check your database server status
4. Review the error messages in your browser's developer console
