export interface Product {
  id: number
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

let productsCache: Product[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 0 // No cache - always fetch fresh data

// Fetch all products from API
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch("/api/products", {
      cache: "no-store",
    })
    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    // Fallback to empty array if API fails
    return []
  }
}

// Get products with caching
export async function getProducts(): Promise<Product[]> {
  // Always fetch fresh data from API (no cache)
  productsCache = await fetchProducts()
  cacheTimestamp = Date.now()
  return productsCache
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((product) => product.category === category)
}

// Get product by ID
export async function getProductById(id: number): Promise<Product | undefined> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      cache: "no-store",
    })
    if (!response.ok) {
      return undefined
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching product:", error)
    return undefined
  }
}

// Get products on sale
export async function getProductsOnSale(): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((product) => product.isSale)
}

// Get new arrivals
export async function getNewArrivals(): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((product) => product.isNew)
}

// Get limited edition products
export async function getLimitedEditionProducts(): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((product) => product.badge === "Limited Edition")
}

