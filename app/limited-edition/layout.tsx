import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Limited Edition Fragrances | Alsa Fragrance - Exclusive Perfumes",
  description: "Explore exclusive limited edition fragrances at Alsa Fragrance. Rare scents and premium bottles with elegant gifting presentation. Limited availability - shop exclusive perfumes now.",
  keywords: [
    "Alsa Fragrance",
    "Alsa Fragrance limited edition",
    "Alsa Fragrance exclusive",
    "limited edition perfumes",
    "exclusive fragrances",
    "rare perfumes",
    "collector perfumes",
    "premium gift perfumes",
    "limited edition scents",
    "exclusive perfume collection",
    "limited edition fragrance",
    "exclusive perfume bottles",
    "rare fragrance collection",
    "collector's edition perfumes",
    "limited release perfumes",
    "exclusive luxury perfumes",
    "rare scent collection",
    "limited edition perfume bottles",
    "exclusive fragrance bottles",
    "premium gifting perfumes",
    "luxury gift perfumes",
    "limited availability perfumes",
    "exclusive perfume launches",
    "rare perfume collection",
    "www.alsafragrance.com limited edition",
    "alsafragrance.com limited edition",
    "AlsaFragrance limited edition",
    "limited edition perfume shop",
    "exclusive fragrance store",
    "rare perfume boutique",
    "collector perfume collection",
    "limited edition scents Portugal",
    "exclusive perfume Portugal",
    "rare fragrances online",
    "limited release fragrances",
    "exclusive luxury scents",
    "premium limited edition perfumes"
  ],
  alternates: {
    canonical: "https://www.alsafragrance.com/limited-edition",
  },
  openGraph: {
    title: "Limited Edition Fragrances | Alsa Fragrance",
    description: "Explore exclusive limited edition fragrances. Rare scents and premium bottles with elegant gifting presentation.",
    url: "https://www.alsafragrance.com/limited-edition",
    siteName: "Alsa Fragrance",
    images: [
      {
        url: "https://www.alsafragrance.com/alsa-fragrance-limited-edition-perfume-bottles-pre.jpg",
        width: 1200,
        height: 630,
        alt: "Alsa Fragrance Limited Edition Perfumes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Limited Edition Fragrances | Alsa Fragrance",
    description: "Explore exclusive limited edition fragrances. Rare scents and premium bottles with elegant gifting presentation.",
    images: ["https://www.alsafragrance.com/alsa-fragrance-limited-edition-perfume-bottles-pre.jpg"],
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

export default function LimitedEditionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
