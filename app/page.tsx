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

export default function HomePage() {
  return (
    <main className="min-h-screen">
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
