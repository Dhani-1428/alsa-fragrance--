import connectDB from './mysql'
import Order from './models-mysql/Order'
import { findOrderById, findOrderByOrderNumber, findAllOrders, findOrdersByEmailAndStatus, createOrder as createOrderInDB, updateOrderStatus } from './models-mysql/Order'

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
      id: string | number
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
  paymentMethod: "Card" | "MBWay" | "IBAN"
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
  confirmedAt?: string
}

// Helper function to transform MySQL order to Order interface
function transformOrder(mysqlOrder: any): Order {
  return {
    id: String(mysqlOrder.id),
    orderNumber: mysqlOrder.orderNumber,
    billingInfo: mysqlOrder.billingInfo,
    cartItems: mysqlOrder.cartItems,
    subtotal: mysqlOrder.subtotal,
    shipping: mysqlOrder.shipping,
    tax: mysqlOrder.tax,
    grandTotal: mysqlOrder.grandTotal,
    paymentMethod: mysqlOrder.paymentMethod,
    status: mysqlOrder.status,
    createdAt: mysqlOrder.createdAt ? new Date(mysqlOrder.createdAt).toISOString() : new Date().toISOString(),
    confirmedAt: mysqlOrder.confirmedAt ? new Date(mysqlOrder.confirmedAt).toISOString() : undefined,
  }
}

export async function createOrder(order: Omit<Order, "id" | "orderNumber" | "status" | "createdAt">): Promise<Order> {
  await connectDB()
  
  // Generate unique order number
  const orderNumber = `AF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  const status = order.paymentMethod === "MBWay" ? "pending" : "confirmed"
  
  // Ensure all product IDs are strings
  const cartItemsWithStringIds = order.cartItems.map(item => ({
    ...item,
    product: {
      ...item.product,
      id: String(item.product.id),
    },
  }))
  
  try {
    const newOrder = await createOrderInDB({
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
    console.error("Error creating order in MySQL:", error)
    // If it's a duplicate key error, try again with a new order number
    if (error.code === 'ER_DUP_ENTRY') {
      const retryOrderNumber = `AF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      const newOrder = await createOrderInDB({
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
  const order = await findOrderById(parseInt(id))
  return order ? transformOrder(order) : undefined
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined> {
  await connectDB()
  const order = await findOrderByOrderNumber(orderNumber)
  return order ? transformOrder(order) : undefined
}

export async function getPendingMBWayOrders(): Promise<Order[]> {
  await connectDB()
  const orders = await findAllOrders({
    paymentMethod: "MBWay",
    status: "pending"
  })
  return orders.map(transformOrder)
}

export async function getPendingOrders(): Promise<Order[]> {
  await connectDB()
  const orders = await findAllOrders({
    status: "pending"
  })
  return orders.map(transformOrder)
}

export async function confirmOrder(id: string): Promise<Order | null> {
  await connectDB()
  const order = await updateOrderStatus(parseInt(id), "confirmed", new Date())
  return order ? transformOrder(order) : null
}

export async function getOrderByEmailAndStatus(email: string, status?: "pending" | "confirmed"): Promise<Order | undefined> {
  await connectDB()
  const order = await findOrdersByEmailAndStatus(email, status)
  return order ? transformOrder(order) : undefined
}

export async function getAllOrders(): Promise<Order[]> {
  await connectDB()
  const orders = await findAllOrders()
  return orders.map(transformOrder)
}

