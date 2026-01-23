import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Shop All Perfumes | Alsa Fragrance - Luxury Fragrances Online",
  description: "Browse our complete collection of luxury perfumes, attars, and fragrances at Alsa Fragrance. Shop premium men's and women's fragrances, traditional attars, and exclusive scents online. Free shipping available.",
  keywords: [
    "Alsa Fragrance",
    "Alsa Fragrance shop",
    "Alsa Fragrance perfumes",
    "Alsa Fragrance online store",
    "shop perfumes",
    "buy perfumes online",
    "luxury fragrances",
    "luxury perfumes",
    "premium fragrances",
    "premium perfumes",
    "perfumes Portugal",
    "perfumes online Portugal",
    "men's perfumes",
    "women's perfumes",
    "men's fragrances",
    "women's fragrances",
    "attars",
    "traditional attars",
    "eau de parfum",
    "perfume collection",
    "designer perfumes",
    "niche perfumes",
    "exclusive fragrances",
    "luxury scents",
    "perfume shop",
    "fragrance store",
    "online perfume store",
    "buy fragrances online",
    "perfume store Portugal",
    "Queluz perfume shop",
    "www.alsafragrance.com",
    "alsafragrance.com shop",
    "AlsaFragrance shop",
    "perfume boutique",
    "fragrance boutique",
    "luxury perfume shop",
    "premium fragrance store",
    "perfume ecommerce",
    "fragrance ecommerce",
    "shop luxury perfumes",
    "buy premium fragrances",
    "perfume online shopping",
    "fragrance online shopping"
  ],
  alternates: {
    canonical: "https://www.alsafragrance.com/shop",
  },
  openGraph: {
    title: "Shop All Perfumes | Alsa Fragrance",
    description: "Browse our complete collection of luxury perfumes, attars, and fragrances. Shop premium fragrances online with free shipping.",
    url: "https://www.alsafragrance.com/shop",
    siteName: "Alsa Fragrance",
    images: [
      {
        url: "https://www.alsafragrance.com/luxury-alsa-fragrance-branded-perfume-bottles-eleg.jpg",
        width: 1200,
        height: 630,
        alt: "Alsa Fragrance Perfume Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Perfumes | Alsa Fragrance",
    description: "Browse our complete collection of luxury perfumes, attars, and fragrances. Shop premium fragrances online.",
    images: ["https://www.alsafragrance.com/luxury-alsa-fragrance-branded-perfume-bottles-eleg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "PT",
    "geo.placename": "Queluz",
  },
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
