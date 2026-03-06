# Database Setup Guide

This project uses AWS RDS MySQL database. Follow these steps to configure the database connection.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# AWS RDS MySQL Database Configuration
MYSQL_HOST=alsafragrance.ctu4682g825l.eu-north-1.rds.amazonaws.com
MYSQL_PORT=3306
MYSQL_USER=bfsmanager
MYSQL_PASSWORD=ALSAFRAGRAN
MYSQL_DATABASE=mysql
MYSQL_SSL=true
# Optional: Path to SSL certificate (if not provided, SSL will work without certificate verification)
# MYSQL_SSL_CA=./certs/global-bundle.pem
```

## SSL Certificate (Optional)

The database connection uses SSL. If you want to use certificate verification, you can download the AWS RDS global bundle certificate:

1. Download the certificate from AWS:
   ```bash
   wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
   ```

2. Create a `certs` directory in the project root:
   ```bash
   mkdir certs
   ```

3. Move the certificate to the certs directory:
   ```bash
   mv global-bundle.pem certs/
   ```

4. Update your `.env` file to include:
   ```env
   MYSQL_SSL_CA=./certs/global-bundle.pem
   ```

**Note:** The connection will work without the certificate file (using `rejectUnauthorized: false`), but using the certificate provides better security.

## Testing the Connection

You can test the database connection by running:

```bash
npm run dev
```

The application will automatically connect to the database when it starts. Check the console for any connection errors.

## Database Schema

Make sure the database schema is created. You can run the schema creation script:

```bash
npx ts-node scripts/create-mysql-schema.ts
```

## Troubleshooting

### Connection Refused
- Check that the host and port are correct
- Verify your network can reach the AWS RDS instance
- Check firewall settings

### Access Denied
- Verify the username and password are correct
- Check that the user has proper permissions

### SSL Errors
- Ensure `MYSQL_SSL=true` is set in your `.env` file
- If using certificate, verify the path is correct
- The connection will work without certificate verification if the certificate file is not found
