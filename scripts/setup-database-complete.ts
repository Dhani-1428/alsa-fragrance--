/**
 * Complete Database Setup
 * Creates database and all tables
 * Run with: npx ts-node scripts/setup-database-complete.ts
 */

import 'dotenv/config'
import mysql from 'mysql2/promise'
import * as fs from 'fs'
import * as path from 'path'

// Get SSL configuration
function getSSLConfig() {
  const sslEnabled = process.env.MYSQL_SSL === 'true' || process.env.MYSQL_SSL === 'REQUIRED'
  
  if (!sslEnabled) {
    return false
  }

  const sslConfig: any = {
    rejectUnauthorized: false
  }

  if (process.env.MYSQL_SSL_CA) {
    const certPath = process.env.MYSQL_SSL_CA
    try {
      let certContent: string
      if (path.isAbsolute(certPath)) {
        certContent = fs.readFileSync(certPath, 'utf8')
      } else {
        const projectRoot = process.cwd()
        certContent = fs.readFileSync(path.join(projectRoot, certPath), 'utf8')
      }
      sslConfig.ca = certContent
    } catch (error) {
      // Ignore certificate read errors
    }
  }

  return sslConfig
}

async function setupDatabase() {
  console.log('\n🔧 Complete Database Setup')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Step 1: Connect without database
  console.log('1️⃣  Connecting to MySQL server...')
  let connection
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST!,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER!,
      password: process.env.MYSQL_PASSWORD!,
      ssl: getSSLConfig(),
    })
    console.log('✅ Connected to MySQL server\n')
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message)
    throw error
  }

  try {
    // Step 2: Create or use database
    // Use 'alsafragrance' as default instead of 'mysql' system database
    const dbName = process.env.MYSQL_DATABASE === 'mysql' ? 'alsafragrance' : (process.env.MYSQL_DATABASE || 'alsafragrance')
    console.log(`2️⃣  Setting up database: ${dbName}...`)
    
    try {
      // Use query instead of execute for CREATE DATABASE
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
      console.log(`✅ Database '${dbName}' ready\n`)
    } catch (error: any) {
      if (error.code === 'ER_DBACCESS_DENIED_ERROR') {
        console.log(`⚠️  Cannot create database. Trying to use existing database...`)
        // Try to use the database - use query instead of execute
        try {
          await connection.query(`USE \`${dbName}\``)
          console.log(`✅ Using existing database: ${dbName}\n`)
        } catch (useError: any) {
          console.error(`❌ Cannot access database '${dbName}': ${useError.message}`)
          console.log('\n💡 Solutions:')
          console.log('   1. Create the database manually in your MySQL client')
          console.log(`   2. Or update MYSQL_DATABASE in .env to an existing database`)
          console.log(`   3. Recommended: Update .env with MYSQL_DATABASE=${dbName}`)
          throw useError
        }
      } else {
        throw error
      }
    }

    // Switch to the database - use query instead of execute
    await connection.query(`USE \`${dbName}\``)

    // Step 3: Create tables
    console.log('3️⃣  Creating tables...\n')

    // Users table
    console.log('   Creating users table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) DEFAULT NULL,
        role ENUM('client', 'admin') DEFAULT 'client',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Users table created\n')

    // Products table
    console.log('   Creating products table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        originalPrice DECIMAL(10, 2) DEFAULT NULL,
        salePrice DECIMAL(10, 2) DEFAULT NULL,
        salePercent DECIMAL(5, 2) DEFAULT NULL,
        rating DECIMAL(3, 2) DEFAULT 0,
        reviews INT DEFAULT 0,
        image TEXT NOT NULL,
        images JSON DEFAULT NULL,
        description TEXT NOT NULL,
        notesTop JSON DEFAULT NULL,
        notesMiddle JSON DEFAULT NULL,
        notesBase JSON DEFAULT NULL,
        size JSON DEFAULT NULL,
        inStock BOOLEAN DEFAULT TRUE,
        isNew BOOLEAN DEFAULT FALSE,
        isSale BOOLEAN DEFAULT FALSE,
        badge VARCHAR(100) DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_inStock (inStock),
        INDEX idx_isNew (isNew),
        INDEX idx_isSale (isSale)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Products table created\n')

    // Orders table
    console.log('   Creating orders table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderNumber VARCHAR(100) NOT NULL UNIQUE,
        billingInfo JSON NOT NULL,
        cartItems JSON NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        shipping DECIMAL(10, 2) NOT NULL DEFAULT 0,
        tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
        grandTotal DECIMAL(10, 2) NOT NULL,
        paymentMethod ENUM('Card', 'MBWay', 'IBAN') NOT NULL,
        status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
        confirmedAt TIMESTAMP NULL DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_orderNumber (orderNumber),
        INDEX idx_status (status),
        INDEX idx_paymentMethod (paymentMethod),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Orders table created\n')

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Database setup complete!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`\n📝 Database: ${dbName}`)
    console.log('📝 Tables created: users, products, orders\n')
    
    // Update .env file if needed
    if (process.env.MYSQL_DATABASE !== dbName) {
      console.log('⚠️  Note: Your .env file has MYSQL_DATABASE set to a different value.')
      console.log(`   Consider updating it to: MYSQL_DATABASE=${dbName}\n`)
    }

  } catch (error: any) {
    console.error('❌ Error setting up database:', error.message)
    throw error
  } finally {
    await connection.end()
  }
}

setupDatabase()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
