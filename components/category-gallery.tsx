"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { FadeInUp, StaggerContainer, StaggerItem } from "./page-animations"
import { useLanguage } from "@/contexts/language-provider"

interface CategoryGalleryProps {
  title: string
  images: {
    src: string
    alt: string
    title: string
    description: string
  }[]
}

export function CategoryGallery({ title, images }: CategoryGalleryProps) {
  const { t } = useLanguage()
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <FadeInUp className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.components.categoryGallery.description}
          </p>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <StaggerItem key={index}>
              <motion.div
                className="group relative overflow-hidden rounded-lg bg-card shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    src={image.src || "/premium-perfume-bottle-category-gallery.jpg"}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                >
                  <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-lg mb-2">{image.title}</h3>
                  <p className="text-sm text-white/90">{image.description}</p>
                </motion.div>

                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-lg mb-2">{image.title}</h3>
                  <p className="text-muted-foreground text-sm">{image.description}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
