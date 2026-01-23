"use client"

import { useState, useMemo, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import {
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
import { useLanguage } from "@/contexts/language-provider"

interface MenPageClientProps {
  initialProducts: Product[]
}

export function MenPageClient({ initialProducts }: MenPageClientProps) {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [menProducts, setMenProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)

  // Update products when language changes
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const products = await getProductsByCategory("men")
        setMenProducts(products)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }
    // Only reload if we have no initial products or if language changes
    if (initialProducts.length === 0) {
      loadProducts()
    }
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = menProducts.filter((product) => {
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
  }, [searchQuery, sortBy, menProducts])

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search and Controls */}
      <SlideInLeft className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.categoryPages.forHim.searchPlaceholder}
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
      </SlideInLeft>

      {/* Always visible content section for SEO - prevents Soft 404 */}
      <div className="mb-8 prose prose-sm max-w-none">
        <h2 className="text-2xl font-bold mb-4">Men's Perfumes & Colognes Collection</h2>
        <p className="text-muted-foreground mb-4">
          Explore our extensive collection of men's perfumes and colognes at Alsa Fragrance. From fresh and sporty scents to bold and sophisticated fragrances, we offer authentic men's perfumes from top brands. Find your signature scent or discover something new.
        </p>
        <p className="text-muted-foreground mb-4">
          Shop men's perfumes online at www.alsafragrance.com. Located in Queluz, Portugal. We offer free shipping on all orders. Browse our collection of men's colognes, fragrances, and perfumes.
        </p>
      </div>

      <SlideInRight delay={0.2} className="mb-6">
        <p className="text-muted-foreground">
          {loading ? t.common.loading : `${t.categoryPages.common.showing} ${filteredAndSortedProducts.length} ${t.categoryPages.common.of} ${menProducts.length} ${t.categoryPages.common.products}`}
        </p>
      </SlideInRight>

      {loading ? (
        <FadeInUp delay={0.4} className="text-center py-12">
          <p className="text-muted-foreground text-lg">{t.categoryPages.common.loadingProducts}</p>
        </FadeInUp>
      ) : filteredAndSortedProducts.length === 0 ? (
        <FadeInUp delay={0.4} className="text-center py-12">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Men's Perfumes Available</h3>
            <p className="text-muted-foreground mb-4">
              We're currently updating our men's collection. Check back soon for men's perfumes and colognes. In the meantime, explore our full collection of women's perfumes, attars, testers, and limited edition fragrances.
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
  )
}
