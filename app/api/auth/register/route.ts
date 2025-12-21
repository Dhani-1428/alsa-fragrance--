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
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Get role from request body, default to 'client'
    const role = body.role || 'client'

    // Create user (password is hashed inside createUser)
    const user = await User.create({
      email: email.toLowerCase(),
      password: password,
      name: name || undefined,
      role: role,
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
  } catch (error) {
    console.error('Error during registration:', error)
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    )
  }
}

