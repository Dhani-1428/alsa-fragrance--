"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Sparkles, Gift, Crown } from "lucide-react"

export function LimitedEdition() {
  const features = [
    {
      icon: Crown,
      title: "Exclusive Bottles",
      description: "Limited edition ALSA FRAGRANCE bottles with premium craftsmanship",
      image: "/luxury-limited-edition-perfume-bottles-with-golden.jpg",
    },
    {
      icon: Gift,
      title: "Premium Gifting",
      description: "Elegant packaging perfect for special occasions and celebrations",
      image: "/alsa-fragrance-limited-edition-perfume-bottles-lux.jpg",
    },
    {
      icon: Sparkles,
      title: "Rare Scents",
      description: "Unique fragrances available only in our limited collection",
      image: "/alsa-fragrance-limited-edition-perfume-bottles-pre.jpg",
    },
  ]

  return (
    <section className="py-16 px-4 bg-card/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <img
          src="/alsa-fragrance-limited-edition-perfume-bottles-lux.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-playfair)]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Limited Edition
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            Exclusive ALSA FRAGRANCE bottles with premium gifting presentation
          </motion.p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <Card className="overflow-hidden h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <feature.icon className="h-8 w-8 text-primary mb-2" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 font-[family-name:var(--font-playfair)]">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="px-8" asChild>
              <Link href="/limited-edition">View All Limited Edition</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
