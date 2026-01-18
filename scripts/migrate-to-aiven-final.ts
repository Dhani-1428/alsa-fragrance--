import 'dotenv/config'
import mysql from 'mysql2/promise'

// Aiven MySQL connection configuration - using environment variables
const AIVEN_CONFIG = {
  host: process.env.MYSQL_HOST || process.env.AIVEN_MYSQL_HOST || '',
  port: Number(process.env.MYSQL_PORT || process.env.AIVEN_MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || process.env.AIVEN_MYSQL_USER || '',
  password: process.env.MYSQL_PASSWORD || process.env.AIVEN_MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || process.env.AIVEN_MYSQL_DATABASE || 'defaultdb',
  ssl: (process.env.MYSQL_SSL === 'true' || process.env.AIVEN_MYSQL_SSL === 'true') ? {
    rejectUnauthorized: false
  } : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000, // 30 seconds for cloud connections
}

let aivenPool: mysql.Pool | null = null

function getAivenPool(): mysql.Pool {
  if (!aivenPool) {
    aivenPool = mysql.createPool(AIVEN_CONFIG)
  }
  return aivenPool
}

async function connectAivenDB(): Promise<mysql.Pool> {
  try {
    const pool = getAivenPool()
    const conn = await pool.getConnection()
    await conn.ping()
    conn.release()
    console.log('✅ Connected to Aiven MySQL database')
    return pool
  } catch (error: any) {
    console.error('❌ Aiven MySQL connection error:', error.message)
    throw error
  }
}

async function queryAiven(sql: string, params?: any[], retries = 3) {
  const pool = getAivenPool()
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const [rows] = await pool.execute(sql, params)
      return rows
    } catch (error: any) {
      if (attempt === retries) {
        throw error
      }
      // If it's a connection error, wait and retry
      if (error.code === 'ECONNRESET' || error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ETIMEDOUT') {
        console.log(`   Connection error, retrying (${attempt}/${retries})...`)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        continue
      }
      throw error
    }
  }
}

// Try to connect to MongoDB
async function tryConnectMongoDB() {
  try {
    const connectMongo = await import('../lib/mongodb').then(m => m.default)
    await connectMongo()
    const User = (await import('../lib/models/User')).default
    const Product = (await import('../lib/models/Product')).default
    const Order = (await import('../lib/models/Order')).default
    
    // Test connection by trying to count users
    await User.countDocuments()
    return { User, Product, Order, source: 'mongodb' as const }
  } catch (error: any) {
    console.log('⚠️  MongoDB not available:', error.message)
    return null
  }
}

// Try to connect to MySQL
async function tryConnectMySQL() {
  try {
    const connectMySQL = await import('../lib/mysql').then(m => m.default)
    await connectMySQL()
    const { query } = await import('../lib/mysql')
    
    // Test connection by trying to query users
    await query('SELECT COUNT(*) as count FROM users LIMIT 1')
    return { query, source: 'mysql' as const }
  } catch (error: any) {
    console.log('⚠️  MySQL not available:', error.message)
    return null
  }
}

