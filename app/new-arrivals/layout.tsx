import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "New Arrivals | Alsa Fragrance - Latest Perfumes & Fragrances",
  description: "Discover the newest fragrances at Alsa Fragrance. Shop our latest perfume arrivals and new fragrance collections. Be the first to experience our newest luxury scents. Free shipping.",
  keywords: [
    "Alsa Fragrance",
    "new perfumes",
    "new fragrances",
    "latest perfumes",
    "new arrivals",
    "new scent collection",
    "latest fragrance releases",
    "new perfume launches"
  ],
  alternates: {
    canonical: "https://www.alsafragrance.com/new-arrivals",
  },
  openGraph: {
    title: "New Arrivals | Alsa Fragrance",
    description: "Discover the newest fragrances at Alsa Fragrance. Shop our latest perfume arrivals and new fragrance collections.",
    url: "https://www.alsafragrance.com/new-arrivals",
    siteName: "Alsa Fragrance",
    images: [
      {
        url: "https://www.alsafragrance.com/alsa-fragrance-new-arrivals-perfume-bottles-beauti.jpg",
        width: 1200,
        height: 630,
        alt: "Alsa Fragrance New Arrivals",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Arrivals | Alsa Fragrance",
    description: "Discover the newest fragrances at Alsa Fragrance. Shop our latest perfume arrivals and new fragrance collections.",
    images: ["https://www.alsafragrance.com/alsa-fragrance-new-arrivals-perfume-bottles-beauti.jpg"],
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

export default function NewArrivalsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
