import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PageAnimations } from "@/components/page-animations"
import { MenPageClient } from "./MenPageClient"
import { ProductCount } from "./ProductCount"
import { getProductsByCategoryServer, type Product } from "@/lib/products-api-server"

export default async function MenPage() {
  // Fetch products server-side so Google can see them in initial HTML
  let initialProducts: Product[] = []
  try {
    initialProducts = await getProductsByCategoryServer("men", "en")
  } catch (error) {
    console.error("Error fetching products server-side:", error)
  }

  return (
    <PageAnimations>
      <main className="min-h-screen">
        {/* Static SEO content for Google crawlers */}
        <div className="sr-only" aria-hidden="true">
          <h1>Men's Fragrances | Alsa Fragrance - Premium Men's Perfumes</h1>
          <p>Discover our collection of luxury men's fragrances at Alsa Fragrance. Shop premium men's perfumes, colognes, and scents. Bold, sophisticated fragrances for the modern man.</p>
          <p>Alsa Fragrance offers premium men's perfumes, luxury colognes, and masculine scents. Shop men's perfumes online at www.alsafragrance.com. Located in Queluz, Portugal. Free shipping available.</p>
        </div>
        <Navigation />

        {/* Hero Section - Static for SEO */}
        <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/alsa-fragrance-mens-cologne-bottles-sophisticated-.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-[family-name:var(--font-playfair)] text-balance">
                Men's Perfumes & Colognes
              </h1>
              <p className="text-lg md:text-xl mb-4 text-gray-200 max-w-2xl mx-auto text-balance">
                Discover our collection of luxury men's fragrances. Bold, sophisticated scents for the modern man.
              </p>
              <ProductCount />
            </div>
          </div>
        </section>

        <MenPageClient initialProducts={initialProducts} />
      </main>

      <Footer />
    </PageAnimations>
  )
}
