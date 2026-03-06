/**
 * Test API login flow to debug "Failed to query user" error
 */

import 'dotenv/config'
import connectDB from '../lib/mysql'
import User from '../lib/models-mysql/User'

async function testAPILogin() {
  console.log('\n🔍 Testing API Login Flow')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    const testEmail = 'admin@alsafragrance.com'
    const testPassword = 'admin123'

    console.log('1️⃣  Testing database connection...')
    try {
      await connectDB()
      console.log('✅ Database connection successful\n')
    } catch (dbError: any) {
      console.error('❌ Database connection failed:', dbError.message)
      console.error('   Code:', dbError.code)
      throw dbError
    }

    console.log('2️⃣  Testing User.findOne()...')
    try {
      const user = await User.findOne({ email: testEmail })
      if (user) {
        console.log('✅ User found!')
        console.log(`   Email: ${user.email}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Name: ${user.name}`)
        console.log(`   Has Password: ${!!user.password}\n`)
      } else {
        console.log('⚠️  User not found\n')
      }
    } catch (findError: any) {
      console.error('❌ User.findOne() failed!')
      console.error('   Error:', findError.message)
      console.error('   Code:', findError.code)
      console.error('   Errno:', findError.errno)
      console.error('   SQL State:', findError.sqlState)
      console.error('   Stack:', findError.stack)
      throw findError
    }

    console.log('✅ All tests passed!\n')
  } catch (error: any) {
    console.error(`\n❌ Test failed:`, error.message)
    console.error(`   Stack:`, error.stack)
    process.exit(1)
  }
}

testAPILogin()
