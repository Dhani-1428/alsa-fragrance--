"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getNewArrivals } from "@/lib/products-main"
import { ProductCard } from "@/components/product-card"

export function NewArrivals() {
  const newProducts = getNewArrivals()

  return (
    <section className="py-16 px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <img src="/alsa-fragrance-perfume-bottles-gift-boxes-polly-ba.jpg" alt="" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="relative h-64 rounded-2xl overflow-hidden mb-8 shadow-2xl">
            <img src="/alsa-fragrance-new-arrivals-perfume-bottles-beauti.jpg" alt="New Arrivals" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center pb-8">
              <div>
                <motion.h2
                  className="text-4xl md:text-5xl font-bold mb-2 font-[family-name:var(--font-playfair)] text-white"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  New Arrivals
                </motion.h2>
                <motion.p
                  className="text-white/90 text-lg max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  Discover our latest ALSA FRAGRANCE creations with premium packaging
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newProducts.slice(0, 8).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="px-8" asChild>
              <Link href="/new-arrivals">View All New Arrivals</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
