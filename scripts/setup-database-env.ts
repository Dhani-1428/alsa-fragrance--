/**
 * Script to create .env file with AWS RDS database configuration
 * Run with: npx ts-node scripts/setup-database-env.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const ENV_FILE = path.join(process.cwd(), '.env')
const ENV_EXAMPLE = `# AWS RDS MySQL Database Configuration
MYSQL_HOST=alsafragrance.ctu4682g825l.eu-north-1.rds.amazonaws.com
MYSQL_PORT=3306
MYSQL_USER=bfsmanager
MYSQL_PASSWORD=ALSAFRAGRAN
MYSQL_DATABASE=mysql
MYSQL_SSL=true
# Optional: Path to SSL certificate (if not provided, SSL will work without certificate verification)
# MYSQL_SSL_CA=./certs/global-bundle.pem
`

function setupEnvFile() {
  console.log('🔧 Setting up database environment configuration...\n')

  // Check if .env already exists
  if (fs.existsSync(ENV_FILE)) {
    console.log('⚠️  .env file already exists!')
    console.log('   Reading current configuration...\n')
    
    const currentEnv = fs.readFileSync(ENV_FILE, 'utf8')
    
    // Check if database config already exists
    if (currentEnv.includes('MYSQL_HOST')) {
      console.log('✅ Database configuration found in .env file')
      console.log('   If you want to update it, please edit .env manually or delete it and run this script again.\n')
      return
    } else {
      // Append to existing .env
      console.log('📝 Appending database configuration to existing .env file...\n')
      fs.appendFileSync(ENV_FILE, '\n' + ENV_EXAMPLE)
      console.log('✅ Database configuration added to .env file\n')
    }
  } else {
    // Create new .env file
    console.log('📝 Creating new .env file with database configuration...\n')
    fs.writeFileSync(ENV_FILE, ENV_EXAMPLE)
    console.log('✅ .env file created successfully!\n')
  }

  console.log('📋 Database Configuration:')
  console.log('   Host: alsafragrance.ctu4682g825l.eu-north-1.rds.amazonaws.com')
  console.log('   Port: 3306')
  console.log('   User: bfsmanager')
  console.log('   Database: mysql')
  console.log('   SSL: Enabled\n')

  console.log('📝 Next steps:')
  console.log('   1. (Optional) Download SSL certificate: npx ts-node scripts/download-rds-certificate.ts')
  console.log('   2. (Optional) If you downloaded the certificate, uncomment MYSQL_SSL_CA in .env')
  console.log('   3. Test the connection: npm run dev\n')
}

// Run the script
try {
  setupEnvFile()
  console.log('✅ Setup complete!')
  process.exit(0)
} catch (error: any) {
  console.error('❌ Error setting up .env file:', error.message)
  process.exit(1)
}
