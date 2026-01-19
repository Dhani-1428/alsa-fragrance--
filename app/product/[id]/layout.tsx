import { Metadata } from 'next'
import { getProductById } from '@/lib/products-api'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const productId = parseInt(resolvedParams.id, 10)
  
  if (isNaN(productId)) {
    return {
      title: "Product | Alsa Fragrance",
      description: "Shop luxury perfumes and fragrances at Alsa Fragrance.",
    }
  }

  try {
    const product = await getProductById(productId, 'en')
    
    if (!product) {
      return {
        title: "Product Not Found | Alsa Fragrance",
        description: "The product you're looking for doesn't exist at Alsa Fragrance.",
      }
    }

    const baseUrl = 'https://www.alsafragrance.com'
    const productUrl = `${baseUrl}/product/${productId}`
    const productImage = product.image || `${baseUrl}/luxury-alsa-fragrance-branded-perfume-bottles-eleg.jpg`
    const price = product.originalPrice || product.price
    const currency = 'EUR'
    const inStock = product.stock > 0

    return {
      title: `${product.name} | Alsa Fragrance - Luxury Perfume`,
      description: product.description 
        ? `${product.description.substring(0, 155)}...`
        : `Shop ${product.name} at Alsa Fragrance. Premium luxury perfume and fragrance. ${inStock ? 'In stock now.' : 'Limited availability.'}`,
      keywords: [
        product.name,
        "Alsa Fragrance",
        "luxury perfume",
        "premium fragrance",
        "buy perfume online",
        product.category || "fragrance",
        ...(product.notesTop || []),
        ...(product.notesMiddle || []),
        ...(product.notesBase || []),
      ],
      alternates: {
        canonical: productUrl,
      },
      openGraph: {
        title: `${product.name} | Alsa Fragrance`,
        description: product.description 
          ? `${product.description.substring(0, 200)}...`
          : `Shop ${product.name} - Premium luxury perfume at Alsa Fragrance.`,
        url: productUrl,
        siteName: "Alsa Fragrance",
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: `${product.name} - Alsa Fragrance`,
          },
        ],
        type: "product",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | Alsa Fragrance`,
        description: product.description 
          ? `${product.description.substring(0, 200)}...`
          : `Shop ${product.name} - Premium luxury perfume.`,
        images: [productImage],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      other: {
        "product:price:amount": price.toString(),
        "product:price:currency": currency,
        "product:availability": inStock ? "in stock" : "out of stock",
      },
    }
  } catch (error) {
    console.error("Error generating product metadata:", error)
    return {
      title: "Product | Alsa Fragrance",
      description: "Shop luxury perfumes and fragrances at Alsa Fragrance.",
    }
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
