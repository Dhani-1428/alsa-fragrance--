import 'dotenv/config'
import connectDB, { query } from '../lib/mysql'

async function checkProducts() {
  try {
    console.log('🔍 Checking database connection and products...\n')
    
    // Connect to database
    await connectDB()
    console.log('✅ Database connection successful!\n')
    
    // Check if products table exists
    const tables: any = await query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'
    `, [process.env.MYSQL_DATABASE])
    
    if (!Array.isArray(tables) || tables.length === 0) {
      console.log('❌ Products table does not exist!')
      console.log('📝 Run: npm run db:create-mysql-schema')
      process.exit(1)
    }
    
    console.log('✅ Products table exists\n')
    
    // Count products
    const countResult: any = await query('SELECT COUNT(*) as count FROM products')
    const count = countResult[0]?.count || 0
    
    console.log(`📊 Total products in database: ${count}\n`)
    
    if (count === 0) {
      console.log('⚠️  No products found in the database!')
      console.log('\n📝 To migrate products, you can:')
      console.log('   1. Run: npm run db:migrate-to-mysql (from MongoDB)')
      console.log('   2. Run: npm run db:migrate-to-aiven (to Aiven MySQL)')
      console.log('   3. Add products manually through the admin panel')
      process.exit(1)
    }
    
    // Show sample products
    const products: any = await query('SELECT id, name, category, price, inStock FROM products LIMIT 5')
    console.log('📦 Sample products:')
    products.forEach((product: any) => {
      console.log(`   - ${product.name} (${product.category}) - $${product.price} - ${product.inStock ? 'In Stock' : 'Out of Stock'}`)
    })
    
    if (count > 5) {
      console.log(`   ... and ${count - 5} more products`)
    }
    
    console.log('\n✅ Products are available in the database!')
    
  } catch (error: any) {
    console.error('❌ Error checking products:', error.message)
    if (error.message.includes('Missing required MySQL')) {
      console.log('\n📝 Please set these environment variables in your .env file:')
      console.log('   MYSQL_HOST=your_host')
      console.log('   MYSQL_PORT=3306')
      console.log('   MYSQL_USER=your_user')
      console.log('   MYSQL_PASSWORD=your_password')
      console.log('   MYSQL_DATABASE=your_database')
    }
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

checkProducts()

