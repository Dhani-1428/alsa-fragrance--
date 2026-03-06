import { NextRequest, NextResponse } from 'next/server'
import { getAllOrders, type Order } from '@/lib/orders-mysql'
import connectDB from '@/lib/mysql'
import { handleDatabaseError } from '@/lib/db-error-handler'

// GET all orders (admin only)
// Note: In production, add proper server-side authentication (JWT, session, etc.)
// Currently protected by client-side authentication in the admin panel
export async function GET(request: NextRequest) {
  try {
    // Connect to database first
    try {
      await connectDB()
    } catch (dbError: any) {
      return handleDatabaseError(dbError)
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentMethod = searchParams.get('paymentMethod')

    let orders: Order[] = await getAllOrders()

    // Filter by status if provided
    if (status) {
      orders = orders.filter(order => order.status === status)
    }

    // Filter by payment method if provided
    if (paymentMethod) {
      orders = orders.filter(order => order.paymentMethod === paymentMethod)
    }

    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    
    // Handle table not found errors
    if (error.code === 'ER_NO_SUCH_TABLE' || error.message?.includes("doesn't exist")) {
      return NextResponse.json(
        { 
          error: 'Database table not found',
          details: 'The orders table does not exist. Please run: npm run db:setup'
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch orders',
        details: error.code === 'ER_NO_SUCH_TABLE' ? 'Please run: npm run db:setup' : undefined
      },
      { status: 500 }
    )
  }
}

