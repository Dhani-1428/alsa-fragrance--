import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    name: "Women",
    href: "/women",
    image: "/alsa-fragrance-womens-perfume-bottles-elegant-pink.jpg",
    description: "Feminine fragrances that captivate and inspire",
  },
  {
    name: "Men",
    href: "/men",
    image: "/alsa-fragrance-mens-cologne-bottles-sophisticated-.jpg",
    description: "Bold and sophisticated scents for the modern man",
  },
  {
    name: "Attars",
    href: "/attars",
    image: "/alsa-fragrance-traditional-attar-bottles-ornate-go.jpg",
    description: "Pure, alcohol-free traditional fragrances",
  },
  {
    name: "Testers",
    href: "/testers",
    image: "/alsa-fragrance-perfume-tester-bottles-sample-displ.jpg",
    description: "Try before you buy with our tester collection",
  },
]

export function CategoryShowcase() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
            Shop by Collection
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our carefully curated collections designed for every preference and occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="group">
              <Card className="overflow-hidden border-0 bg-card hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-playfair)]">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-200">{category.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
