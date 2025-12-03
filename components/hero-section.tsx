"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const heroSlides = [
  {
    id: 1,
    title: "Alsa Signature Collection",
    subtitle: "Discover Our Premium Fragrances",
    description: "Experience luxury with our carefully curated selection of premium perfumes and attars",
    image: "/luxury-alsa-fragrance-branded-perfume-bottles-eleg.jpg",
    cta: "Shop Collection",
  },
  {
    id: 2,
    title: "Alsa Limited Edition",
    subtitle: "Exclusive Scents for Connoisseurs",
    description: "Rare and exquisite fragrances crafted for those who appreciate the finest",
    image: "/alsa-fragrance-limited-edition-perfume-bottles-pre.jpg",
    cta: "Explore Limited Edition",
  },
  {
    id: 3,
    title: "Alsa Attar Collection",
    subtitle: "Traditional Luxury Redefined",
    description: "Pure, alcohol-free fragrances that capture the essence of timeless elegance",
    image: "/alsa-fragrance-traditional-attar-bottles-ornate-go.jpg",
    cta: "Discover Attars",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      <AnimatePresence mode="wait">
        {heroSlides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <motion.div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${slide.image})` }}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 8 }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                </motion.div>

                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-center text-white max-w-4xl mx-auto px-4">
                    <motion.h2
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="text-sm md:text-base font-medium text-primary mb-4 tracking-wider uppercase"
                    >
                      {slide.subtitle}
                    </motion.h2>
                    <motion.h1
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-[family-name:var(--font-playfair)] text-balance"
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                      className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto text-balance"
                    >
                      {slide.description}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg"
                      >
                        {slide.cta}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ),
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Slide Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2"
      >
        {heroSlides.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentSlide ? "bg-primary" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </motion.div>
    </section>
  )
}
