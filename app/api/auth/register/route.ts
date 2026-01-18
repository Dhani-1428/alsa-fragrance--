import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mysql'
import User from '@/lib/models-mysql/User'
import { handleDatabaseError } from '@/lib/db-error-handler'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    try {
      await connectDB()
    } catch (dbError: any) {
      return handleDatabaseError(dbError)
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Get role from request body, default to 'client'
    const role = body.role || 'client'
    
    // Normalize role to ensure it's 'client' or 'admin'
    let normalizedRole: 'client' | 'admin' = 'client'
    if (role === 'admin') {
      normalizedRole = 'admin'
    }

    // Create user (password is hashed inside createUser)
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: password,
      name: name || undefined,
      role: normalizedRole,
    })

    return NextResponse.json(
      {
        user: {
          id: user.id?.toString() || '',
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error during registration:', error)
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
    })
    return NextResponse.json(
      { 
        error: error?.message || 'Failed to register',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}

