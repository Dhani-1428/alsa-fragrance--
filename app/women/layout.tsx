import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Women's Fragrances | Alsa Fragrance - Premium Women's Perfumes",
  description: "Explore our elegant collection of luxury women's fragrances at Alsa Fragrance. Shop premium women's perfumes, eau de parfum, and feminine scents. Elegant and sophisticated fragrances for every occasion.",
  keywords: [
    "Alsa Fragrance",
    "Alsa Fragrance women",
    "Alsa Fragrance women's perfumes",
    "women's perfumes",
    "women's fragrances",
    "women's eau de parfum",
    "luxury women's perfumes",
    "premium women's fragrances",
    "feminine perfumes",
    "women's scents",
    "buy women's perfumes online",
    "women's perfume collection",
    "ladies perfumes",
    "ladies fragrances",
    "women's luxury scents",
    "premium women's perfumes",
    "designer women's perfumes",
    "women's perfume Portugal",
    "buy women's fragrances online",
    "women's eau de toilette",
    "women's perfume shop",
    "feminine fragrances",
    "women's signature scents",
    "luxury feminine perfumes",
    "premium ladies perfumes",
    "women's perfume boutique",
    "www.alsafragrance.com women",
    "alsafragrance.com women",
    "AlsaFragrance women",
    "women's perfume store",
    "ladies perfume shop",
    "women's fragrance collection",
    "buy ladies perfumes",
    "women's perfume online",
    "luxury ladies fragrances",
    "premium feminine scents"
  ],
  alternates: {
    canonical: "https://www.alsafragrance.com/women",
  },
  openGraph: {
    title: "Women's Fragrances | Alsa Fragrance",
    description: "Explore our elegant collection of luxury women's fragrances. Shop premium women's perfumes and feminine scents.",
    url: "https://www.alsafragrance.com/women",
    siteName: "Alsa Fragrance",
    images: [
      {
        url: "https://www.alsafragrance.com/alsa-fragrance-womens-perfume-bottles-elegant-pink.jpg",
        width: 1200,
        height: 630,
        alt: "Alsa Fragrance Women's Perfumes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Women's Fragrances | Alsa Fragrance",
    description: "Explore our elegant collection of luxury women's fragrances. Shop premium women's perfumes and feminine scents.",
    images: ["https://www.alsafragrance.com/alsa-fragrance-womens-perfume-bottles-elegant-pink.jpg"],
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

export default function WomenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
