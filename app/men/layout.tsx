import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Men's Fragrances | Alsa Fragrance - Premium Men's Perfumes",
  description: "Discover our collection of luxury men's fragrances at Alsa Fragrance. Shop premium men's perfumes, colognes, and scents. Bold, sophisticated fragrances for the modern man. Free shipping.",
  keywords: [
    "Alsa Fragrance",
    "men's perfumes",
    "men's fragrances",
    "men's cologne",
    "luxury men's perfumes",
    "premium men's fragrances",
    "men's scents",
    "masculine perfumes",
    "buy men's perfumes online"
  ],
  alternates: {
    canonical: "https://www.alsafragrance.com/men",
  },
  openGraph: {
    title: "Men's Fragrances | Alsa Fragrance",
    description: "Discover our collection of luxury men's fragrances. Shop premium men's perfumes and colognes for the modern man.",
    url: "https://www.alsafragrance.com/men",
    siteName: "Alsa Fragrance",
    images: [
      {
        url: "https://www.alsafragrance.com/alsa-fragrance-mens-cologne-bottles-sophisticated-.jpg",
        width: 1200,
        height: 630,
        alt: "Alsa Fragrance Men's Perfumes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Men's Fragrances | Alsa Fragrance",
    description: "Discover our collection of luxury men's fragrances. Shop premium men's perfumes and colognes.",
    images: ["https://www.alsafragrance.com/alsa-fragrance-mens-cologne-bottles-sophisticated-.jpg"],
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

export default function MenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
