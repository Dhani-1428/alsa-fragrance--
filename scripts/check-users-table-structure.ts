import connectDB, { query } from '../lib/mysql'

async function checkUsersTable() {
  try {
    await connectDB()
    console.log('✅ Connected to MySQL\n')

    console.log('Checking users table structure...\n')
    
    // Get table structure
    const [tableInfo]: any = await query(`
      SHOW CREATE TABLE users
    `)
    
    if (Array.isArray(tableInfo) && tableInfo.length > 0) {
      console.log('Table CREATE statement:')
      console.log(tableInfo[0]['Create Table'])
      console.log('\n')
    }

    // Get column info
    const [columnInfo]: any = await query(`
      SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users'
      ORDER BY ORDINAL_POSITION
    `)

    if (Array.isArray(columnInfo) && columnInfo.length > 0) {
      console.log('Column information:')
      columnInfo.forEach((col: any) => {
        console.log(`  ${col.COLUMN_NAME}:`)
        console.log(`    Type: ${col.COLUMN_TYPE}`)
        console.log(`    Nullable: ${col.IS_NULLABLE}`)
        console.log(`    Default: ${col.COLUMN_DEFAULT}`)
        console.log(`    Extra: ${col.EXTRA}`)
        console.log('')
      })
    }

    // Check existing users
    const [userCount]: any = await query('SELECT COUNT(*) as count FROM users')
    const count = (Array.isArray(userCount) && userCount[0]?.count) ? userCount[0].count : 0
    console.log(`Total users in table: ${count}`)

    if (count > 0) {
      const [maxResult]: any = await query('SELECT MAX(id) as maxId, MIN(id) as minId FROM users')
      if (Array.isArray(maxResult) && maxResult.length > 0) {
        console.log(`Max ID: ${maxResult[0].maxId}`)
        console.log(`Min ID: ${maxResult[0].minId}`)
        console.log(`Next ID should be: ${(parseInt(maxResult[0].maxId) || 0) + 1}`)
      }
    }

  } catch (error: any) {
    console.error('❌ Error checking users table:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

checkUsersTable()
