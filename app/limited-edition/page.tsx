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
import { getLimitedEditionProducts, type Product } from "@/lib/products-api"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-provider"

export default function LimitedEditionPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [limitedEditionProducts, setLimitedEditionProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await getLimitedEditionProducts()
        setLimitedEditionProducts(products)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = limitedEditionProducts.filter((product) => {
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
  }, [searchQuery, sortBy, limitedEditionProducts])

  return (
    <PageAnimations>
      <main className="min-h-screen">
        {/* Static SEO content for Google crawlers - visible to crawlers */}
        <div className="sr-only" aria-hidden="true">
          <h1>Limited Edition Fragrances | Alsa Fragrance - Exclusive Perfumes</h1>
          <p>Explore exclusive limited edition fragrances at Alsa Fragrance. Rare scents and premium bottles with elegant gifting presentation. Limited availability - shop exclusive perfumes now.</p>
          <p>Alsa Fragrance offers limited edition perfumes, exclusive fragrances, and rare scents. Shop limited edition perfumes online at www.alsafragrance.com. Located in Queluz, Portugal. Free shipping available.</p>
        </div>
        <Navigation />

        <motion.section
          className="relative h-[40vh] md:h-[50vh] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/alsa-fragrance-limited-edition-exclusive-perfume-b.jpg')" }}
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
                {t.categoryPages.limitedEdition.title}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl mb-4 text-gray-200 max-w-2xl mx-auto text-balance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {t.categoryPages.limitedEdition.description}
              </motion.p>
              <motion.p
                className="text-sm text-primary font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                {limitedEditionProducts.length} {t.categoryPages.limitedEdition.productsAvailable}
              </motion.p>
            </div>
          </div>
        </motion.section>

        <div className="container mx-auto px-4 py-12">
          {/* Search and Controls */}
          <SlideInRight delay={0.2} className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.categoryPages.limitedEdition.searchPlaceholder}
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

          {/* Products Grid */}
          <FadeInUp delay={0.3} className="mb-6">
            <p className="text-muted-foreground">
              {loading ? t.common.loading : `${t.categoryPages.common.showing} ${filteredAndSortedProducts.length} ${t.categoryPages.common.of} ${limitedEditionProducts.length} ${t.categoryPages.limitedEdition.showingProducts}`}
            </p>
          </FadeInUp>

          {/* Always visible content section for SEO - prevents Soft 404 */}
          <div className="mb-8 prose prose-sm max-w-none">
            <h2 className="text-2xl font-bold mb-4">Limited Edition Fragrances Collection</h2>
            <p className="text-muted-foreground mb-4">
              Discover our exclusive limited edition fragrances at Alsa Fragrance. Each perfume in this collection features rare scents, premium bottles, and elegant presentation perfect for gifting. These exclusive fragrances are available in limited quantities, making them perfect for those seeking unique and sophisticated scents.
            </p>
            <p className="text-muted-foreground mb-4">
              Shop limited edition perfumes online at www.alsafragrance.com. Located in Queluz, Portugal. We offer free shipping on all orders. Browse our collection of exclusive fragrances, rare scents, and premium perfume bottles.
            </p>
          </div>

          {loading ? (
            <FadeInUp delay={0.4} className="text-center py-12">
              <p className="text-muted-foreground text-lg">{t.categoryPages.common.loadingProducts}</p>
            </FadeInUp>
          ) : filteredAndSortedProducts.length === 0 ? (
            <FadeInUp delay={0.5} className="text-center py-12">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-4">Limited Edition Fragrances Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  We're currently updating our limited edition collection. Check back soon for exclusive fragrances, rare scents, and premium perfume bottles. In the meantime, explore our full collection of men's and women's perfumes, attars, and testers.
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

          {/* Features Section */}
          <StaggerContainer className="mt-16 grid md:grid-cols-3 gap-6">
            <StaggerItem className="text-center p-6 bg-card/30 rounded-lg">
              <h3 className="font-semibold mb-2">{t.categoryPages.limitedEdition.exclusiveBottlesTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {t.categoryPages.limitedEdition.exclusiveBottlesDesc}
              </p>
            </StaggerItem>
            <StaggerItem className="text-center p-6 bg-card/30 rounded-lg">
              <h3 className="font-semibold mb-2">{t.categoryPages.limitedEdition.premiumGiftingTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {t.categoryPages.limitedEdition.premiumGiftingDesc}
              </p>
            </StaggerItem>
            <StaggerItem className="text-center p-6 bg-card/30 rounded-lg">
              <h3 className="font-semibold mb-2">{t.categoryPages.limitedEdition.rareScentsTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {t.categoryPages.limitedEdition.rareScentsDesc}
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </main>

      <Footer />
    </PageAnimations>
  )
}

