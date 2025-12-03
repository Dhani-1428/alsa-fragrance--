"use client"

import { useState, useMemo } from "react"
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
import { getAllNewArrivals } from "@/lib/products-main"
import { motion } from "framer-motion"

export default function NewArrivalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const newArrivalsProducts = getAllNewArrivals()

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = newArrivalsProducts.filter((product) => {
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
  }, [searchQuery, sortBy, newArrivalsProducts])

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
            style={{ backgroundImage: "url('/alsa-fragrance-new-arrivals-perfume-bottles-beauti.jpg')" }}
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
                New Arrivals
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl mb-4 text-gray-200 max-w-2xl mx-auto text-balance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Discover our latest ALSA FRAGRANCE creations with premium packaging and exceptional quality
              </motion.p>
              <motion.p
                className="text-sm text-primary font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                {newArrivalsProducts.length} New Products Available
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
                placeholder="Search new arrivals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
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
              Showing {filteredAndSortedProducts.length} of {newArrivalsProducts.length} new arrival products
            </p>
          </FadeInUp>

          {filteredAndSortedProducts.length === 0 ? (
            <FadeInUp delay={0.5} className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">No products found</p>
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear Search
              </Button>
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
              <h3 className="font-semibold mb-2">Latest Fragrances</h3>
              <p className="text-sm text-muted-foreground">
                Be among the first to experience our newest fragrance creations
              </p>
            </StaggerItem>
            <StaggerItem className="text-center p-6 bg-card/30 rounded-lg">
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">
                Each new arrival is crafted with the finest ingredients and exceptional attention to detail
              </p>
            </StaggerItem>
            <StaggerItem className="text-center p-6 bg-card/30 rounded-lg">
              <h3 className="font-semibold mb-2">Exclusive Packaging</h3>
              <p className="text-sm text-muted-foreground">
                Our new arrivals feature premium packaging that reflects the luxury within
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </main>

      <Footer />
    </PageAnimations>
  )
}

