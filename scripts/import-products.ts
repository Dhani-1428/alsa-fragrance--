import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'
import type { Product as ProductType } from '../lib/products-main'
import { products } from '../lib/products-main'

async function main() {
  console.log('Starting product import to MongoDB Atlas...')
  console.log(`Total products to import: ${products.length}`)

  // Connect to MongoDB
  await connectDB()
  console.log('✅ Connected to MongoDB Atlas\n')

  // Clear existing products first
  const deleteResult = await Product.deleteMany({})
  console.log(`Cleared ${deleteResult.deletedCount} existing products\n`)

  let imported = 0
  let failed = 0

  for (const product of products) {
    try {
      await Product.create({
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice || undefined,
        salePrice: product.isSale && product.originalPrice ? product.price : undefined,
        salePercent: product.isSale && product.originalPrice
          ? ((product.originalPrice - product.price) / product.originalPrice) * 100
          : undefined,
        rating: product.rating,
        reviews: product.reviews,
        image: product.image,
        images: product.images || undefined,
        description: product.description,
        notesTop: product.notes.top || undefined,
        notesMiddle: product.notes.middle || undefined,
        notesBase: product.notes.base || undefined,
        size: product.size || undefined,
        inStock: product.inStock,
        isNew: product.isNew || false,
        isSale: product.isSale || false,
        badge: product.badge || undefined,
      })
      imported++
      console.log(`[${imported}/${products.length}] Imported: ${product.name}`)
    } catch (error) {
      failed++
      console.error(`Error importing ${product.name}:`, error)
    }
  }

  const totalInDb = await Product.countDocuments()
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Product import completed!`)
  console.log(`- Successfully imported: ${imported}`)
  console.log(`- Failed: ${failed}`)
  console.log(`- Total products in database: ${totalInDb}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })

