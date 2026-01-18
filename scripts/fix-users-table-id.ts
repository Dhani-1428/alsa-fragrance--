import connectDB, { query } from '../lib/mysql'

async function fixUsersTable() {
  try {
    await connectDB()
    console.log('✅ Connected to MySQL\n')

    console.log('Checking users table structure...')
    const [columnInfo]: any = await query(`
      SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'id'
    `)

    if (Array.isArray(columnInfo) && columnInfo.length > 0) {
      const info = columnInfo[0]
      console.log('Current id column info:')
      console.log(`  Type: ${info.COLUMN_TYPE}`)
      console.log(`  Extra: ${info.EXTRA}`)
      console.log(`  Default: ${info.COLUMN_DEFAULT}`)
      console.log(`  Nullable: ${info.IS_NULLABLE}\n`)

      if (!info.EXTRA || !info.EXTRA.includes('auto_increment')) {
        console.log('⚠️  id column does not have AUTO_INCREMENT. Fixing...')
        
        try {
          // First, check if there are any existing records
          const [countResult]: any = await query('SELECT COUNT(*) as count FROM users')
          const count = countResult?.count || 0
          console.log(`Found ${count} existing users\n`)

          // Get max ID to set AUTO_INCREMENT correctly
          let autoIncrementStart = 1
          if (count > 0) {
            const [maxResult]: any = await query('SELECT COALESCE(MAX(id), 0) as maxId FROM users')
            let maxId = 0
            if (Array.isArray(maxResult) && maxResult.length > 0 && maxResult[0]) {
              const rawMaxId = maxResult[0].maxId
              if (typeof rawMaxId === 'number') {
                maxId = Math.floor(rawMaxId)
              } else if (typeof rawMaxId === 'string') {
                maxId = parseInt(rawMaxId, 10) || 0
              }
            }
            autoIncrementStart = maxId + 1
            console.log(`Max existing ID: ${maxId}, setting AUTO_INCREMENT to start at ${autoIncrementStart}`)
          }

          // Fix the id column
          await query(`
            ALTER TABLE users 
            MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT,
            AUTO_INCREMENT = ${autoIncrementStart}
          `)
          
          console.log('✅ Fixed id column to have AUTO_INCREMENT\n')
        } catch (error: any) {
          console.error('❌ Error fixing id column:', error.message)
          console.error('Full error:', error)
          throw error
        }
      } else {
        console.log('✅ id column already has AUTO_INCREMENT\n')
      }
    } else {
      console.log('⚠️  Could not find id column. Creating table...')
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
      console.log('✅ Created users table with AUTO_INCREMENT\n')
    }

    // Verify the fix
    const [verifyInfo]: any = await query(`
      SELECT EXTRA 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'id'
    `)

    if (Array.isArray(verifyInfo) && verifyInfo.length > 0) {
      const extra = verifyInfo[0]?.EXTRA || ''
      if (extra.includes('auto_increment')) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('✅ Verification successful!')
        console.log('✅ id column now has AUTO_INCREMENT')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      } else {
        console.log('⚠️  Warning: AUTO_INCREMENT still not set after fix attempt')
      }
    }

  } catch (error: any) {
    console.error('❌ Error fixing users table:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

fixUsersTable()
