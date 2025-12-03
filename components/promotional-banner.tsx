"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Crown, Star, Tag, Gift, Zap } from "lucide-react"

interface PromotionalBannerProps {
  type?: "exclusive" | "signature" | "premium" | "sale" | "new" | "limited"
}

export function PromotionalBanner({ type = "exclusive" }: PromotionalBannerProps) {
  const bannerConfig = {
    exclusive: {
      icon: Crown,
      title: "Exclusive Collection",
      subtitle: "Alsa Fragrance Premium Series",
      description: "Discover our most coveted fragrances crafted with rare ingredients",
      cta: "Explore Exclusive",
      gradient: "from-primary/90 to-primary",
      backgroundImage: null,
    },
    signature: {
      icon: Star,
      title: "Signature Scents",
      subtitle: "Handcrafted Alsa Originals",
      description: "Experience our master perfumer's finest creations",
      cta: "Shop Signature",
      gradient: "from-primary/80 to-primary/90",
      backgroundImage: null,
    },
    premium: {
      icon: Sparkles,
      title: "Premium Attars",
      subtitle: "Traditional Luxury Redefined",
      description: "Pure oil-based fragrances from the finest natural essences",
      cta: "Discover Premium",
      gradient: "from-primary/70 to-primary/80",
      backgroundImage: null,
    },
    sale: {
      icon: Tag,
      title: "Special Sale",
      subtitle: "Alsa Fragrance Limited Time Offer",
      description: "Get up to 40% off on selected premium fragrances",
      cta: "Shop Sale",
      gradient: "from-red-600/90 to-red-700",
      backgroundImage: null,
    },
    new: {
      icon: Gift,
      title: "New Arrivals",
      subtitle: "Fresh Alsa Fragrance Collection",
      description: "Explore our latest captivating scents just launched",
      cta: "Discover New",
      gradient: "from-green-600/90 to-green-700",
      backgroundImage: "/alsa-attar-bottles-carry-bags-collection.jpg",
    },
    limited: {
      icon: Zap,
      title: "Limited Edition",
      subtitle: "Exclusive Alsa Fragrance Series",
      description: "Rare fragrances available for a limited time only",
      cta: "Get Limited",
      gradient: "from-purple-600/90 to-purple-700",
      backgroundImage: "/alsa-limited-edition-bottles-collection.jpg",
    },
  }

  const config = bannerConfig[type]
  const Icon = config.icon

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`py-16 px-4 ${config.backgroundImage ? "bg-cover bg-center bg-no-repeat" : `bg-gradient-to-r ${config.gradient}`} text-white relative overflow-hidden`}
      style={config.backgroundImage ? { backgroundImage: `url(${config.backgroundImage})` } : {}}
    >
      <div className={`absolute inset-0 ${config.backgroundImage ? "bg-black/60" : "bg-black/20"}`}></div>

      {!config.backgroundImage && (
        <>
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 translate-y-16"></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full"></div>
        </>
      )}

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8 backdrop-blur-sm"
          >
            <Icon className="h-10 w-10" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6 font-[family-name:var(--font-playfair)]"
          >
            {config.title}
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-2xl md:text-3xl font-semibold mb-6 text-white/90"
          >
            {config.subtitle}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl mb-10 text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            {config.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 px-10 py-4 text-xl font-semibold rounded-full shadow-lg"
            >
              {config.cta}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
