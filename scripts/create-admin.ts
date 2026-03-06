import connectDB from '../lib/mysql'
import { findUserByEmail, createUser, updateUserPassword } from '../lib/models-mysql/User'
import User from '../lib/models-mysql/User'

async function main() {
  const email = 'admin@alsafragrance.com'
  const password = 'admin123' // Default password - CHANGE THIS IN PRODUCTION!
  const name = 'Admin User'

  try {
    // Connect to MySQL
    await connectDB()
    console.log('✅ Connected to MySQL')

    // Check if admin already exists
    const existingUser = await findUserByEmail(email.toLowerCase())

    if (existingUser) {
      console.log('⚠️  Admin user already exists!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📧 Email:', existingUser.email)
      console.log('👤 Name:', existingUser.name || 'N/A')
      console.log('🔐 Role:', existingUser.role)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('Resetting password to default: admin123')
      
      // Update password
      await updateUserPassword(existingUser.id!, password)
      
      // Update role if needed
      if (existingUser.role !== 'admin') {
        await User.default.findByIdAndUpdate(existingUser.id!, { role: 'admin' })
      }
      
      console.log('✅ Admin password reset successfully!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📧 Email:', email)
      console.log('🔑 Password:', password)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      return
    }

    // Create admin user with explicit admin role
    const user = await createUser({
      email: email.toLowerCase(),
      password: password,
      name,
      role: 'admin', // Explicitly set to admin
    })

    console.log('✅ Admin user created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('⚠️  IMPORTANT: Change the password after first login!')
    console.log('')
    console.log('Access admin panel at: http://localhost:3000/admin/login')
  } catch (error: any) {
    console.error('Error creating admin user:', error)
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

