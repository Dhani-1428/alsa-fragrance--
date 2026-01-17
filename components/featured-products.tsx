"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-provider"
import Link from "next/link"
import { getProducts } from "@/lib/products-api"
import type { Product } from "@/lib/products-api"

export function FeaturedProducts() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const carouselRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true)
        console.log("FeaturedProducts: Fetching products...")
        const products = await getProducts()
        console.log("FeaturedProducts: Received products:", products.length)
        
        // Filter out products without valid IDs and get first 5
        const validProducts = products.filter(p => {
          const id = typeof p.id === 'string' ? p.id.trim() : String(p.id || '').trim()
          const isValid = id && !isNaN(parseInt(id, 10)) && parseInt(id, 10) > 0
          if (!isValid) {
            console.warn("FeaturedProducts: Invalid product ID:", p.id, "Product:", p.name)
          }
          return isValid
        })
        
        console.log("FeaturedProducts - Total:", products.length, "Valid:", validProducts.length)
        
        // Show up to 5 products, or all valid products if less than 5
        const featured = validProducts.slice(0, 5)
        console.log("FeaturedProducts: Setting featured products:", featured.length, featured.map(p => ({ id: p.id, name: p.name })))
        
        if (featured.length === 0 && products.length > 0) {
          console.warn("FeaturedProducts: No valid products found, but products exist. Showing first product for debugging:", products[0])
        }
        
        setFeaturedProducts(featured)
      } catch (error) {
        console.error("Error fetching featured products:", error)
        setFeaturedProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedProducts()
  }, [])

  const itemsPerView = 4
  const maxIndex = Math.max(0, featuredProducts.length - itemsPerView)

  useEffect(() => {
    if (!isHovered) {
      carouselRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
      }, 3000)
    }

    return () => {
      if (carouselRef.current) {
        clearInterval(carouselRef.current)
      }
    }
  }, [isHovered, maxIndex])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  return (
    <section className="py-16 px-4 bg-card/30">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
            {t.home.featuredProducts}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.pages.featuredProductsDescription}
          </p>
        </motion.div>

        <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4 md:gap-6"
              animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {loading ? (
                <div className="flex items-center justify-center w-full py-12">
                  <p className="text-muted-foreground">Loading featured products...</p>
                </div>
              ) : featuredProducts.length === 0 ? (
                <div className="flex items-center justify-center w-full py-12">
                  <p className="text-muted-foreground">No featured products available.</p>
                </div>
              ) : (
                featuredProducts.map((product, index) => {
                  // Ensure product has valid ID for key
                  const productKey = typeof product.id === 'string' ? product.id : String(product.id || index)
                  return (
                    <motion.div
                      key={productKey}
                      className="flex-shrink-0"
                      style={{ width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * 24) / itemsPerView}px)` }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background/95 hover:bg-background shadow-lg z-10"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background/95 hover:bg-background shadow-lg z-10"
            onClick={handleNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-primary/30"
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" variant="outline" className="px-8 bg-transparent" asChild>
              <Link href="/shop">{t.pages.viewAllProducts}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
