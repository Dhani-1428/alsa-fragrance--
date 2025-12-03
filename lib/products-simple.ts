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

export const products: Product[] = [
  {
    id: 1,
    name: "Alsa Fragrance - Midnight Elegance",
    category: "women",
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.8,
    reviews: 124,
    image: "/alsa-midnight-elegance-perfume-bottle.jpg",
    description: "A sophisticated evening fragrance that captures the essence of mystery and allure.",
    notes: {
      top: ["Bergamot", "Black Currant", "Pink Pepper"],
      middle: ["Rose", "Jasmine", "Violet"],
      base: ["Vanilla", "Musk", "Sandalwood"],
    },
    size: ["30ml", "50ml", "100ml"],
    inStock: true,
    isSale: true,
    badge: "Sale",
  },
  {
    id: 2,
    name: "Alsa Fragrance - Royal Oud",
    category: "attars",
    price: 149.99,
    rating: 4.9,
    reviews: 89,
    image: "/alsa-royal-oud-attar-bottle.jpg",
    description: "Premium oud attar crafted from the finest agarwood, embodying luxury and tradition.",
    notes: {
      top: ["Saffron", "Rose"],
      middle: ["Oud", "Amber"],
      base: ["Musk", "Sandalwood", "Patchouli"],
    },
    size: ["6ml", "12ml"],
    inStock: true,
    isNew: true,
    badge: "Premium",
  },
  {
    id: 3,
    name: "Alsa Fragrance - Urban Legend",
    category: "men",
    price: 79.99,
    rating: 4.7,
    reviews: 156,
    image: "/alsa-urban-legend-cologne-bottle.jpg",
    description: "A modern masculine fragrance for the contemporary urban gentleman.",
    notes: {
      top: ["Lemon", "Grapefruit", "Mint"],
      middle: ["Lavender", "Geranium", "Cardamom"],
      base: ["Cedarwood", "Vetiver", "Ambergris"],
    },
    size: ["50ml", "100ml"],
    inStock: true,
  },
]

export function getProductsByCategory(category: string) {
  return products.filter((product) => product.category === category)
}

export function getProductById(id: number) {
  return products.find((product) => product.id === id)
}

export function getFeaturedProducts() {
  return products.slice(0, 3)
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
  return products.filter((product) => product.isNew === true).slice(0, 3)
}

export function getLimitedEditionProducts() {
  return products.filter((product) => product.badge === "Limited Edition")
}

export default products
