import connectDB, { query } from '../lib/mysql'

async function createSchema() {
  try {
    await connectDB()
    console.log('✅ Connected to MySQL\n')

    // Create Users table
    console.log('Creating users table...')
    await query(`
      CREATE TABLE IF NOT EXISTS users (
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
    console.log('✅ Users table created\n')

    // Create Products table
    console.log('Creating products table...')
    await query(`
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
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderNumber VARCHAR(100) NOT NULL UNIQUE,
        billingInfo JSON NOT NULL,
        cartItems JSON NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        shipping DECIMAL(10, 2) NOT NULL DEFAULT 0,
        tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
        grandTotal DECIMAL(10, 2) NOT NULL,
        paymentMethod ENUM('Card', 'MBWay') NOT NULL,
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

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ MySQL schema created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  } catch (error: any) {
    console.error('❌ Error creating schema:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

createSchema()

