import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About Us | Alsa Fragrance - Luxury Perfume Brand Since 2018",
  description: "Learn about Alsa Fragrance - crafting exceptional perfumes since 2018. Discover our story, values, and commitment to luxury fragrances. Premium perfumes made with royal sophistication in Queluz, Portugal.",
  keywords: [
    "Alsa Fragrance",
    "about Alsa Fragrance",
    "luxury perfume brand",
    "fragrance company Portugal",
    "perfume craftsmanship",
    "premium fragrances",
    "luxury perfume story",
    "Queluz perfume store"
  ],
  alternates: {
    canonical: "https://www.alsafragrance.com/about",
  },
  openGraph: {
    title: "About Us | Alsa Fragrance",
    description: "Learn about Alsa Fragrance - crafting exceptional perfumes since 2018. Discover our story, values, and commitment to luxury fragrances.",
    url: "https://www.alsafragrance.com/about",
    siteName: "Alsa Fragrance",
    images: [
      {
        url: "https://www.alsafragrance.com/alsa-fragrance-about-us-luxury-perfume-boutique-el.jpg",
        width: 1200,
        height: 630,
        alt: "Alsa Fragrance About Us",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Alsa Fragrance",
    description: "Learn about Alsa Fragrance - crafting exceptional perfumes since 2018. Discover our story and commitment to luxury.",
    images: ["https://www.alsafragrance.com/alsa-fragrance-about-us-luxury-perfume-boutique-el.jpg"],
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
