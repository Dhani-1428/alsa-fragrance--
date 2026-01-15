import { NextResponse } from 'next/server'

export function handleDatabaseError(error: any) {
  console.error('Database error:', error)
  
  // Check if environment variables are missing
  const missingVars = []
  if (!process.env.MYSQL_HOST) missingVars.push('MYSQL_HOST')
  if (!process.env.MYSQL_USER) missingVars.push('MYSQL_USER')
  if (!process.env.MYSQL_PASSWORD) missingVars.push('MYSQL_PASSWORD')
  if (!process.env.MYSQL_DATABASE) missingVars.push('MYSQL_DATABASE')
  
  if (missingVars.length > 0) {
    return NextResponse.json(
      { 
        error: 'Database configuration missing', 
        details: `Missing environment variables: ${missingVars.join(', ')}. ` +
                 `Please add these in Vercel: Settings → Environment Variables → Production → Add: ` +
                 `MYSQL_HOST, MYSQL_PORT (optional, default: 3306), MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE`
      },
      { status: 500 }
    )
  }
  
  // Provide specific error messages
  let errorMessage = 'Database connection failed'
  let errorDetails = 'Please check your database configuration.'
  
  if (error?.message) {
    if (error.message.includes('Missing required MySQL environment variables')) {
      errorMessage = 'Database configuration incomplete'
      errorDetails = error.message
    } else if (error.message.includes('Cannot connect') || error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to database server'
      errorDetails = 'Please verify your MYSQL_HOST and MYSQL_PORT are correct and the database server is accessible from Vercel.'
    } else if (error.message.includes('Access denied') || error.code === 'ER_ACCESS_DENIED_ERROR') {
      errorMessage = 'Database access denied'
      errorDetails = 'Please check your MYSQL_USER and MYSQL_PASSWORD are correct.'
    } else if (error.message.includes('does not exist') || error.code === 'ER_BAD_DB_ERROR') {
      errorMessage = 'Database not found'
      errorDetails = 'Please verify your MYSQL_DATABASE name is correct or create the database.'
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      errorMessage = 'Database server unreachable'
      errorDetails = 'Please check your MYSQL_HOST is correct and the database server is accessible from the internet.'
    } else {
      errorDetails = error.message
    }
  }
  
  return NextResponse.json(
    { 
      error: errorMessage, 
      details: errorDetails
    },
    { status: 500 }
  )
}

