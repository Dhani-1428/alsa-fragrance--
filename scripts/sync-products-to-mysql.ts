import { connectDB, query } from '../lib/mysql'
import { createProduct, updateProduct } from '../lib/models-mysql/Product'
import { products } from '../lib/products'

async function main() {
  console.log('🔄 Starting product sync to MySQL database...')
  console.log(`📦 Total products to sync: ${products.length}\n`)

  // Connect to MySQL
  await connectDB()
  console.log('✅ Connected to MySQL database\n')

  let synced = 0
  let updated = 0
  let skipped = 0
  let failed = 0

  for (const product of products) {
    try {
      // Check if product already exists (by name and category)
      const existingResults: any = await query(
        'SELECT id FROM products WHERE name = ? AND category = ?',
        [product.name, product.category]
      )

      const existing = Array.isArray(existingResults) && existingResults.length > 0 
        ? existingResults[0] 
        : null

      if (existing) {
        // Product exists, update it
        await updateProduct(existing.id, {
          name: product.name,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice || undefined,
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
        updated++
        console.log(`🔄 Updated: ${product.name}`)
      } else {
        // Product doesn't exist, create it
        await createProduct({
          name: product.name,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice || undefined,
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
        synced++
        console.log(`✅ Created: ${product.name}`)
      }
    } catch (error: any) {
      failed++
      console.error(`❌ Error syncing ${product.name}:`, error.message)
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Product sync completed!`)
  console.log(`- ✅ Created: ${synced}`)
  console.log(`- 🔄 Updated: ${updated}`)
  console.log(`- ⏭️  Skipped: ${skipped}`)
  console.log(`- ❌ Failed: ${failed}`)
  console.log(`- 📊 Total processed: ${synced + updated + skipped + failed}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
}

main()
  .catch((e) => {
    console.error('Fatal error:', e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
