import { NextResponse } from 'next/server'

// This endpoint helps diagnose database configuration issues
export async function GET() {
  const envVars = {
    MYSQL_HOST: process.env.MYSQL_HOST ? '✅ SET' : '❌ MISSING',
    MYSQL_PORT: process.env.MYSQL_PORT ? `✅ SET (${process.env.MYSQL_PORT})` : '❌ MISSING',
    MYSQL_USER: process.env.MYSQL_USER ? '✅ SET' : '❌ MISSING',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD ? '✅ SET' : '❌ MISSING',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE ? `✅ SET (${process.env.MYSQL_DATABASE})` : '❌ MISSING',
    MYSQL_SSL: process.env.MYSQL_SSL ? `✅ SET (${process.env.MYSQL_SSL})` : '❌ MISSING',
  }

  const missing = Object.entries(envVars)
    .filter(([_, value]) => value.includes('❌'))
    .map(([key, _]) => key)

  return NextResponse.json({
    status: missing.length === 0 ? 'OK' : 'MISSING_VARS',
    environment: process.env.NODE_ENV || 'unknown',
    variables: envVars,
    missing: missing,
    message: missing.length === 0 
      ? 'All database environment variables are set correctly!'
      : `Missing variables: ${missing.join(', ')}. Please add them in Vercel Settings → Environment Variables → Production`
  })
}

