import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Shop All Perfumes | Alsa Fragrance - Luxury Fragrances Online",
  description: "Browse our complete collection of luxury perfumes, attars, and fragrances at Alsa Fragrance. Shop premium men's and women's fragrances, traditional attars, and exclusive scents online. Free shipping available.",
  keywords: [
    "Alsa Fragrance",
    "shop perfumes",
    "luxury fragrances",
    "buy perfumes online",
    "perfumes Portugal",
    "men's perfumes",
    "women's perfumes",
    "attars",
    "premium fragrances"
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
    },
  },
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
