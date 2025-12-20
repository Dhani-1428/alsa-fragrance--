import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mysql'
import User from '@/lib/models-mysql/User'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Connect to database
    try {
      await connectDB()
    } catch (dbError: any) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { 
          error: 'Database connection failed', 
          details: process.env.NODE_ENV === 'development' ? dbError?.message : undefined 
        },
        { status: 500 }
      )
    }

    // Find user
    let user
    const searchEmail = email.toLowerCase().trim()
    try {
      user = await User.findOne({ email: searchEmail })
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Login attempt:', { email: searchEmail, userFound: !!user })
        if (user) {
          console.log('User found:', { email: user.email, role: user.role, hasPassword: !!user.password })
        }
      }
    } catch (findError: any) {
      console.error('Error finding user:', findError)
      return NextResponse.json(
        { 
          error: 'Failed to query user', 
          details: process.env.NODE_ENV === 'development' ? findError?.message : undefined 
        },
        { status: 500 }
      )
    }

    if (!user) {
      // In development, provide more helpful error
      if (process.env.NODE_ENV === 'development') {
        console.log('User not found for email:', searchEmail)
      }
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    let isValidPassword = false
    try {
      isValidPassword = await bcrypt.compare(password, user.password)
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Password comparison result:', isValidPassword)
      }
    } catch (bcryptError: any) {
      console.error('Password comparison error:', bcryptError)
      return NextResponse.json(
        { 
          error: 'Failed to verify password', 
          details: process.env.NODE_ENV === 'development' ? bcryptError?.message : undefined 
        },
        { status: 500 }
      )
    }

    if (!isValidPassword) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Password mismatch for user:', user.email)
      }
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Return user info (in production, use JWT tokens)
    return NextResponse.json({
      user: {
        id: user.id?.toString() || '',
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('Unexpected error during login:', error)
    return NextResponse.json(
      { 
        error: error?.message || 'Failed to login', 
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined 
      },
      { status: 500 }
    )
  }
}

