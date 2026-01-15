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

// Empty products array - all products are now fetched from the database via API
export const products: Product[] = []

export function getProductsByCategory(category: string) {
  return products.filter((product) => product.category === category)
}

export function getProductById(id: number) {
  return products.find((product) => product.id === id)
}

export function getFeaturedProducts() {
  return []
}

export function searchProducts(query: string) {
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()),
  )
}

export function getNewArrivals() {
  return products.filter((product) => product.isNew === true && product.category !== "accessories").slice(0, 12)
}

export function getLimitedEditionProducts() {
  return products.filter((product) => product.badge === "Limited Edition")
}

export default products
