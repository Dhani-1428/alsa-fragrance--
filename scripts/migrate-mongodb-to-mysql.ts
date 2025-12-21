import 'dotenv/config'

import connectMongo from '../lib/mongodb'
import connectMySQL, { query } from '../lib/mysql'

import User from '../lib/models/User'
import Product from '../lib/models/Product'
import Order from '../lib/models/Order'

async function migrateUsers() {
  console.log('📦 Migrating users from MongoDB to MySQL...')
  
  const users = await User.find({})
  console.log(`Found ${users.length} users in MongoDB`)

  let migrated = 0
  let skipped = 0

  for (const user of users) {
    try {
      // Check if user already exists
      const existing = await query('SELECT id FROM users WHERE email = ?', [user.email.toLowerCase()])
      
      if (Array.isArray(existing) && existing.length > 0) {
        console.log(`⏭️  User ${user.email} already exists, skipping...`)
        skipped++
        continue
      }

      // Insert user
      await query(
        `INSERT INTO users (email, password, name, role, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          user.email.toLowerCase(),
          user.password,
          user.name || null,
          user.role || 'client',
          user.createdAt || new Date(),
          user.updatedAt || new Date(),
        ]
      )

      migrated++
      console.log(`✅ Migrated user: ${user.email}`)
    } catch (error: any) {
      console.error(`❌ Error migrating user ${user.email}:`, error.message)
    }
  }

  console.log(`\n✅ Users migration complete: ${migrated} migrated, ${skipped} skipped\n`)
  return { migrated, skipped }
}

async function migrateProducts() {
  console.log('📦 Migrating products from MongoDB to MySQL...')
  
  const products = await Product.find({})
  console.log(`Found ${products.length} products in MongoDB`)

  let migrated = 0
  let skipped = 0

  for (const product of products) {
    try {
      // Check if product already exists (by name and category)
      const existing = await query(
        'SELECT id FROM products WHERE name = ? AND category = ?',
        [product.name, product.category]
      )
      
      if (Array.isArray(existing) && existing.length > 0) {
        console.log(`⏭️  Product ${product.name} already exists, skipping...`)
        skipped++
        continue
      }

      // Insert product
      await query(
        `INSERT INTO products (
          name, category, price, originalPrice, salePrice, salePercent,
          rating, reviews, image, images, description,
          notesTop, notesMiddle, notesBase, size,
          inStock, isNew, isSale, badge, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.category,
          product.price,
          product.originalPrice || null,
          product.salePrice || null,
          product.salePercent || null,
          product.rating || 0,
          product.reviews || 0,
          product.image,
          JSON.stringify(product.images || []),
          product.description,
          JSON.stringify(product.notesTop || []),
          JSON.stringify(product.notesMiddle || []),
          JSON.stringify(product.notesBase || []),
          JSON.stringify(product.size || []),
          product.inStock !== false,
          product.isNew || false,
          product.isSale || false,
          product.badge || null,
          product.createdAt || new Date(),
          product.updatedAt || new Date(),
        ]
      )

      migrated++
      console.log(`✅ Migrated product: ${product.name}`)
    } catch (error: any) {
      console.error(`❌ Error migrating product ${product.name}:`, error.message)
    }
  }

  console.log(`\n✅ Products migration complete: ${migrated} migrated, ${skipped} skipped\n`)
  return { migrated, skipped }
}

async function migrateOrders() {
  console.log('📦 Migrating orders from MongoDB to MySQL...')
  
  const orders = await Order.find({})
  console.log(`Found ${orders.length} orders in MongoDB`)

  let migrated = 0
  let skipped = 0

  for (const order of orders) {
    try {
      // Check if order already exists
      const existing = await query('SELECT id FROM orders WHERE orderNumber = ?', [order.orderNumber])
      
      if (Array.isArray(existing) && existing.length > 0) {
        console.log(`⏭️  Order ${order.orderNumber} already exists, skipping...`)
        skipped++
        continue
      }

      // Insert order
      await query(
        `INSERT INTO orders (
          orderNumber, billingInfo, cartItems, subtotal, shipping, tax,
          grandTotal, paymentMethod, status, confirmedAt, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.orderNumber,
          JSON.stringify(order.billingInfo),
          JSON.stringify(order.cartItems),
          order.subtotal,
          order.shipping || 0,
          order.tax || 0,
          order.grandTotal,
          order.paymentMethod,
          order.status || 'pending',
          order.confirmedAt || null,
          order.createdAt || new Date(),
          order.updatedAt || new Date(),
        ]
      )

      migrated++
      console.log(`✅ Migrated order: ${order.orderNumber}`)
    } catch (error: any) {
      console.error(`❌ Error migrating order ${order.orderNumber}:`, error.message)
    }
  }

  console.log(`\n✅ Orders migration complete: ${migrated} migrated, ${skipped} skipped\n`)
  return { migrated, skipped }
}

async function main() {
  try {
    console.log('🚀 Starting MongoDB to MySQL migration...\n')
    
    // Connect to both databases
    console.log('Connecting to MongoDB...')
    await connectMongo()
    console.log('✅ Connected to MongoDB\n')

    console.log('Connecting to MySQL...')
    await connectMySQL()
    console.log('✅ Connected to MySQL\n')

    // Migrate data
    await migrateUsers()
    await migrateProducts()
    await migrateOrders()

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Migration completed successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  } catch (error: any) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

main()
