export interface Product {
  id: number | string // Can be number or string (API returns string)
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
    console.log("Fetching products from API...")
    const response = await fetch("/api/products", {
      cache: "no-store",
      next: { revalidate: 0 }, // Disable Next.js caching
    })
    if (!response.ok) {
      console.error("API response not OK:", response.status, response.statusText)
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
    }
    const products = await response.json()
    console.log("Products fetched successfully:", products.length, "products")
    if (products.length > 0) {
      console.log("First product sample:", { id: products[0].id, name: products[0].name })
    }
    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    // Fallback to empty array if API fails
    return []
  }
}

// Get products with caching (disabled - always fresh)
export async function getProducts(): Promise<Product[]> {
  // Always fetch fresh data (no cache)
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
export async function getProductById(id: number | string): Promise<Product | undefined> {
  try {
    // Ensure ID is a number for the API call
    const productId = typeof id === 'string' ? parseInt(id, 10) : id
    if (isNaN(productId) || productId <= 0) {
      console.error("Invalid product ID provided to getProductById:", id)
      return undefined
    }
    
    console.log("Fetching product from API with ID:", productId)
    const response = await fetch(`/api/products/${productId}`, {
      cache: "no-store",
    })
    
    if (!response.ok) {
      console.error("API response not OK:", response.status, response.statusText)
      const errorData = await response.json().catch(() => ({}))
      console.error("Error data:", errorData)
      return undefined
    }
    
    const product = await response.json()
    console.log("Product fetched successfully:", product?.id, product?.name)
    return product
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

