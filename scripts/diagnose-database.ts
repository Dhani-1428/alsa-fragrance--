/**
 * Comprehensive Database Diagnostic Script
 * Run with: npx ts-node scripts/diagnose-database.ts
 * 
 * This script will check:
 * 1. Environment variables
 * 2. Database connection
 * 3. Table existence
 * 4. Table structure
 * 5. Sample queries
 */

import 'dotenv/config'
import connectDB, { query, getPool } from '../lib/mysql'

async function checkEnvironmentVariables() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('1️⃣  Checking Environment Variables')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const required = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE']
  const missing: string[] = []
  const present: string[] = []

  required.forEach(key => {
    if (process.env[key]) {
      present.push(key)
      if (key === 'MYSQL_PASSWORD') {
        console.log(`✅ ${key}: ${'*'.repeat(process.env[key]!.length)}`)
      } else {
        console.log(`✅ ${key}: ${process.env[key]}`)
      }
    } else {
      missing.push(key)
      console.log(`❌ ${key}: MISSING`)
    }
  })

  console.log(`\n✅ MYSQL_PORT: ${process.env.MYSQL_PORT || '3306 (default)'}`)
  console.log(`✅ MYSQL_SSL: ${process.env.MYSQL_SSL || 'false'}`)
  if (process.env.MYSQL_SSL_CA) {
    console.log(`✅ MYSQL_SSL_CA: ${process.env.MYSQL_SSL_CA}`)
  }

  if (missing.length > 0) {
    console.log(`\n❌ Missing required variables: ${missing.join(', ')}`)
    console.log('\n📝 Please add these to your .env file:')
    missing.forEach(key => {
      console.log(`   ${key}=your_value`)
    })
    return false
  }

  console.log('\n✅ All required environment variables are present\n')
  return true
}

async function testConnection() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('2️⃣  Testing Database Connection')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    await connectDB()
    console.log('✅ Database connection successful!\n')
    return true
  } catch (error: any) {
    console.error('❌ Database connection failed!')
    console.error(`   Error: ${error.message}`)
    console.error(`   Code: ${error.code || 'N/A'}`)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solution: Check that:')
      console.log('   1. The database server is running')
      console.log('   2. MYSQL_HOST and MYSQL_PORT are correct')
      console.log('   3. Your firewall allows connections')
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Solution: Check that:')
      console.log('   1. MYSQL_USER and MYSQL_PASSWORD are correct')
      console.log('   2. The user has proper permissions')
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Solution: Check that:')
      console.log('   1. MYSQL_DATABASE name is correct')
      console.log('   2. The database exists on the server')
      console.log('   3. Run: npx ts-node scripts/create-mysql-schema.ts')
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      console.log('\n💡 Solution: Check that:')
      console.log('   1. MYSQL_HOST is correct and reachable')
      console.log('   2. Your network can access the database server')
      console.log('   3. SSL configuration is correct (if required)')
    }
    
    console.log('')
    return false
  }
}

async function checkTables() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('3️⃣  Checking Database Tables')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const requiredTables = ['users', 'products', 'orders']
  const missingTables: string[] = []
  const existingTables: string[] = []

  try {
    for (const tableName of requiredTables) {
      try {
        const result: any = await query(`
          SELECT COUNT(*) as count 
          FROM information_schema.tables 
          WHERE table_schema = DATABASE() 
          AND table_name = ?
        `, [tableName])
        
        if (Array.isArray(result) && result.length > 0 && result[0].count > 0) {
          existingTables.push(tableName)
          console.log(`✅ Table '${tableName}' exists`)
          
          // Get row count
          try {
            const countResult: any = await query(`SELECT COUNT(*) as count FROM ${tableName}`)
            const count = Array.isArray(countResult) && countResult.length > 0 ? countResult[0].count : 0
            console.log(`   └─ Rows: ${count}`)
          } catch (countError: any) {
            console.log(`   └─ ⚠️  Could not count rows: ${countError.message}`)
          }
        } else {
          missingTables.push(tableName)
          console.log(`❌ Table '${tableName}' does NOT exist`)
        }
      } catch (error: any) {
        console.log(`❌ Error checking table '${tableName}': ${error.message}`)
        missingTables.push(tableName)
      }
    }

    if (missingTables.length > 0) {
      console.log(`\n❌ Missing tables: ${missingTables.join(', ')}`)
      console.log('\n💡 Solution: Run the schema creation script:')
      console.log('   npx ts-node scripts/create-mysql-schema.ts\n')
      return false
    }

    console.log('\n✅ All required tables exist\n')
    return true
  } catch (error: any) {
    console.error(`❌ Error checking tables: ${error.message}\n`)
    return false
  }
}

