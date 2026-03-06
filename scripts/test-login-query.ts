/**
 * Test login query to debug "Failed to query user" error
 */

import 'dotenv/config'
import { query } from '../lib/mysql'
import { findUserByEmail } from '../lib/models-mysql/User'

async function testLoginQuery() {
  console.log('\n🔍 Testing Login Query')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    const testEmail = 'admin@alsafragrance.com'
    
    console.log(`1️⃣  Testing direct query...`)
    try {
      const results = await query('SELECT * FROM users WHERE email = ?', [testEmail])
      console.log(`✅ Query successful!`)
      console.log(`   Results:`, results)
      if (Array.isArray(results) && results.length > 0) {
        console.log(`   User found: ${results[0].email}`)
      } else {
        console.log(`   ⚠️  No user found`)
      }
    } catch (queryError: any) {
      console.error(`❌ Query failed:`, queryError.message)
      console.error(`   Code:`, queryError.code)
      console.error(`   Errno:`, queryError.errno)
      throw queryError
    }

    console.log(`\n2️⃣  Testing findUserByEmail...`)
    try {
      const user = await findUserByEmail(testEmail)
      if (user) {
        console.log(`✅ User found!`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Name: ${user.name}`)
      } else {
        console.log(`   ⚠️  No user found`)
      }
    } catch (findError: any) {
      console.error(`❌ findUserByEmail failed:`, findError.message)
      console.error(`   Code:`, findError.code)
      console.error(`   Errno:`, findError.errno)
      throw findError
    }

    console.log(`\n✅ All tests passed!\n`)
  } catch (error: any) {
    console.error(`\n❌ Test failed:`, error.message)
    console.error(`   Stack:`, error.stack)
    process.exit(1)
  }
}

testLoginQuery()
