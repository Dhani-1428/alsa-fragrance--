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
  // Validate required fields
  if (!row || !row.id) {
    throw new Error('Invalid product row: missing id')
  }
  if (!row.name) {
    throw new Error(`Invalid product row: missing name for product id ${row.id}`)
  }
  if (!row.category) {
    throw new Error(`Invalid product row: missing category for product id ${row.id}`)
  }
  if (row.price === null || row.price === undefined) {
    throw new Error(`Invalid product row: missing price for product id ${row.id}`)
  }
  
  return {
    id: row.id,
    name: String(row.name || '').trim(),
    category: String(row.category || 'other').trim(),
    price: parseFloat(row.price) || 0,
    originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : undefined,
    salePrice: row.salePrice ? parseFloat(row.salePrice) : undefined,
    salePercent: row.salePercent ? parseFloat(row.salePercent) : undefined,
    rating: parseFloat(row.rating) || 0,
    reviews: parseInt(row.reviews) || 0,
    image: String(row.image || '').trim(),
    images: parseJSONField(row.images),
    description: String(row.description || '').trim(),
    notesTop: parseJSONField(row.notesTop),
    notesMiddle: parseJSONField(row.notesMiddle),
    notesBase: parseJSONField(row.notesBase),
    size: parseJSONField(row.size),
    inStock: Boolean(row.inStock),
    isNew: Boolean(row.isNew),
    isSale: Boolean(row.isSale),
    badge: row.badge ? String(row.badge).trim() : undefined,
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
  try {
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
    
    // Order by id DESC (most recent first) - this is safer than createdAt which might not exist
    sql += ' ORDER BY id DESC'
    
    console.log('📋 Executing SQL:', sql, 'with params:', params)
    const results = await query(sql, params)
    
    if (Array.isArray(results)) {
      console.log(`✅ Found ${results.length} products`)
      return results.map((row: any) => {
        try {
          return transformProduct(row)
        } catch (transformError: any) {
          console.error(`⚠️  Error transforming product row:`, row, 'Error:', transformError)
          // Return a minimal valid product to prevent breaking the API
          return {
            id: row.id,
            name: row.name || 'Unknown Product',
            category: row.category || 'other',
            price: parseFloat(row.price) || 0,
            rating: 0,
            reviews: 0,
            image: row.image || '',
            description: row.description || '',
            inStock: Boolean(row.inStock),
            isNew: Boolean(row.isNew),
            isSale: Boolean(row.isSale),
          } as IProduct
        }
      })
    }
    return []
  } catch (error: any) {
    console.error('❌ Error in findAllProducts:', error)
    console.error('Error message:', error?.message)
    console.error('Error code:', error?.code)
    console.error('Error stack:', error?.stack)
    throw error
  }
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
  try {
    console.log(`🔄 Updating product ID: ${id}`)
    console.log(`📝 Update data:`, JSON.stringify(productData, null, 2))
    
    const updates: string[] = []
    const values: any[] = []
    
    // Validate ID
    if (!id || isNaN(id) || id <= 0) {
      throw new Error(`Invalid product ID: ${id}`)
    }
    
    // Always update name if provided (even if empty string is passed, we should allow it to be cleared)
    if (productData.name !== undefined) {
      updates.push('name = ?')
      values.push(String(productData.name).trim())
    }
    if (productData.category !== undefined) {
      updates.push('category = ?')
      values.push(String(productData.category).trim())
    }
    if (productData.price !== undefined) {
      updates.push('price = ?')
      values.push(parseFloat(String(productData.price)))
    }
    if (productData.originalPrice !== undefined) {
      updates.push('originalPrice = ?')
      values.push(productData.originalPrice ? parseFloat(String(productData.originalPrice)) : null)
    }
    if (productData.salePrice !== undefined) {
      updates.push('salePrice = ?')
      values.push(productData.salePrice ? parseFloat(String(productData.salePrice)) : null)
    }
    if (productData.salePercent !== undefined) {
      updates.push('salePercent = ?')
      values.push(productData.salePercent ? parseFloat(String(productData.salePercent)) : null)
    }
    if (productData.rating !== undefined) {
      updates.push('rating = ?')
      values.push(parseFloat(String(productData.rating)) || 0)
    }
    if (productData.reviews !== undefined) {
      updates.push('reviews = ?')
      values.push(parseInt(String(productData.reviews)) || 0)
    }
    if (productData.image !== undefined) {
      updates.push('image = ?')
      values.push(String(productData.image).trim())
    }
    if (productData.images !== undefined) {
      updates.push('images = ?')
      values.push(JSON.stringify(Array.isArray(productData.images) ? productData.images : []))
    }
    if (productData.description !== undefined) {
      updates.push('description = ?')
      values.push(String(productData.description).trim())
    }
    if (productData.notesTop !== undefined) {
      updates.push('notesTop = ?')
      values.push(JSON.stringify(Array.isArray(productData.notesTop) ? productData.notesTop : []))
    }
    if (productData.notesMiddle !== undefined) {
      updates.push('notesMiddle = ?')
      values.push(JSON.stringify(Array.isArray(productData.notesMiddle) ? productData.notesMiddle : []))
    }
    if (productData.notesBase !== undefined) {
      updates.push('notesBase = ?')
      values.push(JSON.stringify(Array.isArray(productData.notesBase) ? productData.notesBase : []))
    }
    if (productData.size !== undefined) {
      updates.push('size = ?')
      values.push(JSON.stringify(Array.isArray(productData.size) ? productData.size : []))
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
      values.push(productData.badge ? String(productData.badge).trim() : null)
    }
    
    if (updates.length === 0) {
      console.warn('⚠️  No fields to update for product', id)
      return await findProductById(id)
    }
    
    values.push(id)
    const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`
    console.log(`📋 Executing SQL: ${sql}`)
    console.log(`📋 With values:`, values)
    
    const result: any = await query(sql, values)
    console.log(`✅ Update result:`, result)
    
    // Verify the update
    const updatedProduct = await findProductById(id)
    if (!updatedProduct) {
      throw new Error(`Failed to retrieve updated product with ID ${id}`)
    }
    
    console.log(`✅ Product updated successfully:`, updatedProduct.name)
    return updatedProduct
  } catch (error: any) {
    console.error(`❌ Error updating product ${id}:`, error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      errno: error?.errno,
      sqlState: error?.sqlState,
    })
    throw error
  }
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

