"use client"

interface CategoryHeroProps {
  title: string
  description: string
  image: string
  productCount: number
}

export function CategoryHero({ title, description, image, productCount }: CategoryHeroProps) {
  const scrollToProducts = () => {
    window.scrollTo({
      top: window.innerHeight * 0.5, // Scroll past the hero section
      behavior: "smooth",
    })
  }

  return (
    <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${image})` }}>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-[family-name:var(--font-playfair)] text-balance">
            {title}
          </h1>
          <p className="text-lg md:text-xl mb-4 text-gray-200 max-w-2xl mx-auto text-balance">{description}</p>
          <p className="text-sm text-primary font-medium">{productCount} Products Available</p>

          <button
            onClick={scrollToProducts}
            className="mt-6 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors duration-200"
          >
            Shop Now
          </button>
        </div>
      </div>
    </section>
  )
}
