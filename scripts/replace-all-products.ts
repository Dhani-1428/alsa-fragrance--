import 'dotenv/config'
import connectDB from '../lib/mysql'
import Product from '../lib/models-mysql/Product'
import { query } from '../lib/mysql'

// Product data based on the images provided
// Each product uses the same two images (image1 and image2) for all variations
const newProducts = [
  {
    name: 'ALSA FOR MEN',
    category: 'men',
    price: 89.99,
    description: 'A sophisticated and bold fragrance for the modern man. Features deep, masculine notes that create an unforgettable presence.',
    image: '/uploads/1765478040179-Screenshot__1_.png',
    images: [
      '/uploads/1765478040179-Screenshot__1_.png',
      '/uploads/1765477341478-Screenshot__1_.png'
    ],
    notesTop: ['Bergamot', 'Lemon', 'Mint'],
    notesMiddle: ['Lavender', 'Juniper', 'Cedar'],
    notesBase: ['Amber', 'Musk', 'Sandalwood'],
    size: ['30ml', '50ml', '100ml'],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isNew: false,
    isSale: false,
  },
  {
    name: 'ALSA VELMIR',
    category: 'men',
    price: 95.99,
    description: 'A fresh and invigorating fragrance with vibrant green notes. Perfect for those who seek a unique and energetic scent.',
    image: '/uploads/1765477245982-Screenshot__1_.png',
    images: [
      '/uploads/1765477245982-Screenshot__1_.png',
      '/uploads/1765476973040-Screenshot__1_.png'
    ],
    notesTop: ['Lime', 'Grapefruit', 'Green Apple'],
    notesMiddle: ['Jasmine', 'Lily of the Valley', 'Rose'],
    notesBase: ['Moss', 'Vetiver', 'White Musk'],
    size: ['30ml', '50ml', '100ml'],
    rating: 4.7,
    reviews: 98,
    inStock: true,
    isNew: true,
    isSale: false,
  },
  {
    name: 'ALSA MIDNIGHT',
    category: 'men',
    price: 99.99,
    description: 'A mysterious and captivating fragrance that embodies the essence of the night. Deep, rich, and unforgettable.',
    image: '/uploads/1765476639723-Screenshot__1_.png',
    images: [
      '/uploads/1765476639723-Screenshot__1_.png',
      '/uploads/1762984819834-Screenshot_2025-11-08_151020.png'
    ],
    notesTop: ['Black Pepper', 'Cardamom', 'Bergamot'],
    notesMiddle: ['Cedar', 'Patchouli', 'Iris'],
    notesBase: ['Leather', 'Amber', 'Vanilla'],
    size: ['30ml', '50ml', '60ml', '100ml'],
    rating: 4.9,
    reviews: 156,
    inStock: true,
    isNew: false,
    isSale: false,
  },
  {
    name: 'ALSA BOM DIA',
    category: 'women',
    price: 92.99,
    description: 'A warm and welcoming fragrance that greets the day with elegance. Rich, golden notes that radiate positivity and grace.',
    image: '/uploads/1762972821635-Screenshot_2025-11-08_151020.png',
    images: [
      '/uploads/1762972821635-Screenshot_2025-11-08_151020.png',
      '/uploads/1762984819834-Screenshot_2025-11-08_151020.png'
    ],
    notesTop: ['Orange', 'Mandarin', 'Neroli'],
    notesMiddle: ['Jasmine', 'Rose', 'Ylang-Ylang'],
    notesBase: ['Amber', 'Vanilla', 'Tonka Bean'],
    size: ['30ml', '50ml', '100ml'],
    rating: 4.6,
    reviews: 112,
    inStock: true,
    isNew: true,
    isSale: false,
  },
  {
    name: 'ALSA LEÃO',
    category: 'men',
    price: 97.99,
    description: 'A powerful and regal fragrance that commands attention. Bold, confident, and unmistakably masculine.',
    image: '/uploads/1765478040179-Screenshot__1_.png',
    images: [
      '/uploads/1765478040179-Screenshot__1_.png',
      '/uploads/1765477341478-Screenshot__1_.png'
    ],
    notesTop: ['Ginger', 'Saffron', 'Black Currant'],
    notesMiddle: ['Oud', 'Rose', 'Cedar'],
    notesBase: ['Amber', 'Leather', 'Musk'],
    size: ['30ml', '50ml', '100ml'],
    rating: 4.8,
    reviews: 89,
    inStock: true,
    isNew: false,
    isSale: false,
  },
]

async function deleteAllProducts() {
  console.log('🗑️  Deleting all existing products...')
  try {
    const result: any = await query('DELETE FROM products')
    console.log(`✅ Deleted ${result.affectedRows} products\n`)
  } catch (error: any) {
    console.error('❌ Error deleting products:', error.message)
    throw error
  }
}

async function addProducts() {
  console.log('📦 Adding new products...\n')
  
  let created = 0
  let errors = 0

  for (const productData of newProducts) {
    try {
      await Product.create(productData)
      created++
      console.log(`✅ Created: ${productData.name} (${productData.category})`)
    } catch (error: any) {
      errors++
      console.error(`❌ Error creating ${productData.name}:`, error.message)
    }
  }

  console.log(`\n✅ Products creation complete: ${created} created, ${errors} errors\n`)
  return { created, errors }
}

async function main() {
  try {
    console.log('🚀 Starting product replacement...\n')
    
    // Connect to database
    await connectDB()
    console.log('✅ Connected to database\n')

    // Delete all existing products
    await deleteAllProducts()

    // Add new products
    await addProducts()

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Product replacement completed successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  } catch (error: any) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

main()
