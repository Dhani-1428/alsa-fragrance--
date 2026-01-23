"use client"

import { useState, useMemo, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import {
  PageAnimations,
  SlideInLeft,
  SlideInRight,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/page-animations"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Grid, List } from "lucide-react"
import { getProductsByCategory, type Product } from "@/lib/products-api"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-provider"

export default function AttarsPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [attarProducts, setAttarProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await getProductsByCategory("attars")
        setAttarProducts(products)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = attarProducts.filter((product) => {
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }
      return true
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [searchQuery, sortBy, attarProducts])

  return (
    <PageAnimations>
      <main className="min-h-screen">
        <Navigation />

        <motion.section
          className="relative h-[40vh] md:h-[50vh] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/alsa-fragrance-traditional-attar-bottles-ornate-go.jpg')" }}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>

          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-[family-name:var(--font-playfair)] text-balance"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {t.categoryPages.attars.title}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl mb-4 text-gray-200 max-w-2xl mx-auto text-balance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {t.categoryPages.attars.description}
              </motion.p>
              <motion.p
                className="text-sm text-primary font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                {attarProducts.length} {t.components.categoryHero.productsAvailable}
              </motion.p>
            </div>
          </div>
        </motion.section>

        <div className="container mx-auto px-4 py-12">
          {/* Info Section */}
          <SlideInLeft className="bg-card/50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3 font-[family-name:var(--font-playfair)]">{t.categoryPages.attars.aboutTitle}</h2>
            <p className="text-muted-foreground">
              {t.categoryPages.attars.aboutDescription}
            </p>
          </SlideInLeft>

          {/* Search and Controls */}
          <SlideInRight delay={0.2} className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.categoryPages.attars.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t.categoryPages.common.sortBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">{t.categoryPages.common.nameAZ}</SelectItem>
                  <SelectItem value="price-low">{t.categoryPages.common.priceLowHigh}</SelectItem>
                  <SelectItem value="price-high">{t.categoryPages.common.priceHighLow}</SelectItem>
                  <SelectItem value="rating">{t.categoryPages.common.highestRated}</SelectItem>
                  <SelectItem value="newest">{t.categoryPages.common.newestFirst}</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SlideInRight>

          {/* Always visible content section for SEO - prevents Soft 404 */}
          <div className="mb-8 prose prose-sm max-w-none">
            <h2 className="text-2xl font-bold mb-4">Attars & Traditional Fragrances Collection</h2>
            <p className="text-muted-foreground mb-4">
              Explore our authentic attars and traditional fragrances at Alsa Fragrance. Attars are concentrated perfume oils made from natural ingredients, offering long-lasting and rich scents. Our collection features traditional Middle Eastern and South Asian attars, perfect for those who appreciate classic, luxurious fragrances.
            </p>
            <p className="text-muted-foreground mb-4">
              Shop attars online at www.alsafragrance.com. Located in Queluz, Portugal. We offer free shipping on all orders. Browse our collection of traditional fragrances, attar oils, and concentrated perfumes.
            </p>
          </div>

          {/* Products Grid */}
          <FadeInUp delay={0.3} className="mb-6">
            <p className="text-muted-foreground">
              {t.categoryPages.common.showing} {filteredAndSortedProducts.length} {t.categoryPages.common.of} {attarProducts.length} {t.categoryPages.common.products}
            </p>
          </FadeInUp>

          {filteredAndSortedProducts.length === 0 ? (
            <FadeInUp delay={0.5} className="text-center py-12">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-4">Attars Available</h3>
                <p className="text-muted-foreground mb-4">
                  We're currently updating our attars collection. Check back soon for traditional attars and fragrances. In the meantime, explore our full collection of men's and women's perfumes, testers, and limited edition fragrances.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setSearchQuery("")} variant="outline">
                    {t.categoryPages.common.clearSearch}
                  </Button>
                  <Button asChild variant="default">
                    <a href="/shop">Browse All Products</a>
                  </Button>
                </div>
              </div>
            </FadeInUp>
          ) : (
            <StaggerContainer
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {filteredAndSortedProducts.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </main>

      <Footer />
    </PageAnimations>
  )
}
