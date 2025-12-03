import { PrismaClient } from '../lib/prisma-client/client'
import type { Product as ProductType } from '../lib/products-main'
import { products } from '../lib/products-main'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting product import...')
  console.log(`Total products to import: ${products.length}`)

  // Clear existing products first
  const deleteCount = await prisma.product.deleteMany({})
  console.log(`Cleared ${deleteCount.count} existing products`)

  let imported = 0
  let failed = 0

  for (const product of products) {
    try {
      await prisma.product.create({
        data: {
          name: product.name,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice || null,
          salePrice: product.isSale && product.originalPrice ? product.price : null,
          salePercent: product.isSale && product.originalPrice
            ? ((product.originalPrice - product.price) / product.originalPrice) * 100
            : null,
          rating: product.rating,
          reviews: product.reviews,
          image: product.image,
          images: product.images ? JSON.stringify(product.images) : null,
          description: product.description,
          notesTop: JSON.stringify(product.notes.top),
          notesMiddle: JSON.stringify(product.notes.middle),
          notesBase: JSON.stringify(product.notes.base),
          size: JSON.stringify(product.size),
          inStock: product.inStock,
          isNew: product.isNew || false,
          isSale: product.isSale || false,
          badge: product.badge || null,
        },
      })
      imported++
      console.log(`[${imported}/${products.length}] Imported: ${product.name}`)
    } catch (error) {
      failed++
      console.error(`Error importing ${product.name}:`, error)
    }
  }

  const totalInDb = await prisma.product.count()
  console.log(`\nProduct import completed!`)
  console.log(`- Successfully imported: ${imported}`)
  console.log(`- Failed: ${failed}`)
  console.log(`- Total products in database: ${totalInDb}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

