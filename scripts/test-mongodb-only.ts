#!/usr/bin/env tsx
/**
 * MongoDB Connection Test Only
 * Use this to verify MongoDB Atlas connection
 */

console.log('🔍 Testing MongoDB Atlas Connection...\n')

import connectDB from '../lib/mongodb'

async function test() {
  try {
    console.log('📡 Attempting to connect to MongoDB Atlas...')
    await connectDB()
    console.log('✅ SUCCESS: Connected to MongoDB Atlas!')
    console.log('\n✅ MongoDB connection is working correctly.')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ FAILED: MongoDB connection error')
    console.error('Error:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Check MongoDB Atlas connection string in lib/mongodb.ts')
    console.error('2. Verify network access in MongoDB Atlas dashboard')
    console.error('3. Check IP whitelist settings')
    console.error('4. Verify credentials are correct')
    process.exit(1)
  }
}

test()

