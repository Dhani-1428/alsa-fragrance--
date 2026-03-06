# AWS RDS Database Configuration

This project has been configured to use the AWS RDS MySQL database.

## Database Credentials

- **Host:** alsafragrance.ctu4682g825l.eu-north-1.rds.amazonaws.com
- **Port:** 3306
- **Database:** mysql
- **Username:** bfsmanager
- **Password:** ALSAFRAGRAN
- **SSL:** Required

## Configuration Files Updated

1. **lib/mysql.ts** - Updated to support:
   - AWS RDS connection with SSL
   - Optional SSL certificate file support
   - Increased connection timeout for cloud connections (30 seconds)

## Environment Variables

Make sure your `.env` file contains:

```env
MYSQL_HOST=alsafragrance.ctu4682g825l.eu-north-1.rds.amazonaws.com
MYSQL_PORT=3306
MYSQL_USER=bfsmanager
MYSQL_PASSWORD=ALSAFRAGRAN
MYSQL_DATABASE=mysql
MYSQL_SSL=true
```

### Optional: SSL Certificate

If you want to use certificate verification (recommended for production), you can:

1. Download the certificate:
   ```bash
   npx ts-node scripts/download-rds-certificate.ts
   ```

2. Add to your `.env`:
   ```env
   MYSQL_SSL_CA=./certs/global-bundle.pem
   ```

**Note:** The connection will work without the certificate file (using `rejectUnauthorized: false`), but using the certificate provides better security.

## Setup Scripts

- **Setup .env file:** `npx ts-node scripts/setup-database-env.ts`
- **Download SSL certificate:** `npx ts-node scripts/download-rds-certificate.ts`

## Testing the Connection

Start your development server:

```bash
npm run dev
```

The application will automatically connect to the database. Check the console for any connection errors.

## All Database Operations

All database operations in this project now use the AWS RDS MySQL database:
- User authentication
- Product management
- Order processing
- All API endpoints

The configuration is centralized in `lib/mysql.ts` and used throughout the application.
