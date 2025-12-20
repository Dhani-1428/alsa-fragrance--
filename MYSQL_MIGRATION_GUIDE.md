# MySQL Migration Guide

This guide will help you migrate from MongoDB Atlas to MySQL.

## Prerequisites

1. **MySQL Database**: You need a MySQL database server running (local or remote)
2. **Database Credentials**: Host, port, username, password, and database name

## Step 1: Install Dependencies

```bash
npm install
```

This will install the `mysql2` package that was added to `package.json`.

## Step 2: Set Environment Variables

Create or update your `.env` file with MySQL connection details:

```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=alsa_fragrance
```

For remote MySQL servers, update `MYSQL_HOST` with your server address.

## Step 3: Create MySQL Schema

Run the schema creation script to create all necessary tables:

```bash
npm run db:create-mysql-schema
```

This will create:
- `users` table
- `products` table
- `orders` table

## Step 4: Migrate Data from MongoDB to MySQL

**Important**: Make sure MongoDB is still accessible for this step.

Run the migration script to copy all data:

```bash
npm run db:migrate-to-mysql
```

This will:
- Connect to both MongoDB and MySQL
- Copy all users from MongoDB to MySQL
- Copy all products from MongoDB to MySQL
- Copy all orders from MongoDB to MySQL

## Step 5: Verify Migration

After migration, you can verify the admin user:

```bash
npm run db:check-admin
```

## Step 6: Update Application

The application has been updated to use MySQL instead of MongoDB. All API routes and models now use MySQL.

## Important Notes

1. **MongoDB is no longer used**: The application now exclusively uses MySQL
2. **Data Types**: 
   - Arrays (images, notes, sizes) are stored as JSON in MySQL
   - IDs are now integers instead of MongoDB ObjectIds
3. **Connection**: Make sure your MySQL server is accessible from your application

## Troubleshooting

### Connection Issues

If you get connection errors:
- Verify MySQL server is running
- Check firewall settings
- Verify credentials in `.env` file
- Ensure database exists (create it manually if needed)

### Migration Issues

If migration fails:
- Check that MongoDB is still accessible
- Verify MySQL schema was created successfully
- Check for duplicate entries (migration script skips existing records)

## Next Steps

After successful migration:
1. Test the admin login
2. Verify products are loading correctly
3. Test order creation
4. Remove MongoDB connection string from `.env` (optional)

