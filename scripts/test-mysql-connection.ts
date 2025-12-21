import 'dotenv/config'
import connectDB, { query } from '../lib/mysql'

async function testConnection() {
  try {
    console.log('🔍 Testing MySQL connection...\n')
    
    // Check environment variables
    console.log('Environment variables:')
    console.log('  MYSQL_HOST:', process.env.MYSQL_HOST || '❌ NOT SET')
    console.log('  MYSQL_PORT:', process.env.MYSQL_PORT || '3306 (default)')
    console.log('  MYSQL_USER:', process.env.MYSQL_USER || '❌ NOT SET')
    console.log('  MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD ? '***' : '❌ NOT SET')
    console.log('  MYSQL_DATABASE:', process.env.MYSQL_DATABASE || '❌ NOT SET')
    console.log('')
    
    // Test connection
    console.log('Connecting to MySQL...')
    await connectDB()
    console.log('✅ Successfully connected to MySQL!\n')
    
    // Test query
    console.log('Testing query...')
    const result = await query('SELECT 1 as test')
    console.log('✅ Query test successful:', result)
    
    // Check tables
    console.log('\nChecking tables...')
    const tables: any[] = await query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
    `, [process.env.MYSQL_DATABASE])
    
    console.log(`✅ Found ${tables.length} tables:`)
    tables.forEach((table: any) => {
      console.log(`   - ${table.TABLE_NAME}`)
    })
    
    // Check data counts
    if (tables.some((t: any) => t.TABLE_NAME === 'users')) {
      const userCount: any[] = await query('SELECT COUNT(*) as count FROM users')
      console.log(`\n📊 Users: ${userCount[0]?.count || 0}`)
    }
    
    if (tables.some((t: any) => t.TABLE_NAME === 'products')) {
      const productCount: any[] = await query('SELECT COUNT(*) as count FROM products')
      console.log(`📊 Products: ${productCount[0]?.count || 0}`)
    }
    
    if (tables.some((t: any) => t.TABLE_NAME === 'orders')) {
      const orderCount: any[] = await query('SELECT COUNT(*) as count FROM orders')
      console.log(`📊 Orders: ${orderCount[0]?.count || 0}`)
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ MySQL connection test passed!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  } catch (error: any) {
    console.error('\n❌ Connection test failed!')
    console.error('Error:', error.message)
    console.error('\nTroubleshooting tips:')
    console.error('1. Check your .env file has all required variables')
    console.error('2. Verify MySQL server is running')
    console.error('3. Check host, port, username, and password')
    console.error('4. Ensure database exists')
    console.error('5. Check firewall/network settings')
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

testConnection()

