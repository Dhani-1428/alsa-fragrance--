"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
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
import { Search, Grid, List, Filter } from "lucide-react"
import { getProducts, type Product } from "@/lib/products-api"
import { useLanguage } from "@/contexts/language-provider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"

interface FilterState {
  categories: string[]
  priceRange: [number, number]
  inStock: boolean
  onSale: boolean
  isNew: boolean
}

export default function ShopPage() {
  const { t, language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 200],
    inStock: false,
    onSale: false,
    isNew: false,
  })

  const searchParams = useSearchParams()

  useEffect(() => {
    async function loadProducts() {
      try {
        const allProducts = await getProducts(language)
        setProducts(allProducts)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [language])

  useEffect(() => {
    const urlSearch = searchParams.get("search")
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
  }, [searchParams])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Search filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      // Stock filter
      if (filters.inStock && !product.inStock) {
        return false
      }

      // Sale filter
      if (filters.onSale && !product.isSale) {
        return false
      }

      // New filter
      if (filters.isNew && !product.isNew) {
        return false
      }

      return true
    })

    // Sort products
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
  }, [searchQuery, sortBy, filters, products])

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 200],
      inStock: false,
      onSale: false,
      isNew: false,
    })
    setSearchQuery("")
  }

  return (
    <PageAnimations>
      <main className="min-h-screen">
        <Navigation />

        <motion.section
          className="relative h-[400px] bg-gradient-to-r from-black/60 to-black/40 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/shop hero img.png')",
            }}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center text-white px-4">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4 font-[family-name:var(--font-playfair)]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {t.shop.title}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {t.home.discoverCollection}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                {t.common.buyNow}
              </Button>
            </motion.div>
          </div>
        </motion.section>

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <SlideInLeft className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
              {t.shop.allProducts}
            </h2>
            <p className="text-muted-foreground text-lg">{t.home.discoverCollection}</p>
          </SlideInLeft>

          {/* Search and Controls */}
          <SlideInRight delay={0.2} className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.shop.title + "..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t.shop.sortBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">{t.shop.sortBy}: A-Z</SelectItem>
                  <SelectItem value="price-low">{t.product.price}: Low to High</SelectItem>
                  <SelectItem value="price-high">{t.product.price}: High to Low</SelectItem>
                  <SelectItem value="rating">{t.product.reviews}</SelectItem>
                  <SelectItem value="newest">{t.home.newArrivals}</SelectItem>
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

              {/* Mobile Filter Toggle */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <ProductFilters filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />
                </SheetContent>
              </Sheet>
            </div>
          </SlideInRight>

          <div className="flex gap-8">
            {/* Desktop Filters */}
            <SlideInLeft delay={0.4} className="hidden lg:block w-64 flex-shrink-0">
              <ProductFilters filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />
            </SlideInLeft>

            {/* Products Grid */}
            <div className="flex-1">
              <FadeInUp delay={0.3} className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  {t.shop.showingResults}: {filteredAndSortedProducts.length} {t.cart.items} of {products.length}
                </p>
              </FadeInUp>

              {filteredAndSortedProducts.length === 0 ? (
                <FadeInUp delay={0.5} className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">{t.shop.noProducts}</p>
                  <Button onClick={clearFilters} variant="outline">
                    {t.shop.filters}
                  </Button>
                </FadeInUp>
              ) : (
                <StaggerContainer
                  className={`grid gap-6 ${
                    viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
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
          </div>
        </div>
      </main>

      <Footer />
    </PageAnimations>
  )
}
