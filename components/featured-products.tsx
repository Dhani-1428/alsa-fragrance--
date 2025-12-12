"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts } from "@/lib/products-main"
import { ProductCard } from "@/components/product-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-provider"
import Link from "next/link"

const extendedFeaturedProducts = [
  ...getFeaturedProducts(),
  {
    id: 41,
    name: "Alsa Fragrance - Sapphire Dreams",
    category: "women" as const,
    price: 129.99,
    rating: 4.8,
    reviews: 145,
    image: "/luxury-blue-sapphire-perfume-bottle-with-alsa-frag.jpg",
    description: "A precious fragrance as rare and beautiful as a sapphire gemstone.",
    notes: {
      top: ["Blue Lotus", "Bergamot", "Aquatic Notes"],
      middle: ["Sapphire Accord", "Iris", "Violet"],
      base: ["Blue Musk", "Crystal Amber", "Precious Woods"],
    },
    size: ["30ml", "50ml", "100ml"],
    inStock: true,
    badge: "Precious",
  },
  {
    id: 42,
    name: "Alsa Fragrance - Titan Force",
    category: "men" as const,
    price: 139.99,
    rating: 4.9,
    reviews: 178,
    image: "/powerful-titanium-cologne-bottle-with-alsa-fragran.jpg",
    description: "A powerful masculine fragrance with the strength of titans.",
    notes: {
      top: ["Metallic Notes", "Bergamot", "Black Pepper"],
      middle: ["Titan Accord", "Leather", "Spices"],
      base: ["Titanium Woods", "Amber", "Dark Musk"],
    },
    size: ["50ml", "100ml"],
    inStock: true,
    badge: "Powerful",
  },
  {
    id: 43,
    name: "Alsa Fragrance - Ruby Passion",
    category: "women" as const,
    price: 149.99,
    rating: 4.7,
    reviews: 167,
    image: "/red-ruby-perfume-bottle-with-alsa-fragrance-logo-e.jpg",
    description: "A passionate fragrance that burns with the intensity of rubies.",
    notes: {
      top: ["Red Berries", "Pink Pepper", "Mandarin"],
      middle: ["Ruby Rose", "Passion Flower", "Red Orchid"],
      base: ["Ruby Amber", "Patchouli", "Vanilla"],
    },
    size: ["30ml", "50ml", "100ml"],
    inStock: true,
    badge: "Passionate",
  },
  {
    id: 44,
    name: "Alsa Fragrance - Platinum Ice",
    category: "men" as const,
    price: 154.99,
    rating: 4.8,
    reviews: 134,
    image: "/platinum-silver-cologne-bottle-with-alsa-fragrance.jpg",
    description: "A cool, sophisticated fragrance as precious as platinum.",
    notes: {
      top: ["Icy Mint", "Frozen Citrus", "Cool Air"],
      middle: ["Platinum Accord", "Arctic Sage", "Silver Birch"],
      base: ["Frozen Woods", "Cool Musk", "Platinum Amber"],
    },
    size: ["50ml", "100ml"],
    inStock: true,
    badge: "Cool",
  },
]

export function FeaturedProducts() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const carouselRef = useRef<NodeJS.Timeout | null>(null)

  const itemsPerView = 4
  const maxIndex = Math.max(0, extendedFeaturedProducts.length - itemsPerView)

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
              {extendedFeaturedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * 24) / itemsPerView}px)` }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
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
