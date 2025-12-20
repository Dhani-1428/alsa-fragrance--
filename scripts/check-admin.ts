import connectDB, { query } from '../lib/mysql'
import User from '../lib/models-mysql/User'
import bcrypt from 'bcryptjs'

async function main() {
  const email = 'admin@alsafragrance.com'
  const password = 'admin123'

  try {
    // Connect to MySQL
    await connectDB()
    console.log('✅ Connected to MySQL\n')

    // Check if admin exists
    const adminUser = await User.findOne({ email: email.toLowerCase() })

    if (!adminUser) {
      console.log('❌ Admin user NOT FOUND in database!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('To create admin user, run: npm run db:create-admin')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      return
    }

    console.log('✅ Admin user FOUND!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', adminUser.email)
    console.log('👤 Name:', adminUser.name || 'N/A')
    console.log('🔐 Role:', adminUser.role)
    console.log('📅 Created:', adminUser.createdAt || 'N/A')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // Test password
    console.log('Testing password...')
    const isValidPassword = await bcrypt.compare(password, adminUser.password)
    
    if (isValidPassword) {
      console.log('✅ Password is CORRECT!')
      console.log('You can login with:')
      console.log('  Email: admin@alsafragrance.com')
      console.log('  Password: admin123')
    } else {
      console.log('❌ Password is INCORRECT!')
      console.log('The stored password hash does not match "admin123"')
      console.log('You may need to reset the password or create a new admin user.')
    }

    // List all users
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('All users in database:')
    const allUsers: any[] = await query('SELECT email, role, name, createdAt FROM users ORDER BY createdAt DESC')
    console.log(`Total users: ${allUsers.length}`)
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role}) - ${user.name || 'No name'}`)
    })
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error(error)
    throw error
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })

