import { NextRequest, NextResponse } from 'next/server'
import { getAllOrders, type Order } from '@/lib/orders'

// GET all orders (admin only)
// Note: In production, add proper server-side authentication (JWT, session, etc.)
// Currently protected by client-side authentication in the admin panel
export async function GET(request: NextRequest) {
  try {

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
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

