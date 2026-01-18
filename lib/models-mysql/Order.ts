import { query } from '../mysql'

export interface IOrder {
  id?: number
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
  createdAt?: Date
  confirmedAt?: Date
  updatedAt?: Date
}

function transformOrder(row: any): IOrder {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    billingInfo: typeof row.billingInfo === 'string' ? JSON.parse(row.billingInfo) : row.billingInfo,
    cartItems: typeof row.cartItems === 'string' ? JSON.parse(row.cartItems) : row.cartItems,
    subtotal: parseFloat(row.subtotal),
    shipping: parseFloat(row.shipping) || 0,
    tax: parseFloat(row.tax) || 0,
    grandTotal: parseFloat(row.grandTotal),
    paymentMethod: row.paymentMethod,
    status: row.status,
    createdAt: row.createdAt,
    confirmedAt: row.confirmedAt,
    updatedAt: row.updatedAt,
  }
}

export async function findOrderById(id: number): Promise<IOrder | null> {
  const results = await query('SELECT * FROM orders WHERE id = ?', [id])
  if (Array.isArray(results) && results.length > 0) {
    return transformOrder(results[0])
  }
  return null
}

export async function findOrderByOrderNumber(orderNumber: string): Promise<IOrder | null> {
  const results = await query('SELECT * FROM orders WHERE orderNumber = ?', [orderNumber])
  if (Array.isArray(results) && results.length > 0) {
    return transformOrder(results[0])
  }
  return null
}

export async function findAllOrders(filter?: {
  status?: string
  paymentMethod?: string
}): Promise<IOrder[]> {
  let sql = 'SELECT * FROM orders WHERE 1=1'
  const params: any[] = []
  
  if (filter?.status) {
    sql += ' AND status = ?'
    params.push(filter.status)
  }
  
  if (filter?.paymentMethod) {
    sql += ' AND paymentMethod = ?'
    params.push(filter.paymentMethod)
  }
  
  sql += ' ORDER BY createdAt DESC'
  
  const results = await query(sql, params)
  if (Array.isArray(results)) {
    return results.map(transformOrder)
  }
  return []
}

export async function findOrdersByEmailAndStatus(
  email: string,
  status?: "pending" | "confirmed"
): Promise<IOrder | null> {
  let sql = `SELECT * FROM orders 
             WHERE JSON_EXTRACT(billingInfo, '$.email') = ?`
  const params: any[] = [email]
  
  if (status) {
    sql += ' AND status = ?'
    params.push(status)
  }
  
  sql += ' ORDER BY createdAt DESC LIMIT 1'
  
  const results = await query(sql, params)
  if (Array.isArray(results) && results.length > 0) {
    return transformOrder(results[0])
  }
  return null
}

export async function createOrder(orderData: Omit<IOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<IOrder> {
  const result: any = await query(
    `INSERT INTO orders (
      orderNumber, billingInfo, cartItems, subtotal, shipping, tax,
      grandTotal, paymentMethod, status, confirmedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      orderData.orderNumber,
      JSON.stringify(orderData.billingInfo),
      JSON.stringify(orderData.cartItems),
      orderData.subtotal,
      orderData.shipping || 0,
      orderData.tax || 0,
      orderData.grandTotal,
      orderData.paymentMethod,
      orderData.status || 'pending',
      orderData.confirmedAt || null,
    ]
  )
  
  const newOrder = await findOrderById(result.insertId)
  if (!newOrder) {
    throw new Error('Failed to create order')
  }
  return newOrder
}

export async function updateOrderStatus(
  id: number,
  status: "pending" | "confirmed" | "cancelled",
  confirmedAt?: Date
): Promise<IOrder | null> {
  const updates: string[] = ['status = ?']
  const values: any[] = [status]
  
  if (status === 'confirmed' && confirmedAt) {
    updates.push('confirmedAt = ?')
    values.push(confirmedAt)
  } else if (status === 'confirmed') {
    updates.push('confirmedAt = NOW()')
  }
  
  values.push(id)
  await query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, values)
  return await findOrderById(id)
}

export default {
  findById: findOrderById,
  findOne: async (filter: { orderNumber?: string; _id?: string | number }) => {
    if (filter.orderNumber) {
      return await findOrderByOrderNumber(filter.orderNumber)
    }
    if (filter._id) {
      const id = typeof filter._id === 'string' ? parseInt(filter._id) : filter._id
      return await findOrderById(id)
    }
    return null
  },
  find: async (filter?: any) => {
    return await findAllOrders(filter)
  },
  create: createOrder,
  findByIdAndUpdate: async (id: number, update: { status?: string; confirmedAt?: Date }) => {
    if (update.status) {
      return await updateOrderStatus(id, update.status as any, update.confirmedAt)
    }
    return await findOrderById(id)
  },
}

