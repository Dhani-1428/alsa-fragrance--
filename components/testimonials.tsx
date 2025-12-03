"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    text: "The Royal Oud collection is absolutely divine! The longevity is incredible - I still catch whiffs of it at the end of the day. Worth every penny.",
    product: "Royal Oud Intense",
  },
  {
    name: "Ahmed Al-Rashid",
    location: "Dubai, UAE",
    rating: 5,
    text: "As someone who appreciates authentic oud, I can say this is the real deal. The quality rivals the most expensive niche brands I've tried.",
    product: "Traditional Oud",
  },
  {
    name: "Emma Thompson",
    location: "London, UK",
    rating: 5,
    text: "The Floral Symphony collection is perfect for spring. It's elegant, sophisticated, and gets compliments everywhere I go. My new signature scent!",
    product: "Rose Garden",
  },
  {
    name: "Carlos Rodriguez",
    location: "Barcelona, Spain",
    rating: 5,
    text: "Exceptional customer service and even better fragrances. The Citrus Burst line is my go-to for daily wear. Fresh, clean, and energizing.",
    product: "Mediterranean Breeze",
  },
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    rating: 5,
    text: "The attention to detail in packaging and the quality of the fragrances is outstanding. These are luxury perfumes at accessible prices.",
    product: "Jasmine Nights",
  },
  {
    name: "Michael Chen",
    location: "Singapore",
    rating: 5,
    text: "I've been collecting fragrances for years, and Alsa's attars are among the finest I own. The craftsmanship is evident in every bottle.",
    product: "Sandalwood Attar",
  },
  {
    name: "Isabella Martinez",
    location: "Madrid, Spain",
    rating: 5,
    text: "The Amber collection is pure luxury. Each fragrance tells a story and the sillage is perfect - not overpowering but definitely noticeable.",
    product: "Golden Amber",
  },
  {
    name: "David Kim",
    location: "Seoul, South Korea",
    rating: 5,
    text: "Fast shipping to Asia and the quality exceeded my expectations. The Woody collection has become my signature for business meetings.",
    product: "Cedar & Vetiver",
  },
  {
    name: "Fatima Al-Zahra",
    location: "Riyadh, Saudi Arabia",
    rating: 5,
    text: "Authentic Middle Eastern fragrances that remind me of home. The quality is exceptional and the prices are very reasonable.",
    product: "Arabian Nights",
  },
  {
    name: "Sophie Laurent",
    location: "Paris, France",
    rating: 5,
    text: "Très magnifique! The French Riviera collection captures the essence of summer perfectly. I get compliments every time I wear it.",
    product: "Lavender Dreams",
  },
  {
    name: "James Wilson",
    location: "Toronto, Canada",
    rating: 5,
    text: "The customer service is outstanding and the fragrances are even better. My wife and I both found our perfect scents here.",
    product: "Winter Spice",
  },
  {
    name: "Aisha Patel",
    location: "London, UK",
    rating: 5,
    text: "The Exotic collection is absolutely stunning. Each bottle is a work of art and the fragrances are incredibly long-lasting.",
    product: "Mystic Rose",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => prev + 1)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isHovered])

  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="py-16 px-4 bg-card/30 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made our fragrances part of their daily ritual
          </p>
        </div>

        <div
          className="relative mb-12"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex gap-6"
            animate={{
              x: `${-((currentIndex % testimonials.length) * 320)}px`,
            }}
            transition={{
              duration: 3,
              ease: "linear",
            }}
            style={{ width: `${duplicatedTestimonials.length * 320}px` }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                className="min-w-[300px] bg-card rounded-lg p-6 shadow-lg border transition-all duration-300"
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i + 0.5 }}
                      className="text-primary text-lg"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>

                <p className="text-muted-foreground mb-4 italic leading-relaxed text-sm">"{testimonial.text}"</p>

                <div className="border-t pt-4">
                  <h4 className="font-bold text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-muted-foreground mb-1">{testimonial.location}</p>
                  <p className="text-xs text-primary font-medium">Purchased: {testimonial.product}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="px-8 bg-transparent">
            Read More Reviews
          </Button>
        </div>
      </div>
    </section>
  )
}
