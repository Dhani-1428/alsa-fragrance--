/**
 * Quick Fix Script for Admin Panel Issues
 * This script will:
 * 1. Check environment variables
 * 2. Test database connection
 * 3. Create database schema if needed
 * 4. Create admin user if needed
 * 
 * Run with: npx ts-node scripts/fix-admin-panel.ts
 */

import 'dotenv/config'
import connectDB, { query } from '../lib/mysql'
import User from '../lib/models-mysql/User'

async function checkAndFix() {
  console.log('\n🔧 Admin Panel Quick Fix Tool')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Step 1: Check environment variables
  console.log('1️⃣  Checking environment variables...')
  const required = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.log(`❌ Missing environment variables: ${missing.join(', ')}`)
    console.log('\n📝 Please add these to your .env file:')
    console.log('   MYSQL_HOST=alsafragrance.ctu4682g825l.eu-north-1.rds.amazonaws.com')
    console.log('   MYSQL_PORT=3306')
    console.log('   MYSQL_USER=bfsmanager')
    console.log('   MYSQL_PASSWORD=ALSAFRAGRAN')
    console.log('   MYSQL_DATABASE=mysql')
    console.log('   MYSQL_SSL=true\n')
    process.exit(1)
  }
  console.log('✅ Environment variables OK\n')

  // Step 2: Test connection
  console.log('2️⃣  Testing database connection...')
  try {
    await connectDB()
    console.log('✅ Database connection successful\n')
  } catch (error: any) {
    console.error(`❌ Database connection failed: ${error.message}`)
    console.log('\n💡 Please check:')
    console.log('   1. Database credentials in .env file')
    console.log('   2. Database server is running and accessible')
    console.log('   3. Network/firewall allows connections\n')
    process.exit(1)
  }

  // Step 3: Check if users table exists
  console.log('3️⃣  Checking users table...')
  try {
    const result: any = await query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'users'
    `)
    
    const tableExists = Array.isArray(result) && result.length > 0 && result[0].count > 0
    
    if (!tableExists) {
      console.log('⚠️  Users table does not exist. Creating schema...')
      
      // Create users table
      await query(`
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
      
      console.log('✅ Users table created\n')
    } else {
      console.log('✅ Users table exists\n')
    }
  } catch (error: any) {
    console.error(`❌ Error checking/creating users table: ${error.message}\n`)
    process.exit(1)
  }

  // Step 4: Check if admin user exists
  console.log('4️⃣  Checking admin user...')
  const adminEmail = 'admin@alsafragrance.com'
  const adminPassword = 'admin123'
  
  try {
    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() })
    
    if (existingUser) {
      console.log('✅ Admin user exists')
      console.log(`   Email: ${existingUser.email}`)
      console.log(`   Role: ${existingUser.role}`)
      
      // Ensure role is admin
      if (existingUser.role !== 'admin') {
        console.log('⚠️  User role is not admin. Updating...')
        await User.findByIdAndUpdate(existingUser.id!, { role: 'admin' })
        console.log('✅ Role updated to admin\n')
      } else {
        console.log('')
      }
      
      // Reset password to default
      console.log('🔄 Resetting password to default (admin123)...')
      await User.updateUserPassword(existingUser.id!, adminPassword)
      console.log('✅ Password reset\n')
    } else {
      console.log('⚠️  Admin user does not exist. Creating...')
      
      const newUser = await User.create({
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        name: 'Admin User',
        role: 'admin',
      })
      
      console.log('✅ Admin user created successfully!\n')
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Admin Panel Setup Complete!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email: admin@alsafragrance.com')
    console.log('🔑 Password: admin123')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🌐 Access admin panel at: http://localhost:3000/admin/login\n')
    
  } catch (error: any) {
    console.error(`❌ Error with admin user: ${error.message}`)
    console.error(error)
    process.exit(1)
  }
}

// Run the fix
checkAndFix()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
