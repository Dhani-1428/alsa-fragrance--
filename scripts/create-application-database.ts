/**
 * Create Application Database
 * This script creates a new database for the application
 * Run with: npx ts-node scripts/create-application-database.ts
 */

import 'dotenv/config'
import mysql from 'mysql2/promise'

async function createDatabase() {
  console.log('\n🔧 Creating Application Database')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Connect without specifying database
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST!,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    ssl: process.env.MYSQL_SSL === 'true' ? {
      rejectUnauthorized: false
    } : false,
  })

  try {
    const dbName = process.env.MYSQL_DATABASE || 'alsafragrance'
    
    console.log(`1️⃣  Creating database: ${dbName}...`)
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    console.log(`✅ Database '${dbName}' created or already exists\n`)

    // Switch to the new database
    await connection.execute(`USE \`${dbName}\``)
    console.log(`✅ Using database: ${dbName}\n`)

    // Grant privileges (if needed)
    try {
      await connection.execute(`GRANT ALL PRIVILEGES ON \`${dbName}\`.* TO '${process.env.MYSQL_USER}'@'%'`)
      await connection.execute('FLUSH PRIVILEGES')
      console.log(`✅ Privileges granted\n`)
    } catch (grantError: any) {
      // Ignore grant errors - user might not have permission to grant
      console.log(`⚠️  Could not grant privileges (this is OK if user already has access)\n`)
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Database setup complete!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`\n📝 Update your .env file with:`)
    console.log(`   MYSQL_DATABASE=${dbName}\n`)
    
  } catch (error: any) {
    console.error('❌ Error creating database:', error.message)
    throw error
  } finally {
    await connection.end()
  }
}

createDatabase()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
