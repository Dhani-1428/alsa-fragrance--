import { NextRequest, NextResponse } from 'next/server'
import connectDB, { query } from '@/lib/mysql'
import { handleDatabaseError } from '@/lib/db-error-handler'

// DELETE products - can delete all or selected products
export async function DELETE(request: NextRequest) {
  try {
    // Connect to database
    try {
      await connectDB()
    } catch (dbError: any) {
      return handleDatabaseError(dbError)
    }

    // Ensure we're using the correct database
    try {
      const dbResult: any = await query('SELECT DATABASE() as currentDb')
      const currentDb = dbResult[0]?.currentDb
      const expectedDb = process.env.MYSQL_DATABASE
      
      if (currentDb !== expectedDb && expectedDb) {
        await query(`USE \`${expectedDb}\``)
      }
    } catch (dbSwitchError: any) {
      console.error('⚠️  Database switch error:', dbSwitchError.message)
    }

    // Check if specific product IDs are provided
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')
    
    let deletedCount = 0
    let countBefore = 0

    if (idsParam) {
      // Delete selected products by IDs
      const productIds = idsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id) && id > 0)
      
      if (productIds.length === 0) {
        return NextResponse.json(
          { error: 'No valid product IDs provided' },
          { status: 400 }
        )
      }

      // Get count before deletion
      countBefore = productIds.length

      // Delete products by IDs
      const placeholders = productIds.map(() => '?').join(',')
      const result: any = await query(
        `DELETE FROM products WHERE id IN (${placeholders})`,
        productIds
      )
      deletedCount = result.affectedRows || 0

      console.log(`✅ Deleted ${deletedCount} selected products from database`)
    } else {
      // Delete all products
      const countResult: any = await query('SELECT COUNT(*) as count FROM products')
      countBefore = countResult[0]?.count || 0

      const result: any = await query('DELETE FROM products')
      deletedCount = result.affectedRows || 0

      console.log(`✅ Deleted ${deletedCount} products from database`)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} product(s)`,
      deletedCount: deletedCount,
      countBefore: countBefore
    })
  } catch (error: any) {
    console.error('❌ Error deleting all products:', error)
    
    // Handle MySQL connection errors
    if (error.message && (error.message.includes('ECONNREFUSED') || error.message.includes('MySQL') || error.code === 'ECONNREFUSED')) {
      return NextResponse.json(
        { 
          error: 'MySQL connection failed. Please check your database configuration.',
          details: error.message,
          code: error.code
        },
        { status: 503 }
      )
    }
    
    // Handle database query errors
    if (error.code && error.code.startsWith('ER_')) {
      let errorMessage = 'Database query error.'
      let errorDetails = error.message
      
      if (error.code === 'ER_NO_SUCH_TABLE') {
        errorMessage = 'Database table not found'
        errorDetails = `The products table does not exist. Please run: npm run db:setup`
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorDetails,
          code: error.code
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to delete products',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        code: error.code
      },
      { status: 500 }
    )
  }
}
