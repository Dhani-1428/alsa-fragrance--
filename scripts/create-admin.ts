import { PrismaClient } from '../lib/prisma-client/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@alsafragrance.com'
  const password = 'admin123' // Default password - CHANGE THIS IN PRODUCTION!
  const name = 'Admin User'

  // Check if admin already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log('Admin user already exists!')
    console.log('Email:', email)
    console.log('To reset password, delete the user first or update manually.')
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create admin user with explicit admin role
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'admin', // Explicitly set to admin
    },
  })

  console.log('✅ Admin user created successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Email:', email)
  console.log('🔑 Password:', password)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('⚠️  IMPORTANT: Change the password after first login!')
  console.log('')
  console.log('Access admin panel at: http://localhost:3000/admin/login')
}

main()
  .catch((error) => {
    console.error('Error creating admin user:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

