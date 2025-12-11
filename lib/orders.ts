import connectDB from './mongodb'
import Order from './models/Order'

export interface Order {
  id: string
  orderNumber: string
  billingInfo: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
    additionalNotes?: string
  }
  cartItems: Array<{
    product: {
      id: string | number // Support both string (MongoDB ObjectId) and number
      name: string
      price: number
      image?: string
    }
    size: string
    quantity: number
  }>
  subtotal: number
  shipping: number
  tax: number
  grandTotal: number
  paymentMethod: "Card" | "MBWay"
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
  confirmedAt?: string
}

// Helper function to transform MongoDB order to Order interface
function transformOrder(mongoOrder: any): Order {
  return {
    id: mongoOrder._id.toString(),
    orderNumber: mongoOrder.orderNumber,
    billingInfo: mongoOrder.billingInfo,
    cartItems: mongoOrder.cartItems,
    subtotal: mongoOrder.subtotal,
    shipping: mongoOrder.shipping,
    tax: mongoOrder.tax,
    grandTotal: mongoOrder.grandTotal,
    paymentMethod: mongoOrder.paymentMethod,
    status: mongoOrder.status,
    createdAt: mongoOrder.createdAt?.toISOString() || new Date().toISOString(),
    confirmedAt: mongoOrder.confirmedAt?.toISOString(),
  }
}

export async function createOrder(order: Omit<Order, "id" | "orderNumber" | "status" | "createdAt">): Promise<Order> {
  await connectDB()
  
  // Generate unique order number with timestamp and random suffix to avoid collisions
  const orderNumber = `AF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  const status = order.paymentMethod === "MBWay" ? "pending" : "confirmed"
  
  // Ensure all product IDs are strings (MongoDB ObjectIds are strings)
  const cartItemsWithStringIds = order.cartItems.map(item => ({
    ...item,
    product: {
      ...item.product,
      id: String(item.product.id), // Convert to string to match MongoDB schema
    },
  }))
  
  try {
    const newOrder = await Order.create({
      orderNumber,
      billingInfo: order.billingInfo,
      cartItems: cartItemsWithStringIds,
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      grandTotal: order.grandTotal,
      paymentMethod: order.paymentMethod,
      status,
      confirmedAt: status === "confirmed" ? new Date() : undefined,
    })
    
    return transformOrder(newOrder)
  } catch (error: any) {
    console.error("Error creating order in MongoDB:", error)
    // If it's a duplicate key error, try again with a new order number
    if (error.code === 11000) {
      const retryOrderNumber = `AF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      const newOrder = await Order.create({
        orderNumber: retryOrderNumber,
        billingInfo: order.billingInfo,
        cartItems: cartItemsWithStringIds,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        grandTotal: order.grandTotal,
        paymentMethod: order.paymentMethod,
        status,
        confirmedAt: status === "confirmed" ? new Date() : undefined,
      })
      return transformOrder(newOrder)
    }
    throw error
  }
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  await connectDB()
  const order = await Order.findById(id)
  return order ? transformOrder(order) : undefined
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined> {
  await connectDB()
  const order = await Order.findOne({ orderNumber })
  return order ? transformOrder(order) : undefined
}

export async function getPendingMBWayOrders(): Promise<Order[]> {
  await connectDB()
  const orders = await Order.find({
    paymentMethod: "MBWay",
    status: "pending"
  }).sort({ createdAt: -1 })
  return orders.map(transformOrder)
}

export async function getPendingOrders(): Promise<Order[]> {
  await connectDB()
  const orders = await Order.find({
    status: "pending"
  }).sort({ createdAt: -1 })
  return orders.map(transformOrder)
}

export async function confirmOrder(id: string): Promise<Order | null> {
  await connectDB()
  const order = await Order.findByIdAndUpdate(
    id,
    {
      status: "confirmed",
      confirmedAt: new Date(),
    },
    { new: true }
  )
  return order ? transformOrder(order) : null
}

export async function getOrderByEmailAndStatus(email: string, status?: "pending" | "confirmed"): Promise<Order | undefined> {
  await connectDB()
  const query: any = { "billingInfo.email": email }
  if (status) {
    query.status = status
  }
  const order = await Order.findOne(query).sort({ createdAt: -1 })
  return order ? transformOrder(order) : undefined
}

export async function getAllOrders(): Promise<Order[]> {
  await connectDB()
  const orders = await Order.find().sort({ createdAt: -1 })
  return orders.map(transformOrder)
}

