/**
 * Server-side product fetching functions
 * These can be used in server components and API routes
 */

import connectDB from '@/lib/mysql'
import { getTranslatedProduct } from '@/lib/i18n/product-translations'

export interface Product {
  id: number | string
  name: string
  category: "women" | "men" | "attars" | "testers" | "accessories"
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  images?: string[]
  description: string
  notes: {
    top: string[]
    middle: string[]
    base: string[]
  }
  size: string[]
  inStock: boolean
  isNew?: boolean
  isSale?: boolean
  badge?: string
}

/**
 * Fetch products from database (server-side)
 */
export async function getProductsServer(category?: string, language: string = "en"): Promise<Product[]> {
  try {
    await connectDB()
    const { findAllProducts } = await import('@/lib/models-mysql/Product')
    let products = await findAllProducts({ category: category || undefined })
    
    // Apply translations
    products = products.map(product => {
      try {
        return getTranslatedProduct(product, language as any)
      } catch (error) {
        console.error('Error translating product:', error)
        return product
      }
    })
    
    return products
  } catch (error) {
    console.error('Error fetching products server-side:', error)
    return []
  }
}

/**
 * Get products by category (server-side)
 */
export async function getProductsByCategoryServer(category: string, language: string = "en"): Promise<Product[]> {
  const products = await getProductsServer(category, language)
  return products.filter((product) => product.category === category)
}
