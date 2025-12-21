# Vercel Deployment Guide - MySQL Setup

This guide will help you set up MySQL database connection for your Vercel deployment.

## Step 1: Set Environment Variables in Vercel

You need to add MySQL connection variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

### Required Environment Variables:

```
MYSQL_HOST=your_mysql_host
MYSQL_PORT=3306
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=alsa_fragrance
```

### For Production:
- Add these variables for **Production** environment
- Optionally add for **Preview** and **Development** if needed

### Example Values:

**For Local MySQL:**
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=alsa_fragrance
```

**For Remote MySQL (e.g., PlanetScale, AWS RDS, etc.):**
```
MYSQL_HOST=your-database-host.com
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=alsa_fragrance
```

## Step 2: Important Notes

### Database Accessibility

Your MySQL database must be accessible from Vercel's servers:

1. **If using a remote MySQL server:**
   - Ensure your database allows connections from anywhere (0.0.0.0/0) or Vercel's IP ranges
   - Check firewall settings
   - Verify SSL/TLS if required

2. **If using local MySQL:**
   - This won't work! Vercel needs a publicly accessible database
   - Use a cloud MySQL service instead:
     - **PlanetScale** (recommended for Vercel)
     - **AWS RDS**
     - **Google Cloud SQL**
     - **Azure Database for MySQL**
     - **DigitalOcean Managed Databases**

### Recommended: PlanetScale

PlanetScale is MySQL-compatible and works great with Vercel:

1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a database
3. Get connection string
4. Use the host, user, password from the connection string

## Step 3: Verify Connection

After setting environment variables:

1. **Redeploy your application** in Vercel (or push a new commit)
2. Check the build logs to ensure no connection errors
3. Test the admin login at: `https://your-domain.vercel.app/admin/login`

## Step 4: Troubleshooting

### Error: "Database connection failed"

**Check:**
1. ✅ All environment variables are set in Vercel
2. ✅ Variables are set for the correct environment (Production)
3. ✅ Database is accessible from the internet
4. ✅ Firewall allows connections from Vercel
5. ✅ Database exists and schema is created

### Error: "Access denied"

**Check:**
1. ✅ Username and password are correct
2. ✅ User has permissions to access the database
3. ✅ Database name is correct

### Error: "Database does not exist"

**Solution:**
1. Create the database manually
2. Run the schema creation script locally or via a database client
3. Or use the migration script to set up tables

## Step 5: Create Database Schema

If your database is empty, you need to create the schema:

### Option 1: Run locally (if you have access)
```bash
npm run db:create-mysql-schema
```

### Option 2: Use a database client
Connect to your MySQL database and run the SQL from `scripts/create-mysql-schema.ts`

### Option 3: Use PlanetScale Console
If using PlanetScale, you can run SQL commands in their web console

## Step 6: Create Admin User

After schema is created, create an admin user:

### Option 1: Run locally
```bash
npm run db:create-admin
```

### Option 2: Use a database client
Insert admin user manually with hashed password

## Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use strong passwords** for database
3. **Restrict database access** - Only allow connections from Vercel IPs if possible
4. **Use SSL/TLS** for database connections when available
5. **Rotate passwords** regularly

## Quick Checklist

- [ ] MySQL database is set up and accessible
- [ ] All 5 environment variables are set in Vercel
- [ ] Database schema is created (tables exist)
- [ ] Admin user is created
- [ ] Application is redeployed after setting variables
- [ ] Test admin login works

## Need Help?

If you're still having issues:
1. Check Vercel function logs for detailed error messages
2. Verify database connection from a local script: `npm run db:test-mysql`
3. Check database server logs
4. Ensure database allows connections from Vercel's IP ranges

