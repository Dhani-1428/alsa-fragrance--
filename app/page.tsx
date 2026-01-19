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
  title: "AlsaFragrance - Luxury Perfumes & Attars | Premium Fragrances Online",
  description: "Discover premium perfumes, attars, and fragrances for men and women at AlsaFragrance. Experience luxury scents that define elegance. Shop online at www.alsafragrance.com - Portugal's premier fragrance destination since 2018.",
  keywords: [
    "www.alsafragrance.com",
    "alsafragrance.com",
    "AlsaFragrance",
    "luxury perfumes",
    "online perfume store",
    "premium fragrances",
    "attars",
    "men's fragrances",
    "women's perfumes",
    "perfumes Portugal",
    "luxury scents",
    "eau de parfum",
    "traditional attars",
    "perfume shop Queluz",
    "buy perfumes online"
  ],
  alternates: {
    canonical: "https://www.alsafragrance.com",
  },
  openGraph: {
    title: "AlsaFragrance - Luxury Perfumes & Attars",
    description: "Discover premium perfumes, attars, and fragrances for men and women. Experience luxury scents that define elegance.",
    url: "https://www.alsafragrance.com",
    siteName: "AlsaFragrance",
    images: [
      {
        url: "https://www.alsafragrance.com/luxury-alsa-fragrance-branded-perfume-bottles-eleg.jpg",
        width: 1200,
        height: 630,
        alt: "AlsaFragrance Luxury Perfumes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