async function checkUsersTableStructure() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('4️⃣  Checking Users Table Structure')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    const columns: any = await query(`
      SELECT 
        COLUMN_NAME, 
        DATA_TYPE, 
        IS_NULLABLE, 
        COLUMN_DEFAULT,
        COLUMN_KEY,
        EXTRA
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users'
      ORDER BY ORDINAL_POSITION
    `)

    if (!Array.isArray(columns) || columns.length === 0) {
      console.log('❌ Users table does not exist or has no columns\n')
      return false
    }

    console.log('Users table structure:')
    columns.forEach((col: any) => {
      const nullable = col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'
      const key = col.COLUMN_KEY ? ` [${col.COLUMN_KEY}]` : ''
      const extra = col.EXTRA ? ` ${col.EXTRA}` : ''
      console.log(`   - ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${nullable}${key}${extra}`)
    })

    // Check for required columns
    const requiredColumns = ['id', 'email', 'password', 'role']
    const existingColumnNames = columns.map((c: any) => c.COLUMN_NAME.toLowerCase())
    const missingColumns = requiredColumns.filter(col => !existingColumnNames.includes(col.toLowerCase()))

    if (missingColumns.length > 0) {
      console.log(`\n❌ Missing required columns: ${missingColumns.join(', ')}\n`)
      return false
    }

    console.log('\n✅ Users table structure is correct\n')
    return true
  } catch (error: any) {
    console.error(`❌ Error checking table structure: ${error.message}\n`)
    return false
  }
}

async function testUserQuery() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('5️⃣  Testing User Query')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    // Test the exact query used in the login route
    const testEmail = 'admin@alsafragrance.com'
    const results: any = await query('SELECT * FROM users WHERE email = ?', [testEmail.toLowerCase().trim()])
    
    if (Array.isArray(results)) {
      if (results.length > 0) {
        console.log(`✅ Query successful! Found user: ${testEmail}`)
        const user = results[0]
        console.log(`   - ID: ${user.id}`)
        console.log(`   - Email: ${user.email}`)
        console.log(`   - Role: ${user.role}`)
        console.log(`   - Name: ${user.name || 'N/A'}`)
        console.log(`   - Has Password: ${user.password ? 'Yes' : 'No'}`)
      } else {
        console.log(`⚠️  Query successful but no user found with email: ${testEmail}`)
        console.log('   This is normal if the admin user has not been created yet.')
        console.log('   Run: npx ts-node scripts/create-admin.ts')
      }
    } else {
      console.log('⚠️  Query returned unexpected format')
      console.log(`   Result type: ${typeof results}`)
    }

    console.log('\n✅ User query test completed\n')
    return true
  } catch (error: any) {
    console.error(`❌ User query failed!`)
    console.error(`   Error: ${error.message}`)
    console.error(`   Code: ${error.code || 'N/A'}`)
    console.error(`   SQL State: ${error.sqlState || 'N/A'}\n`)
    
    if (error.message.includes("doesn't exist")) {
      console.log('💡 Solution: The users table might not exist.')
      console.log('   Run: npx ts-node scripts/create-mysql-schema.ts\n')
    } else if (error.message.includes("Unknown column")) {
      console.log('💡 Solution: The users table structure might be incorrect.')
      console.log('   Run: npx ts-node scripts/create-mysql-schema.ts\n')
    }
    
    return false
  }
}

async function listAllUsers() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('6️⃣  Listing All Users')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    const users: any = await query('SELECT id, email, name, role, createdAt FROM users ORDER BY createdAt DESC LIMIT 10')
    
    if (Array.isArray(users) && users.length > 0) {
      console.log(`Found ${users.length} user(s):\n`)
      users.forEach((user: any, index: number) => {
        console.log(`${index + 1}. ${user.email} (${user.role})`)
        if (user.name) console.log(`   Name: ${user.name}`)
        console.log(`   ID: ${user.id}`)
        console.log(`   Created: ${user.createdAt || 'N/A'}`)
        console.log('')
      })
    } else {
      console.log('⚠️  No users found in the database')
      console.log('   Run: npx ts-node scripts/create-admin.ts\n')
    }
  } catch (error: any) {
    console.error(`❌ Error listing users: ${error.message}\n`)
  }
}

async function main() {
  console.log('\n🔍 Database Diagnostic Tool')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const results = {
    env: false,
    connection: false,
    tables: false,
    structure: false,
    query: false,
  }

  // Step 1: Check environment variables
  results.env = await checkEnvironmentVariables()
  if (!results.env) {
    console.log('❌ Cannot proceed without environment variables\n')
    process.exit(1)
  }

  // Step 2: Test connection
  results.connection = await testConnection()
  if (!results.connection) {
    console.log('❌ Cannot proceed without database connection\n')
    process.exit(1)
  }

  // Step 3: Check tables
  results.tables = await checkTables()

  // Step 4: Check table structure
  if (results.tables) {
    results.structure = await checkUsersTableStructure()
  }

  // Step 5: Test user query
  if (results.structure) {
    results.query = await testUserQuery()
  }

  // Step 6: List users
  if (results.query) {
    await listAllUsers()
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Diagnostic Summary')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log(`Environment Variables: ${results.env ? '✅' : '❌'}`)
  console.log(`Database Connection: ${results.connection ? '✅' : '❌'}`)
  console.log(`Tables Exist: ${results.tables ? '✅' : '❌'}`)
  console.log(`Table Structure: ${results.structure ? '✅' : '❌'}`)
  console.log(`User Query: ${results.query ? '✅' : '❌'}\n`)

  if (results.env && results.connection && results.tables && results.structure && results.query) {
    console.log('✅ All checks passed! Database is properly configured.\n')
    process.exit(0)
  } else {
    console.log('❌ Some checks failed. Please review the errors above.\n')
    console.log('📝 Next steps:')
    if (!results.tables) {
      console.log('   1. Create database schema: npx ts-node scripts/create-mysql-schema.ts')
    }
    if (!results.query) {
      console.log('   2. Create admin user: npx ts-node scripts/create-admin.ts')
    }
    console.log('')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
