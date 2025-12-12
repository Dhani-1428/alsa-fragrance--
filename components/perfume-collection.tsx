"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-provider"
import { useMemo } from "react"

export function PerfumeCollection() {
  const { t } = useLanguage()
  
  const collections = useMemo(() => [
    {
      name: "Royal Oud Collection",
      description: "Luxurious oud-based fragrances inspired by Middle Eastern royalty",
      image: "/royal-oud-perfume-bottles-luxury-gold.jpg?query=luxury gold perfume bottle with ALSA FRAGRANCE logo",
      features: ["Pure Oud Extract", "24-Hour Longevity", "Handcrafted Bottles"],
      side: "left",
    },
    {
      name: "Floral Symphony",
      description: "Delicate floral compositions that capture the essence of blooming gardens",
      image:
        "/floral-perfume-bottles-with-flowers-elegant.jpg?query=elegant floral perfume bottle with ALSA FRAGRANCE logo and flowers",
      features: ["Natural Extracts", "Seasonal Variations", "Eco-Friendly"],
      side: "right",
    },
    {
      name: "Citrus Burst",
      description: "Fresh and invigorating citrus blends perfect for everyday wear",
      image:
        "/fresh-citrus-perfume-bottles-bright-clean.jpg?query=fresh citrus perfume bottle with ALSA FRAGRANCE logo bright design",
      features: ["Energizing Scents", "Light & Fresh", "All-Day Comfort"],
      side: "left",
    },
  ], [])
  return (
    <section className="py-16 px-4 bg-card/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
            {t.components.perfumeCollection.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.components.perfumeCollection.description}
          </p>
        </motion.div>

        <div className="space-y-16">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="grid lg:grid-cols-2 gap-8 items-center"
            >
              {collection.side === "left" ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden rounded-lg shadow-lg"
                  >
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      width={600}
                      height={400}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
                      {collection.name}
                    </h3>
                    <p className="text-muted-foreground text-lg mb-6">{collection.description}</p>
                    <div className="space-y-3 mb-6">
                      {collection.features.map((feature, idx) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center space-x-3 group"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Sparkles className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href="/shop">
                          {t.components.perfumeCollection.exploreCollection}
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </>
              ) : (
                <>
                  <div className="lg:order-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="relative overflow-hidden rounded-lg shadow-lg"
                    >
                      <Image
                        src={collection.image || "/placeholder.svg"}
                        alt={collection.name}
                        width={600}
                        height={400}
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="lg:order-1"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
                      {collection.name}
                    </h3>
                    <p className="text-muted-foreground text-lg mb-6">{collection.description}</p>
                    <div className="space-y-3 mb-6">
                      {collection.features.map((feature, idx) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center space-x-3 group"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Sparkles className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href="/shop">
                          {t.components.perfumeCollection.exploreCollection}
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