async function createAivenSchema() {
  console.log('📋 Creating schema in Aiven MySQL...\n')
  
  try {
    // Check if users table exists and fix role column if needed
    console.log('Checking/Creating users table...')
    const usersTableExists: any[] = await queryAiven(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'users'
    `)
    
    if (Array.isArray(usersTableExists) && usersTableExists[0]?.count > 0) {
      // Table exists, check and fix role column
      console.log('Users table exists, checking role column...')
      const roleColumn: any[] = await queryAiven(`
        SELECT COLUMN_TYPE 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'role'
      `)
      
      if (Array.isArray(roleColumn) && roleColumn.length > 0) {
        const columnType = roleColumn[0].COLUMN_TYPE
        console.log(`Current role column type: ${columnType}`)
        if (!columnType.includes("'client'") || !columnType.includes("'admin'")) {
          console.log('Fixing role column definition...')
          // Change column to VARCHAR temporarily to allow any value
          console.log('Temporarily changing role column to VARCHAR...')
          await queryAiven(`ALTER TABLE users MODIFY COLUMN role VARCHAR(50)`)
          // Update all rows to valid values
          console.log('Updating existing user roles to valid values...')
          await queryAiven(`UPDATE users SET role = 'client' WHERE role NOT IN ('client', 'admin') OR role IS NULL`)
          // Now change back to ENUM
          console.log('Changing role column back to ENUM...')
          await queryAiven(`ALTER TABLE users MODIFY COLUMN role ENUM('client', 'admin') DEFAULT 'client'`)
        }
      }
    } else {
      // Create new table
      await queryAiven(`
        CREATE TABLE users (
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
    
    // Verify the table structure is correct
    const tableInfo: any[] = await queryAiven(`
      SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'id'
    `)
    
    if (Array.isArray(tableInfo) && tableInfo.length > 0) {
      const idColumn = tableInfo[0]
      const extra = idColumn.EXTRA || ''
      if (!extra.includes('auto_increment')) {
        console.log('Fixing id column to be AUTO_INCREMENT...')
        try {
          // Try to modify, but if there's a foreign key constraint, the column might already be correct
          // or we need to handle it differently
          await queryAiven(`ALTER TABLE users MODIFY COLUMN id INT AUTO_INCREMENT`)
        } catch (error: any) {
          // If it fails due to foreign key, check if it's actually already AUTO_INCREMENT
          // or if we need to drop/recreate the foreign key
          if (error.code === 'ER_FK_INCOMPATIBLE_COLUMNS' || error.code === 'ER_FK_CANNOT_DROP_PARENT') {
            console.log('   Note: Foreign key constraint exists. Checking if id is already AUTO_INCREMENT...')
            // The column might already be AUTO_INCREMENT, so we'll proceed
          } else {
            throw error
          }
        }
      } else {
        console.log('✅ id column is already AUTO_INCREMENT')
      }
    }
    
    // Double-check: Query the actual table structure
    const actualStructure: any[] = await queryAiven(`SHOW CREATE TABLE users`)
    if (Array.isArray(actualStructure) && actualStructure.length > 0) {
      const createTable = actualStructure[0]['Create Table'] || ''
      if (!createTable.includes('AUTO_INCREMENT')) {
        console.log('⚠️  Warning: id column may not be AUTO_INCREMENT. Attempting to fix...')
        // Check for foreign key constraints
        const fkConstraints: any[] = await queryAiven(`
          SELECT CONSTRAINT_NAME 
          FROM information_schema.KEY_COLUMN_USAGE 
          WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'users' 
          AND REFERENCED_TABLE_NAME IS NOT NULL
        `)
        
        // Temporarily drop foreign key constraints
        await queryAiven(`SET FOREIGN_KEY_CHECKS = 0`)
        try {
          for (const fk of fkConstraints) {
            if (fk.CONSTRAINT_NAME) {
              console.log(`   Temporarily dropping foreign key: ${fk.CONSTRAINT_NAME}`)
              await queryAiven(`ALTER TABLE subscriptions DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`)
            }
          }
          
          // Now fix the id column
          await queryAiven(`ALTER TABLE users MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT`)
          console.log('✅ Fixed id column to be AUTO_INCREMENT')
          
          // Recreate foreign key constraints
          for (const fk of fkConstraints) {
            if (fk.CONSTRAINT_NAME) {
              console.log(`   Recreating foreign key: ${fk.CONSTRAINT_NAME}`)
              await queryAiven(`ALTER TABLE subscriptions ADD CONSTRAINT ${fk.CONSTRAINT_NAME} FOREIGN KEY (userId) REFERENCES users(id)`)
            }
          }
        } catch (e: any) {
          console.log(`   Could not modify id column: ${e.message}`)
        }
        await queryAiven(`SET FOREIGN_KEY_CHECKS = 1`)
      }
    }
    
    console.log('✅ Users table ready\n')

    // Create Products table
    console.log('Creating products table...')
    await queryAiven(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        originalPrice DECIMAL(10, 2) DEFAULT NULL,
        salePrice DECIMAL(10, 2) DEFAULT NULL,
        salePercent DECIMAL(5, 2) DEFAULT NULL,
        rating DECIMAL(3, 2) DEFAULT 0,
        reviews INT DEFAULT 0,
        image TEXT NOT NULL,
        images JSON DEFAULT NULL,
        description TEXT NOT NULL,
        notesTop JSON DEFAULT NULL,
        notesMiddle JSON DEFAULT NULL,
        notesBase JSON DEFAULT NULL,
        size JSON DEFAULT NULL,
        inStock BOOLEAN DEFAULT TRUE,
        isNew BOOLEAN DEFAULT FALSE,
        isSale BOOLEAN DEFAULT FALSE,
        badge VARCHAR(100) DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_inStock (inStock),
        INDEX idx_isNew (isNew),
        INDEX idx_isSale (isSale)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('✅ Products table created\n')

    // Create Orders table
    console.log('Creating orders table...')
    await queryAiven(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderNumber VARCHAR(100) NOT NULL UNIQUE,
        billingInfo JSON NOT NULL,
        cartItems JSON NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        shipping DECIMAL(10, 2) NOT NULL DEFAULT 0,
        tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
        grandTotal DECIMAL(10, 2) NOT NULL,
        paymentMethod ENUM('Card', 'MBWay', 'IBAN') NOT NULL,
        status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
        confirmedAt TIMESTAMP NULL DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_orderNumber (orderNumber),
        INDEX idx_status (status),
        INDEX idx_paymentMethod (paymentMethod),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('✅ Orders table created\n')
  } catch (error: any) {
    console.error('❌ Error creating schema:', error.message)
    throw error
  }
}

async function migrateUsersFromMongoDB(User: any) {
  console.log('📦 Migrating users from MongoDB to Aiven MySQL...')
  
  const users = await User.find({})
  console.log(`Found ${users.length} users in MongoDB`)

  // Get the current max id to start from (ensure it's an integer)
  const maxIdResult: any[] = await queryAiven(`SELECT COALESCE(MAX(CAST(id AS UNSIGNED)), 0) as maxId FROM users WHERE id REGEXP '^[0-9]+$'`)
  let nextId = 1
  if (Array.isArray(maxIdResult) && maxIdResult[0]?.maxId) {
    const maxId = parseInt(maxIdResult[0].maxId) || 0
    nextId = maxId + 1
  }
  console.log(`Starting user id from: ${nextId}`)

  let migrated = 0
  let skipped = 0

  for (const user of users) {
    try {
      // Check if user already exists
      const existing: any[] = await queryAiven('SELECT id FROM users WHERE email = ?', [user.email.toLowerCase()])
      
      if (Array.isArray(existing) && existing.length > 0) {
        skipped++
        if (skipped % 10 === 0) {
          console.log(`⏭️  Skipped ${skipped} existing users...`)
        }
        continue
      }

      // Normalize role to ensure it's 'client' or 'admin'
      let roleValue = user.role
      if (roleValue === null || roleValue === undefined) {
        roleValue = 'client'
      }
      if (typeof roleValue === 'object' && roleValue !== null) {
        roleValue = String(roleValue)
      }
      // Convert to string and clean it thoroughly
      let role = String(roleValue || 'client').toLowerCase().trim()
      // Remove any quotes, special characters, and whitespace
      role = role.replace(/['"`]/g, '').replace(/\s+/g, '').trim()
      // Handle various role formats
      if (role.includes('admin') || role === 'administrator') {
        role = 'admin'
      } else {
        role = 'client'
      }
      
      // Final validation - ensure it's exactly 'client' or 'admin'
      if (role !== 'client' && role !== 'admin') {
        console.log(`⚠️  Invalid role '${role}' (from '${roleValue}') for user ${user.email}, forcing to 'client'`)
        role = 'client'
      }

      // Insert user with explicit id and unique tenantId (use id as tenantId)
      const userId = nextId++
      await queryAiven(
        `INSERT INTO users (id, email, password, name, role, tenantId, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          user.email.toLowerCase().trim(),
          user.password || '',
          user.name || null,
          role,
          userId, // Use same id as tenantId
          user.createdAt || new Date(),
          user.updatedAt || new Date(),
        ]
      )

      migrated++
      if (migrated % 10 === 0) {
        console.log(`✅ Migrated ${migrated} users...`)
      }
    } catch (error: any) {
      console.error(`❌ Error migrating user ${user.email}:`, error.message)
      // Log the actual role value for debugging
      console.error(`   User role value: ${JSON.stringify(user.role)}`)
    }
  }

  console.log(`\n✅ Users migration complete: ${migrated} migrated, ${skipped} skipped\n`)
  return { migrated, skipped }
}

async function migrateUsersFromMySQL(query: any) {
  console.log('📦 Migrating users from MySQL to Aiven MySQL...')
  
  const users: any[] = await query('SELECT * FROM users')
  console.log(`Found ${users.length} users in source MySQL`)

  // Get the current max id to start from (ensure it's an integer)
  const maxIdResult: any[] = await queryAiven(`SELECT COALESCE(MAX(CAST(id AS UNSIGNED)), 0) as maxId FROM users WHERE id REGEXP '^[0-9]+$'`)
  let nextId = 1
  if (Array.isArray(maxIdResult) && maxIdResult[0]?.maxId) {
    const maxId = parseInt(maxIdResult[0].maxId) || 0
    nextId = maxId + 1
  }
  console.log(`Starting user id from: ${nextId}`)

  let migrated = 0
  let skipped = 0

  for (const user of users) {
    try {
      // Check if user already exists
      const existing: any[] = await queryAiven('SELECT id FROM users WHERE email = ?', [user.email.toLowerCase()])
      
      if (Array.isArray(existing) && existing.length > 0) {
        skipped++
        if (skipped % 10 === 0) {
          console.log(`⏭️  Skipped ${skipped} existing users...`)
        }
        continue
      }

      // Normalize role to ensure it's 'client' or 'admin'
      let roleValue = user.role
      if (roleValue === null || roleValue === undefined) {
        roleValue = 'client'
      }
      if (typeof roleValue === 'object' && roleValue !== null) {
        roleValue = String(roleValue)
      }
      // Convert to string and clean it thoroughly
      let role = String(roleValue || 'client').toLowerCase().trim()
      // Remove any quotes, special characters, and whitespace
      role = role.replace(/['"`]/g, '').replace(/\s+/g, '').trim()
      // Handle various role formats
      if (role.includes('admin') || role === 'administrator') {
        role = 'admin'
      } else {
        role = 'client'
      }
      
      // Final validation - ensure it's exactly 'client' or 'admin'
      if (role !== 'client' && role !== 'admin') {
        console.log(`⚠️  Invalid role '${role}' (from '${roleValue}') for user ${user.email}, forcing to 'client'`)
        role = 'client'
      }

      // Insert user (don't specify id, let AUTO_INCREMENT handle it)
      // Insert user with explicit id and unique tenantId (use id as tenantId)
      const userId = nextId++
      await queryAiven(
        `INSERT INTO users (id, email, password, name, role, tenantId, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          user.email.toLowerCase().trim(),
          user.password || '',
          user.name || null,
          role,
          userId, // Use same id as tenantId
          user.createdAt || new Date(),
          user.updatedAt || new Date(),
        ]
      )

      migrated++
      if (migrated % 10 === 0) {
        console.log(`✅ Migrated ${migrated} users...`)
      }
    } catch (error: any) {
      console.error(`❌ Error migrating user ${user.email}:`, error.message)
      // Log the actual role value for debugging
      console.error(`   User role value: ${JSON.stringify(user.role)}`)
    }
  }

  console.log(`\n✅ Users migration complete: ${migrated} migrated, ${skipped} skipped\n`)
  return { migrated, skipped }
}

async function migrateProductsFromMongoDB(Product: any) {
  console.log('📦 Migrating products from MongoDB to Aiven MySQL...')
  
  const products = await Product.find({})
  console.log(`Found ${products.length} products in MongoDB`)

  let migrated = 0
  let skipped = 0

  for (const product of products) {
    try {
      // Check if product already exists (by name and category)
      const existing: any[] = await queryAiven(
        'SELECT id FROM products WHERE name = ? AND category = ?',
        [product.name, product.category]
      )
      
      if (Array.isArray(existing) && existing.length > 0) {
        skipped++
        if (skipped % 10 === 0) {
          console.log(`⏭️  Skipped ${skipped} existing products...`)
        }
        continue
      }

      // Insert product
      await queryAiven(
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
          product.images ? JSON.stringify(product.images) : null,
          product.description,
          product.notesTop ? JSON.stringify(product.notesTop) : null,
          product.notesMiddle ? JSON.stringify(product.notesMiddle) : null,
          product.notesBase ? JSON.stringify(product.notesBase) : null,
          product.size ? JSON.stringify(product.size) : null,
          product.inStock !== false ? 1 : 0,
          product.isNew ? 1 : 0,
          product.isSale ? 1 : 0,
          product.badge || null,
          product.createdAt || new Date(),
          product.updatedAt || new Date(),
        ]
      )

      migrated++
      if (migrated % 10 === 0) {
        console.log(`✅ Migrated ${migrated} products...`)
      }
    } catch (error: any) {
      console.error(`❌ Error migrating product ${product.name}:`, error.message)
    }
  }

  console.log(`\n✅ Products migration complete: ${migrated} migrated, ${skipped} skipped\n`)
  return { migrated, skipped }
}

async function migrateProductsFromMySQL(query: any) {
  console.log('📦 Migrating products from MySQL to Aiven MySQL...')
  
  const products: any[] = await query('SELECT * FROM products')
  console.log(`Found ${products.length} products in source MySQL`)

  let migrated = 0
  let skipped = 0

  for (const product of products) {
    try {
      // Check if product already exists (by name and category)
      const existing: any[] = await queryAiven(
        'SELECT id FROM products WHERE name = ? AND category = ?',
        [product.name, product.category]
      )
      
      if (Array.isArray(existing) && existing.length > 0) {
        skipped++
        if (skipped % 10 === 0) {
          console.log(`⏭️  Skipped ${skipped} existing products...`)
        }
        continue
      }

      // Insert product
      await queryAiven(
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
          product.images ? (typeof product.images === 'string' ? product.images : JSON.stringify(product.images)) : null,
          product.description,
          product.notesTop ? (typeof product.notesTop === 'string' ? product.notesTop : JSON.stringify(product.notesTop)) : null,
          product.notesMiddle ? (typeof product.notesMiddle === 'string' ? product.notesMiddle : JSON.stringify(product.notesMiddle)) : null,
          product.notesBase ? (typeof product.notesBase === 'string' ? product.notesBase : JSON.stringify(product.notesBase)) : null,
          product.size ? (typeof product.size === 'string' ? product.size : JSON.stringify(product.size)) : null,
          product.inStock ? 1 : 0,
          product.isNew ? 1 : 0,
          product.isSale ? 1 : 0,
          product.badge || null,
          product.createdAt || new Date(),
          product.updatedAt || new Date(),
        ]
      )

      migrated++
      if (migrated % 10 === 0) {
        console.log(`✅ Migrated ${migrated} products...`)
      }
    } catch (error: any) {
      console.error(`❌ Error migrating product ${product.name}:`, error.message)
    }
  }

  console.log(`\n✅ Products migration complete: ${migrated} migrated, ${skipped} skipped\n`)
  return { migrated, skipped }
}

async function migrateOrdersFromMongoDB(Order: any) {
  console.log('📦 Migrating orders from MongoDB to Aiven MySQL...')
  
  const orders = await Order.find({})
  console.log(`Found ${orders.length} orders in MongoDB`)

  let migrated = 0
  let skipped = 0

  for (const order of orders) {
    try {
      // Check if order already exists
      const existing: any[] = await queryAiven('SELECT id FROM orders WHERE orderNumber = ?', [order.orderNumber])
      
      if (Array.isArray(existing) && existing.length > 0) {
        skipped++
        if (skipped % 10 === 0) {
          console.log(`⏭️  Skipped ${skipped} existing orders...`)
        }
        continue
      }

      // Insert order
      await queryAiven(
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
      if (migrated % 10 === 0) {
        console.log(`✅ Migrated ${migrated} orders...`)
      }
    } catch (error: any) {
      console.error(`❌ Error migrating order ${order.orderNumber}:`, error.message)
    }
  }

  console.log(`\n✅ Orders migration complete: ${migrated} migrated, ${skipped} skipped\n`)
  return { migrated, skipped }
}

async function migrateOrdersFromMySQL(query: any) {
  console.log('📦 Migrating orders from MySQL to Aiven MySQL...')
  
  const orders: any[] = await query('SELECT * FROM orders')
  console.log(`Found ${orders.length} orders in source MySQL`)

  let migrated = 0
  let skipped = 0

  for (const order of orders) {
    try {
      // Check if order already exists
      const existing: any[] = await queryAiven('SELECT id FROM orders WHERE orderNumber = ?', [order.orderNumber])
      
      if (Array.isArray(existing) && existing.length > 0) {
        skipped++
        if (skipped % 10 === 0) {
          console.log(`⏭️  Skipped ${skipped} existing orders...`)
        }
        continue
      }

      // Insert order
      await queryAiven(
        `INSERT INTO orders (
          orderNumber, billingInfo, cartItems, subtotal, shipping, tax,
          grandTotal, paymentMethod, status, confirmedAt, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.orderNumber,
          typeof order.billingInfo === 'string' ? order.billingInfo : JSON.stringify(order.billingInfo),
          typeof order.cartItems === 'string' ? order.cartItems : JSON.stringify(order.cartItems),
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
      if (migrated % 10 === 0) {
        console.log(`✅ Migrated ${migrated} orders...`)
      }
    } catch (error: any) {
      console.error(`❌ Error migrating order ${order.orderNumber}:`, error.message)
    }
  }

  console.log(`\n✅ Orders migration complete: ${migrated} migrated, ${skipped} skipped\n`)
  return { migrated, skipped }
}

async function main() {
  try {
    console.log('🚀 Starting migration to Aiven MySQL...\n')
    console.log(`📍 Target: ${AIVEN_CONFIG.host}:${AIVEN_CONFIG.port}/${AIVEN_CONFIG.database}\n`)
    
    // Connect to Aiven database
    console.log('Connecting to Aiven MySQL database...')
    await connectAivenDB()
    console.log('')

    // Create schema in Aiven
    await createAivenSchema()

    // Try to detect source database
    console.log('🔍 Detecting source database...\n')
    const mongoSource = await tryConnectMongoDB()
    const mysqlSource = mongoSource ? null : await tryConnectMySQL()

    if (!mongoSource && !mysqlSource) {
      throw new Error('❌ No source database found! Please ensure MongoDB or MySQL is configured and accessible.')
    }

    const sourceType = mongoSource ? 'MongoDB' : 'MySQL'
    console.log(`✅ Source database detected: ${sourceType}\n`)

    // Migrate data based on source
    if (mongoSource) {
      await migrateUsersFromMongoDB(mongoSource.User)
      await migrateProductsFromMongoDB(mongoSource.Product)
      await migrateOrdersFromMongoDB(mongoSource.Order)
    } else if (mysqlSource) {
      await migrateUsersFromMySQL(mysqlSource.query)
      await migrateProductsFromMySQL(mysqlSource.query)
      await migrateOrdersFromMySQL(mysqlSource.query)
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Migration to Aiven MySQL completed successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n📝 Next steps:')
    console.log('1. Update your .env file with Aiven credentials:')
    console.log('   MYSQL_HOST=your_aiven_host')
    console.log('   MYSQL_PORT=your_aiven_port')
    console.log('   MYSQL_USER=your_aiven_user')
    console.log('   MYSQL_PASSWORD=your_aiven_password')
    console.log('   MYSQL_DATABASE=defaultdb')
    console.log('   MYSQL_SSL=true')
    console.log('2. Update Vercel environment variables with the same values')
    console.log('3. Redeploy your application')
  } catch (error: any) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    if (aivenPool) {
      await aivenPool.end()
    }
    process.exit(0)
  }
}

main()

