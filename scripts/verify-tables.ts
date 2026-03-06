/**
 * Verify all tables exist in the current database
 * Run with: npx ts-node scripts/verify-tables.ts
 */

import 'dotenv/config'
import connectDB, { query } from '../lib/mysql'

async function verifyTables() {
  console.log('\n🔍 Verifying Database Tables')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    await connectDB()
    console.log('✅ Connected to database\n')

    const requiredTables = ['users', 'products', 'orders']
    const missingTables: string[] = []

    for (const tableName of requiredTables) {
      try {
        const result: any = await query(`
          SELECT COUNT(*) as count 
          FROM information_schema.tables 
          WHERE table_schema = DATABASE() 
          AND table_name = ?
        `, [tableName])
        
        if (Array.isArray(result) && result.length > 0 && result[0].count > 0) {
          console.log(`✅ Table '${tableName}' exists`)
        } else {
          missingTables.push(tableName)
          console.log(`❌ Table '${tableName}' does NOT exist`)
        }
      } catch (error: any) {
        missingTables.push(tableName)
        console.log(`❌ Error checking table '${tableName}': ${error.message}`)
      }
    }

    if (missingTables.length > 0) {
      console.log(`\n❌ Missing tables: ${missingTables.join(', ')}`)
      console.log('\n💡 Solution: Run the database setup script:')
      console.log('   npm run db:setup\n')
      process.exit(1)
    }

    console.log('\n✅ All required tables exist in the database!')
    console.log(`📝 Database: ${process.env.MYSQL_DATABASE}\n`)
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

verifyTables()
