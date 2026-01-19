import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { CategoryShowcase } from "@/components/category-showcase"
import { FeaturedProducts } from "@/components/featured-products"
import { FragranceNotes } from "@/components/fragrance-notes"
import { CraftingProcess } from "@/components/crafting-process"
import { Testimonials } from "@/components/testimonials"
import { PerfumeCollection } from "@/components/perfume-collection"
import { Footer } from "@/components/footer"
import { NewArrivals } from "@/components/new-arrivals"
import { LimitedEdition } from "@/components/limited-edition"

export const metadata: Metadata = {
  title: "AlsaFragrance - Luxury Perfumes & Attars",
  description: "Discover premium perfumes, attars, and fragrances for men and women. Experience luxury scents that define elegance. Shop online at www.alsafragrance.com",
  keywords: [
    "www.alsafragrance.com",
    "alsafragrance.com",
    "AlsaFragrance",
    "luxury perfumes",
    "online perfume store",
    "premium fragrances",
    "attars",
    "men's fragrances",
    "women's perfumes"
  ],
  alternates: {
    canonical: "https://www.alsafragrance.com",
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden w-full">
      <Navigation />
      <HeroSection />
      <CategoryShowcase />
      <FeaturedProducts />
      <NewArrivals />
      <FragranceNotes />
      <PerfumeCollection />
      <LimitedEdition />
      <CraftingProcess />
      <Testimonials />
      <Footer />
    </main>
  )
}
