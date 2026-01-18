// Script to fetch products from database and generate translation template
import { query } from '../lib/mysql'

async function fetchProductsForTranslations() {
  try {
    await import('../lib/mysql').then(module => module.default())
    
    const results = await query('SELECT id, name, description FROM products ORDER BY id')
    
    if (Array.isArray(results) && results.length > 0) {
      console.log('Found products:')
      console.log('')
      console.log('export const productTranslations: Record<')
      console.log('  string,')
      console.log('  Partial<Record<"en" | "pt" | "hi" | "ar" | "ur", { name?: string; description?: string }>>')
      console.log('> = {')
      
      results.forEach((product: any) => {
        const id = product.id
        const name = product.name || 'Product Name'
        const description = product.description || 'Product description'
        
        console.log(`  "${id}": {`)
        console.log(`    en: { name: "${name}", description: "${description.replace(/"/g, '\\"')}" },`)
        console.log(`    pt: { name: "${name}", description: "${description.replace(/"/g, '\\"')}" }, // TODO: Translate to Portuguese`)
        console.log(`    hi: { name: "${name}", description: "${description.replace(/"/g, '\\"')}" }, // TODO: Translate to Hindi`)
        console.log(`    ar: { name: "${name}", description: "${description.replace(/"/g, '\\"')}" }, // TODO: Translate to Arabic`)
        console.log(`    ur: { name: "${name}", description: "${description.replace(/"/g, '\\"')}" }, // TODO: Translate to Urdu`)
        console.log(`  },`)
        console.log('')
      })
      
      console.log('}')
    } else {
      console.log('No products found in database')
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Error fetching products:', error)
    process.exit(1)
  }
}

fetchProductsForTranslations()
