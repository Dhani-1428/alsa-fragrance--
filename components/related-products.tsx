"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { getProducts, type Product } from "@/lib/products-api"
import { useLanguage } from "@/contexts/language-provider"

interface RelatedProductsProps {
  currentProduct: Product
}

export function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const { t } = useLanguage()
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        setLoading(true)
        // Fetch all products from database
        const allProducts = await getProducts()
        
        // Get current product ID for comparison
        const currentId = typeof currentProduct.id === 'string' 
          ? parseInt(currentProduct.id, 10) 
          : currentProduct.id
        
        // Filter products from database: same category, exclude current product
        const related = allProducts
          .filter((product) => {
            const productId = typeof product.id === 'string' 
              ? parseInt(product.id, 10) 
              : product.id
            return product.category === currentProduct.category && productId !== currentId
          })
          .slice(0, 4) // Show up to 4 related products
        
        setRelatedProducts(related)
      } catch (error) {
        console.error("Error fetching related products:", error)
        setRelatedProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchRelatedProducts()
  }, [currentProduct.id, currentProduct.category])

  if (loading || relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="py-12 px-4 bg-background/50">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 font-[family-name:var(--font-playfair)] text-center">
          {t.pages.youMightAlsoLike}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => {
            const productKey = typeof product.id === 'string' ? product.id : String(product.id || '')
            return <ProductCard key={productKey} product={product} />
          })}
        </div>
      </div>
    </section>
  )
}
