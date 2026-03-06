import 'dotenv/config'
import connectDB, { query } from '../lib/mysql'

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection and tables...\n')
    
    // Connect to database
    await connectDB()
    console.log('✅ Connected to MySQL\n')
    
    // Check current database
    const dbResult: any = await query('SELECT DATABASE() as currentDb')
    const currentDb = dbResult[0]?.currentDb
    console.log(`📊 Current database: ${currentDb}`)
    console.log(`📊 Expected database: ${process.env.MYSQL_DATABASE}\n`)
    
    if (currentDb !== process.env.MYSQL_DATABASE) {
      console.log('⚠️  Database mismatch! Switching to correct database...')
      await query(`USE \`${process.env.MYSQL_DATABASE}\``)
      console.log(`✅ Switched to database: ${process.env.MYSQL_DATABASE}\n`)
    }
    
    // Check if products table exists
    const tables: any = await query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'
    `, [process.env.MYSQL_DATABASE])
    
    if (!Array.isArray(tables) || tables.length === 0) {
      console.log('❌ Products table does NOT exist!')
      console.log('📝 Creating products table...\n')
      
      // Create products table
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
      console.log('✅ Products table created!\n')
    } else {
      console.log('✅ Products table exists!\n')
    }
    
    // Count products
    const countResult: any = await query('SELECT COUNT(*) as count FROM products')
    const count = countResult[0]?.count || 0
    console.log(`📦 Total products in database: ${count}\n`)
    
    if (count === 0) {
      console.log('⚠️  No products found! Run: npx tsx scripts/sync-products-to-mysql.ts')
    } else {
      console.log('✅ Products are available in the database!')
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error('Error details:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

checkDatabase()
