import { query } from '../mysql'

export interface IProduct {
  id?: number
  name: string
  category: string
  price: number
  originalPrice?: number
  salePrice?: number
  salePercent?: number
  rating: number
  reviews: number
  image: string
  images?: string[]
  description: string
  notesTop?: string[]
  notesMiddle?: string[]
  notesBase?: string[]
  size?: string[]
  inStock: boolean
  isNew: boolean
  isSale: boolean
  badge?: string
  createdAt?: Date
  updatedAt?: Date
}

function parseJSONField(field: any): string[] {
  if (!field) return []
  if (Array.isArray(field)) return field
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function transformProduct(row: any): IProduct {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: parseFloat(row.price),
    originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : undefined,
    salePrice: row.salePrice ? parseFloat(row.salePrice) : undefined,
    salePercent: row.salePercent ? parseFloat(row.salePercent) : undefined,
    rating: parseFloat(row.rating) || 0,
    reviews: parseInt(row.reviews) || 0,
    image: row.image,
    images: parseJSONField(row.images),
    description: row.description,
    notesTop: parseJSONField(row.notesTop),
    notesMiddle: parseJSONField(row.notesMiddle),
    notesBase: parseJSONField(row.notesBase),
    size: parseJSONField(row.size),
    inStock: Boolean(row.inStock),
    isNew: Boolean(row.isNew),
    isSale: Boolean(row.isSale),
    badge: row.badge || undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export async function findProductById(id: number): Promise<IProduct | null> {
  const results = await query('SELECT * FROM products WHERE id = ?', [id])
  if (Array.isArray(results) && results.length > 0) {
    return transformProduct(results[0])
  }
  return null
}

export async function findAllProducts(filter?: {
  category?: string
  inStock?: boolean
}): Promise<IProduct[]> {
  let sql = 'SELECT * FROM products WHERE 1=1'
  const params: any[] = []
  
  if (filter?.category) {
    sql += ' AND category = ?'
    params.push(filter.category)
  }
  
  if (filter?.inStock !== undefined) {
    sql += ' AND inStock = ?'
    params.push(filter.inStock ? 1 : 0)
  }
  
  sql += ' ORDER BY createdAt DESC'
  
  const results = await query(sql, params)
  if (Array.isArray(results)) {
    return results.map(transformProduct)
  }
  return []
}

export async function createProduct(productData: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
  const result: any = await query(
    `INSERT INTO products (
      name, category, price, originalPrice, salePrice, salePercent,
      rating, reviews, image, images, description,
      notesTop, notesMiddle, notesBase, size,
      inStock, isNew, isSale, badge
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      productData.name,
      productData.category,
      productData.price,
      productData.originalPrice || null,
      productData.salePrice || null,
      productData.salePercent || null,
      productData.rating || 0,
      productData.reviews || 0,
      productData.image,
      JSON.stringify(productData.images || []),
      productData.description,
      JSON.stringify(productData.notesTop || []),
      JSON.stringify(productData.notesMiddle || []),
      JSON.stringify(productData.notesBase || []),
      JSON.stringify(productData.size || []),
      productData.inStock !== false ? 1 : 0,
      productData.isNew ? 1 : 0,
      productData.isSale ? 1 : 0,
      productData.badge || null,
    ]
  )
  
  const newProduct = await findProductById(result.insertId)
  if (!newProduct) {
    throw new Error('Failed to create product')
  }
  return newProduct
}

export async function updateProduct(id: number, productData: Partial<IProduct>): Promise<IProduct | null> {
  const updates: string[] = []
  const values: any[] = []
  
  if (productData.name) {
    updates.push('name = ?')
    values.push(productData.name)
  }
  if (productData.category) {
    updates.push('category = ?')
    values.push(productData.category)
  }
  if (productData.price !== undefined) {
    updates.push('price = ?')
    values.push(productData.price)
  }
  if (productData.originalPrice !== undefined) {
    updates.push('originalPrice = ?')
    values.push(productData.originalPrice || null)
  }
  if (productData.salePrice !== undefined) {
    updates.push('salePrice = ?')
    values.push(productData.salePrice || null)
  }
  if (productData.salePercent !== undefined) {
    updates.push('salePercent = ?')
    values.push(productData.salePercent || null)
  }
  if (productData.rating !== undefined) {
    updates.push('rating = ?')
    values.push(productData.rating)
  }
  if (productData.reviews !== undefined) {
    updates.push('reviews = ?')
    values.push(productData.reviews)
  }
  if (productData.image) {
    updates.push('image = ?')
    values.push(productData.image)
  }
  if (productData.images !== undefined) {
    updates.push('images = ?')
    values.push(JSON.stringify(productData.images))
  }
  if (productData.description) {
    updates.push('description = ?')
    values.push(productData.description)
  }
  if (productData.notesTop !== undefined) {
    updates.push('notesTop = ?')
    values.push(JSON.stringify(productData.notesTop))
  }
  if (productData.notesMiddle !== undefined) {
    updates.push('notesMiddle = ?')
    values.push(JSON.stringify(productData.notesMiddle))
  }
  if (productData.notesBase !== undefined) {
    updates.push('notesBase = ?')
    values.push(JSON.stringify(productData.notesBase))
  }
  if (productData.size !== undefined) {
    updates.push('size = ?')
    values.push(JSON.stringify(productData.size))
  }
  if (productData.inStock !== undefined) {
    updates.push('inStock = ?')
    values.push(productData.inStock ? 1 : 0)
  }
  if (productData.isNew !== undefined) {
    updates.push('isNew = ?')
    values.push(productData.isNew ? 1 : 0)
  }
  if (productData.isSale !== undefined) {
    updates.push('isSale = ?')
    values.push(productData.isSale ? 1 : 0)
  }
  if (productData.badge !== undefined) {
    updates.push('badge = ?')
    values.push(productData.badge || null)
  }
  
  if (updates.length === 0) {
    return await findProductById(id)
  }
  
  values.push(id)
  await query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values)
  return await findProductById(id)
}

export async function deleteProduct(id: number): Promise<boolean> {
  const result: any = await query('DELETE FROM products WHERE id = ?', [id])
  return result.affectedRows > 0
}

export default {
  findById: findProductById,
  find: async (filter?: any) => {
    return await findAllProducts(filter)
  },
  findOne: async (filter: { _id?: string | number; id?: number }) => {
    if (filter._id) {
      const id = typeof filter._id === 'string' ? parseInt(filter._id) : filter._id
      return await findProductById(id)
    }
    if (filter.id) {
      return await findProductById(filter.id)
    }
    return null
  },
  create: createProduct,
  findByIdAndUpdate: async (id: number, update: Partial<IProduct>) => {
    return await updateProduct(id, update)
  },
  findByIdAndDelete: async (id: number) => {
    await deleteProduct(id)
    return null
  },
}

