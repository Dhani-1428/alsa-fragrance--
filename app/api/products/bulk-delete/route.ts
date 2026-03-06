import { NextRequest, NextResponse } from 'next/server'
import connectDB, { query } from '@/lib/mysql'
import { handleDatabaseError } from '@/lib/db-error-handler'

// DELETE all products
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

    // Get count before deletion
    const countResult: any = await query('SELECT COUNT(*) as count FROM products')
    const countBefore = countResult[0]?.count || 0

    // Delete all products
    const result: any = await query('DELETE FROM products')
    const deletedCount = result.affectedRows || 0

    console.log(`✅ Deleted ${deletedCount} products from database`)

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} products`,
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
