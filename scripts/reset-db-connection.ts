/**
 * Reset Database Connection Pool
 * This script forces the connection pool to reset and use the correct database
 * Run with: npx ts-node scripts/reset-db-connection.ts
 */

import 'dotenv/config'
import { resetPool } from '../lib/mysql'

console.log('\n🔄 Resetting MySQL Connection Pool')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

try {
  resetPool()
  console.log('✅ Connection pool reset successfully!')
  console.log('\n📝 Next steps:')
  console.log('   1. Restart your Next.js development server')
  console.log('   2. The new connection will use database:', process.env.MYSQL_DATABASE || 'alsafragrance')
  console.log('')
} catch (error: any) {
  console.error('❌ Error resetting pool:', error.message)
  process.exit(1)
}

process.exit(0)
