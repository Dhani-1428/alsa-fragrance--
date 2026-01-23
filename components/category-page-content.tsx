import { Metadata } from 'next'

interface CategoryPageContentProps {
  category: 'men' | 'women' | 'testers' | 'new-arrivals' | 'limited-edition' | 'shop'
  title: string
  description: string
}

export function CategoryPageContent({ category, title, description }: CategoryPageContentProps) {
  return (
    <>
      {/* Static content for SEO - visible to Google without JavaScript */}
      <noscript>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg mb-8">{description}</p>
          <div className="prose max-w-none">
            <h2>Shop {title} at Alsa Fragrance</h2>
            <p>
              Discover our premium collection of {title.toLowerCase()} at Alsa Fragrance. 
              We offer luxury perfumes and fragrances crafted with exceptional quality. 
              Browse our selection of {title.toLowerCase()} and find your perfect scent.
            </p>
            <h3>Why Choose Alsa Fragrance?</h3>
            <ul>
              <li>Premium quality fragrances</li>
              <li>Luxury packaging</li>
              <li>Free shipping available</li>
              <li>Authentic products guaranteed</li>
            </ul>
            <p>
              Visit our store in Queluz, Portugal or shop online at www.alsafragrance.com. 
              We ship worldwide and offer secure payment options including MBWay and IBAN transfer.
            </p>
          </div>
        </div>
      </noscript>
      
      {/* Hidden static content for crawlers */}
      <div className="sr-only" aria-hidden="true">
        <h1>{title} - Alsa Fragrance</h1>
        <p>{description}</p>
        <p>
          Shop {title.toLowerCase()} at Alsa Fragrance. Premium luxury perfumes and fragrances. 
          Located in Queluz, Portugal. Free shipping available. Visit www.alsafragrance.com.
        </p>
      </div>
    </>
  )
}
