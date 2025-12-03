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
      id: number
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

// Simple in-memory storage (in production, use a database)
const orders: Map<string, Order> = new Map()

export function createOrder(order: Omit<Order, "id" | "orderNumber" | "status" | "createdAt">): Order {
  const id = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const orderNumber = `AF-${Date.now()}`
  
  const newOrder: Order = {
    ...order,
    id,
    orderNumber,
    status: order.paymentMethod === "MBWay" ? "pending" : "confirmed",
    createdAt: new Date().toISOString(),
  }
  
  orders.set(id, newOrder)
  return newOrder
}

export function getOrderById(id: string): Order | undefined {
  return orders.get(id)
}

export function getOrderByOrderNumber(orderNumber: string): Order | undefined {
  for (const order of orders.values()) {
    if (order.orderNumber === orderNumber) {
      return order
    }
  }
  return undefined
}

export function getPendingMBWayOrders(): Order[] {
  return Array.from(orders.values()).filter(
    (order) => order.paymentMethod === "MBWay" && order.status === "pending"
  )
}

export function confirmOrder(id: string): Order | null {
  const order = orders.get(id)
  if (!order) {
    return null
  }
  
  order.status = "confirmed"
  order.confirmedAt = new Date().toISOString()
  orders.set(id, order)
  
  return order
}

export function getOrderByEmailAndStatus(email: string, status?: "pending" | "confirmed"): Order | undefined {
  for (const order of orders.values()) {
    if (order.billingInfo.email === email) {
      if (!status || order.status === status) {
        return order
      }
    }
  }
  return undefined
}

