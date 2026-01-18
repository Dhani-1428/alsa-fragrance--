/**
 * Script to update the orders table paymentMethod ENUM to include 'IBAN'
 * Run this script: npx tsx scripts/update-orders-payment-method-enum.ts
 */

import { query } from '../lib/mysql'
import connectDB from '../lib/mysql'

async function updatePaymentMethodEnum() {
  try {
    console.log('🔄 Connecting to database...')
    await connectDB()
    console.log('✅ Connected to database\n')

    console.log('🔄 Updating paymentMethod ENUM to include IBAN...')
    
    // Alter the ENUM to include IBAN
    // Note: MySQL requires recreating the ENUM with all values
    await query(`
      ALTER TABLE orders 
      MODIFY COLUMN paymentMethod ENUM('Card', 'MBWay', 'IBAN') NOT NULL
    `)
    
    console.log('✅ Successfully updated paymentMethod ENUM to include IBAN\n')
    
    // Verify the change
    console.log('🔍 Verifying the change...')
    const [columnInfo]: any = await query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'orders' 
      AND COLUMN_NAME = 'paymentMethod'
    `)
    
    if (columnInfo && columnInfo.COLUMN_TYPE) {
      console.log(`✅ paymentMethod column type: ${columnInfo.COLUMN_TYPE}`)
      if (columnInfo.COLUMN_TYPE.includes('IBAN')) {
        console.log('✅ IBAN is now included in the paymentMethod ENUM!')
      } else {
        console.log('⚠️  Warning: IBAN might not be included. Please check manually.')
      }
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Update completed successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  } catch (error: any) {
    console.error('❌ Error updating paymentMethod ENUM:', error.message)
    console.error('Full error:', error)
    
    // If the ALTER fails, provide instructions
    if (error.message && error.message.includes('ENUM')) {
      console.log('\n💡 If the ALTER TABLE fails, you may need to:')
      console.log('   1. Backup your orders table')
      console.log('   2. Drop and recreate the column with the new ENUM values')
      console.log('   3. Or use a migration tool')
    }
    
    throw error
  } finally {
    process.exit(0)
  }
}

updatePaymentMethodEnum()
