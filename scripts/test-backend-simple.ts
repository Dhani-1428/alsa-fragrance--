#!/usr/bin/env tsx
/**
 * Simplified Backend Test Suite with Better Output
 */

import connectDB from '../lib/mongodb'
import User from '../lib/models/User'
import Product from '../lib/models/Product'
import bcrypt from 'bcryptjs'

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'
const TEST_EMAIL = `test-${Date.now()}@test.com`
const TEST_PASSWORD = 'test123456'

let passed = 0
let failed = 0

function test(name: string, fn: () => Promise<boolean> | boolean) {
  return async () => {
    try {
      process.stdout.write(`\n🧪 ${name}... `)
      const result = await fn()
      if (result) {
        process.stdout.write('✅ PASSED\n')
        passed++
        return true
      } else {
        process.stdout.write('❌ FAILED\n')
        failed++
        return false
      }
    } catch (error: any) {
      process.stdout.write(`❌ FAILED: ${error.message}\n`)
      failed++
      return false
    }
  }
}

async function main() {
  console.log('🚀 Backend Test Suite')
  console.log(`📍 Base URL: ${BASE_URL}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // MongoDB Tests
  await test('MongoDB Connection', async () => {
    await connectDB()
    return true
  })()

  await test('User Model - Create', async () => {
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10)
    const user = await User.create({
      email: TEST_EMAIL,
      password: hashedPassword,
      name: 'Test User',
      role: 'client',
    })
    return !!user._id
  })()

  await test('User Model - Find', async () => {
    const user = await User.findOne({ email: TEST_EMAIL })
    return !!user
  })()

  await test('User Model - Password Verify', async () => {
    const user = await User.findOne({ email: TEST_EMAIL })
    if (!user) return false
    return await bcrypt.compare(TEST_PASSWORD, user.password)
  })()

  await test('Product Model - Create', async () => {
    const product = await Product.create({
      name: 'Test Product',
      category: 'testers',
      price: 29.99,
      rating: 4.5,
      reviews: 10,
      image: '/test.jpg',
      description: 'Test description',
      inStock: true,
    })
    return !!product._id
  })()

  await test('Product Model - Find', async () => {
    const products = await Product.find({ category: 'testers' })
    return products.length > 0
  })()

  // API Tests
  await test('API - GET /api/products', async () => {
    const response = await fetch(`${BASE_URL}/api/products`)
    const data = await response.json()
    return response.status === 200 && Array.isArray(data)
  })()

  await test('API - GET /api/products?category=women', async () => {
    const response = await fetch(`${BASE_URL}/api/products?category=women`)
    const data = await response.json()
    return response.status === 200 && Array.isArray(data)
  })()

  await test('API - POST /api/auth/register', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `register-${Date.now()}@test.com`,
        password: TEST_PASSWORD,
        name: 'Test User',
      }),
    })
    const data = await response.json()
    return response.status === 201 && data.user
  })()

  await test('API - POST /api/auth/login', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }),
    })
    const data = await response.json()
    return response.status === 200 && data.user
  })()

  // Cleanup
  await test('Cleanup - Delete Test User', async () => {
    await User.deleteOne({ email: TEST_EMAIL })
    return true
  })()

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Test Summary')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`Total Tests: ${passed + failed}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  process.exit(failed > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error('\n❌ Fatal Error:', error)
  process.exit(1)
})

