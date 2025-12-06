#!/usr/bin/env tsx
/**
 * Complete Backend Test Suite - All Tests
 * Tests all features and creates detailed report
 */

import connectDB from '../lib/mongodb'
import User from '../lib/models/User'
import Product from '../lib/models/Product'
import bcrypt from 'bcryptjs'

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'
const TEST_EMAIL = `test-${Date.now()}@test.com`
const TEST_PASSWORD = 'test123456'

interface TestCase {
  id: string
  category: string
  name: string
  description: string
  expectedResult: 'PASS' | 'FAIL'
  actualResult?: 'PASS' | 'FAIL' | 'SKIP'
  error?: string
  details?: any
}

const testCases: TestCase[] = []
let testProductId: string | null = null

function addTest(
  id: string,
  category: string,
  name: string,
  description: string,
  expectedResult: 'PASS' | 'FAIL',
  actualResult: 'PASS' | 'FAIL' | 'SKIP',
  error?: string,
  details?: any
) {
  testCases.push({
    id,
    category,
    name,
    description,
    expectedResult,
    actualResult,
    error,
    details,
  })
}

async function runTest(
  id: string,
  category: string,
  name: string,
  description: string,
  expectedResult: 'PASS' | 'FAIL',
  testFn: () => Promise<boolean>
) {
  try {
    process.stdout.write(`\n[${id}] ${name}... `)
    const result = await testFn()
    const actualResult = result ? 'PASS' : 'FAIL'
    const status = actualResult === expectedResult ? '✅' : '⚠️'
    process.stdout.write(`${status} ${actualResult}\n`)
    
    addTest(id, category, name, description, expectedResult, actualResult, undefined, { result })
    return result
  } catch (error: any) {
    process.stdout.write(`❌ FAIL: ${error.message}\n`)
    addTest(id, category, name, description, expectedResult, 'FAIL', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Complete Backend Test Suite')
  console.log(`📍 Base URL: ${BASE_URL}`)
  console.log(`📅 Test Run: ${new Date().toISOString()}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // ==================== MONGODB TESTS ====================
  console.log('\n📦 MONGODB CONNECTION & MODELS')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await runTest(
    'M001',
    'MongoDB',
    'MongoDB Atlas Connection',
    'Should successfully connect to MongoDB Atlas',
    'PASS',
    async () => {
      await connectDB()
      return true
    }
  )

  await runTest(
    'M002',
    'MongoDB',
    'User Model - Create',
    'Should create a new user in MongoDB',
    'PASS',
    async () => {
      const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10)
      const user = await User.create({
        email: TEST_EMAIL,
        password: hashedPassword,
        name: 'Test User',
        role: 'client',
      })
      return !!user._id
    }
  )

  await runTest(
    'M003',
    'MongoDB',
    'User Model - Find',
    'Should find user by email',
    'PASS',
    async () => {
      const user = await User.findOne({ email: TEST_EMAIL })
      return !!user
    }
  )

  await runTest(
    'M004',
    'MongoDB',
    'User Model - Password Verification',
    'Should verify password hash correctly',
    'PASS',
    async () => {
      const user = await User.findOne({ email: TEST_EMAIL })
      if (!user) return false
      return await bcrypt.compare(TEST_PASSWORD, user.password)
    }
  )

  await runTest(
    'M005',
    'MongoDB',
    'Product Model - Create',
    'Should create a new product in MongoDB',
    'PASS',
    async () => {
      const product = await Product.create({
        name: 'Test Product API',
        category: 'testers',
        price: 29.99,
        rating: 4.5,
        reviews: 10,
        image: '/test.jpg',
        description: 'Test product description',
        inStock: true,
        isNew: true,
        isSale: false,
      })
      testProductId = product._id.toString()
      return !!product._id
    }
  )

  await runTest(
    'M006',
    'MongoDB',
    'Product Model - Find',
    'Should find products by category',
    'PASS',
    async () => {
      const products = await Product.find({ category: 'testers' })
      return products.length > 0
    }
  )

  await runTest(
    'M007',
    'MongoDB',
    'Product Model - Update',
    'Should update product in MongoDB',
    'PASS',
    async () => {
      if (!testProductId) return false
      await Product.findByIdAndUpdate(testProductId, { price: 39.99 })
      const updated = await Product.findById(testProductId)
      return updated?.price === 39.99
    }
  )

  // ==================== AUTHENTICATION TESTS ====================
  console.log('\n🔐 AUTHENTICATION API')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await runTest(
    'A001',
    'Authentication',
    'POST /api/auth/register - Valid Data',
    'Should register a new user successfully',
    'PASS',
    async () => {
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
      return response.status === 201 && !!data.user
    }
  )

  await runTest(
    'A002',
    'Authentication',
    'POST /api/auth/register - Missing Email',
    'Should reject registration without email',
    'PASS',
    async () => {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: TEST_PASSWORD,
          name: 'Test User',
        }),
      })
      return response.status === 400
    }
  )

  await runTest(
    'A003',
    'Authentication',
    'POST /api/auth/login - Valid Credentials',
    'Should login with valid credentials',
    'PASS',
    async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
        }),
      })
      const data = await response.json()
      return response.status === 200 && !!data.user
    }
  )

  await runTest(
    'A004',
    'Authentication',
    'POST /api/auth/login - Invalid Password',
    'Should reject login with wrong password',
    'PASS',
    async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_EMAIL,
          password: 'wrongpassword',
        }),
      })
      return response.status === 401
    }
  )

  await runTest(
    'A005',
    'Authentication',
    'POST /api/auth/login - Non-existent User',
    'Should reject login for non-existent user',
    'PASS',
    async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@test.com',
          password: TEST_PASSWORD,
        }),
      })
      return response.status === 401
    }
  )

  // ==================== PRODUCT API TESTS ====================
  console.log('\n📦 PRODUCT API')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await runTest(
    'P001',
    'Products',
    'GET /api/products - All Products',
    'Should return array of all products',
    'PASS',
    async () => {
      const response = await fetch(`${BASE_URL}/api/products`)
      const data = await response.json()
      return response.status === 200 && Array.isArray(data)
    }
  )

  await runTest(
    'P002',
    'Products',
    'GET /api/products?category=women',
    'Should filter products by category',
    'PASS',
    async () => {
      const response = await fetch(`${BASE_URL}/api/products?category=women`)
      const data = await response.json()
      return response.status === 200 && Array.isArray(data) && 
             (data.length === 0 || data.every((p: any) => p.category === 'women'))
    }
  )

  await runTest(
    'P003',
    'Products',
    'GET /api/products?onSale=true',
    'Should filter products on sale',
    'PASS',
    async () => {
      const response = await fetch(`${BASE_URL}/api/products?onSale=true`)
      const data = await response.json()
      return response.status === 200 && Array.isArray(data) &&
             (data.length === 0 || data.every((p: any) => p.isSale === true))
    }
  )

  await runTest(
    'P004',
    'Products',
    'GET /api/products?isNew=true',
    'Should filter new products',
    'PASS',
    async () => {
      const response = await fetch(`${BASE_URL}/api/products?isNew=true`)
      const data = await response.json()
      return response.status === 200 && Array.isArray(data)
    }
  )

  await runTest(
    'P005',
    'Products',
    'GET /api/products/[id] - Valid ID',
    'Should return single product by ID',
    'PASS',
    async () => {
      if (!testProductId) return false
      const response = await fetch(`${BASE_URL}/api/products/${testProductId}`)
      const data = await response.json()
      return response.status === 200 && data.id === testProductId
    }
  )

  await runTest(
    'P006',
    'Products',
    'GET /api/products/[id] - Invalid ID',
    'Should return 404 for non-existent product',
    'PASS',
    async () => {
      const response = await fetch(`${BASE_URL}/api/products/507f1f77bcf86cd799439011`)
      return response.status === 404
    }
  )

  await runTest(
    'P007',
    'Products',
    'POST /api/products - Create Product',
    'Should create new product via API',
    'PASS',
    async () => {
      const response = await fetch(`${BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'API Test Product',
          category: 'testers',
          price: 19.99,
          rating: 4.0,
          reviews: 5,
          image: '/test-api.jpg',
          description: 'Product created via API',
          inStock: true,
        }),
      })
      const data = await response.json()
      if (response.status === 201 && data.id) {
        testProductId = data.id
        return true
      }
      return false
    }
  )

  await runTest(
    'P008',
    'Products',
    'PUT /api/products/[id] - Update Product',
    'Should update existing product',
    'PASS',
    async () => {
      if (!testProductId) return false
      const response = await fetch(`${BASE_URL}/api/products/${testProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Updated Product Name',
          price: 49.99,
        }),
      })
      const data = await response.json()
      return response.status === 200 && data.name === 'Updated Product Name'
    }
  )

  await runTest(
    'P009',
    'Products',
    'DELETE /api/products/[id] - Delete Product',
    'Should delete product and return success',
    'PASS',
    async () => {
      if (!testProductId) return false
      const response = await fetch(`${BASE_URL}/api/products/${testProductId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      return response.status === 200 && !!data.message
    }
  )

  // ==================== CONTACT API TESTS ====================
  console.log('\n📧 CONTACT API')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await runTest(
    'C001',
    'Contact',
    'POST /api/contact - Valid Form',
    'Should submit contact form successfully',
    'PASS',
    async () => {
      const response = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message content',
        }),
      })
      // May return 503 if Resend not configured - acceptable
      return response.status === 200 || response.status === 503
    }
  )

  // ==================== CHECKOUT API TESTS ====================
  console.log('\n🛒 CHECKOUT API')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await runTest(
    'CH001',
    'Checkout',
    'POST /api/checkout - Card Payment',
    'Should process checkout with card payment',
    'PASS',
    async () => {
      // Get a product first
      const productsRes = await fetch(`${BASE_URL}/api/products`)
      const products = await productsRes.json()
      if (!Array.isArray(products) || products.length === 0) return false

      const response = await fetch(`${BASE_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billingInfo: {
            fullName: 'Test User',
            email: TEST_EMAIL,
            phone: '+1234567890',
            address: '123 Test St',
            city: 'Test City',
            postalCode: '12345',
            country: 'Test Country',
          },
          cartItems: [{
            product: {
              id: products[0].id,
              name: products[0].name,
              price: products[0].price,
              image: products[0].image,
            },
            size: '50ml',
            quantity: 1,
          }],
          subtotal: products[0].price,
          shipping: 0,
          tax: 0,
          grandTotal: products[0].price,
          totalPrice: products[0].price,
          paymentMethod: 'Card',
        }),
      })
      const data = await response.json()
      return response.status === 200 && data.success && !!data.orderId
    }
  )

  await runTest(
    'CH002',
    'Checkout',
    'POST /api/checkout - MBWay Payment',
    'Should process checkout with MBWay payment',
    'PASS',
    async () => {
      const productsRes = await fetch(`${BASE_URL}/api/products`)
      const products = await productsRes.json()
      if (!Array.isArray(products) || products.length === 0) return false

      const response = await fetch(`${BASE_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billingInfo: {
            fullName: 'Test User MBWay',
            email: `mbway-${TEST_EMAIL}`,
            phone: '+351912345678',
            address: '123 Test St',
            city: 'Lisbon',
            postalCode: '1000-001',
            country: 'Portugal',
          },
          cartItems: [{
            product: {
              id: products[0].id,
              name: products[0].name,
              price: products[0].price,
              image: products[0].image,
            },
            size: '50ml',
            quantity: 1,
          }],
          subtotal: products[0].price,
          shipping: 0,
          tax: 0,
          grandTotal: products[0].price,
          totalPrice: products[0].price,
          paymentMethod: 'MBWay',
        }),
      })
      const data = await response.json()
      return response.status === 200 && data.success && data.isMBWayPending === true
    }
  )

  // ==================== CLEANUP ====================
  console.log('\n🧹 CLEANUP')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await runTest(
    'CL001',
    'Cleanup',
    'Delete Test User',
    'Should clean up test user data',
    'PASS',
    async () => {
      await User.deleteOne({ email: TEST_EMAIL })
      return true
    }
  )

  // ==================== SUMMARY ====================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 TEST SUMMARY')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const passed = testCases.filter(t => t.actualResult === 'PASS').length
  const failed = testCases.filter(t => t.actualResult === 'FAIL').length
  const skipped = testCases.filter(t => t.actualResult === 'SKIP').length
  const total = testCases.length

  console.log(`Total Tests: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`)

  // Generate detailed report
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 DETAILED TEST RESULTS')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const categories = [...new Set(testCases.map(t => t.category))]
  for (const category of categories) {
    console.log(`\n[${category}]`)
    const categoryTests = testCases.filter(t => t.category === category)
    categoryTests.forEach(test => {
      const icon = test.actualResult === 'PASS' ? '✅' : test.actualResult === 'FAIL' ? '❌' : '⏭️'
      console.log(`  ${icon} [${test.id}] ${test.name}`)
      if (test.error) {
        console.log(`     Error: ${test.error}`)
      }
    })
  }

  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:')
    testCases.filter(t => t.actualResult === 'FAIL').forEach(test => {
      console.log(`\n  [${test.id}] ${test.name}`)
      console.log(`     Description: ${test.description}`)
      console.log(`     Expected: ${test.expectedResult}`)
      console.log(`     Actual: ${test.actualResult}`)
      if (test.error) {
        console.log(`     Error: ${test.error}`)
      }
    })
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  process.exit(failed > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error('\n❌ Fatal Error:', error)
  process.exit(1)
})

