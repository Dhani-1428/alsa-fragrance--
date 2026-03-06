import { NextRequest, NextResponse } from 'next/server'
import connectDB, { query } from '@/lib/mysql'
import { findUserByEmail, createUser, updateUserPassword } from '@/lib/models-mysql/User'
import User from '@/lib/models-mysql/User'

// POST endpoint to setup admin user (one-time setup)
export async function POST(request: NextRequest) {
  try {
    // Simple security check - you can add a secret token here for production
    const { secret } = await request.json().catch(() => ({}))
    
    // For now, allow without secret in development, require secret in production
    if (process.env.NODE_ENV === 'production' && secret !== process.env.ADMIN_SETUP_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized. Secret token required.' },
        { status: 401 }
      )
    }

    await connectDB()
    
    const email = 'admin@alsafragrance.com'
    const password = 'admin123'
    const name = 'Admin User'

    // Ensure users table exists
    try {
      const tables: any = await query(`
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
      `, [process.env.MYSQL_DATABASE])
      
      if (!Array.isArray(tables) || tables.length === 0) {
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
      }
    } catch (tableError: any) {
      console.error('Error creating users table:', tableError)
    }

    // Check if admin exists
    const existingUser = await findUserByEmail(email.toLowerCase())

    if (existingUser) {
      // Reset password and ensure admin role
      await updateUserPassword(existingUser.id!, password)
      if (existingUser.role !== 'admin') {
        await User.default.findByIdAndUpdate(existingUser.id!, { role: 'admin' })
      }
      
      return NextResponse.json({
        success: true,
        message: 'Admin user password reset',
        email: email,
        password: password
      })
    }

    // Create admin user
    const user = await createUser({
      email: email.toLowerCase(),
      password: password,
      name,
      role: 'admin',
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      email: email,
      password: password,
      warning: 'Please change the password after first login!'
    })
  } catch (error: any) {
    console.error('Error setting up admin:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to setup admin user',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
