import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Traditional Attars | Alsa Fragrance - Pure Alcohol-Free Fragrances",
  description: "Discover authentic traditional attars at Alsa Fragrance. Pure, alcohol-free fragrances made from essential oils. Traditional attars crafted with time-honored techniques. Shop premium attars online.",
  keywords: [
    "Alsa Fragrance",
    "attars",
    "traditional attars",
    "alcohol-free perfumes",
    "pure attars",
    "essential oil perfumes",
    "traditional fragrances",
    "oud attar",
    "rose attar",
    "sandalwood attar"
  ],
  alternates: {
    canonical: "https://www.alsafragrance.com/attars",
  },
  openGraph: {
    title: "Traditional Attars | Alsa Fragrance",
    description: "Discover authentic traditional attars. Pure, alcohol-free fragrances made from essential oils. Traditional attars crafted with time-honored techniques.",
    url: "https://www.alsafragrance.com/attars",
    siteName: "Alsa Fragrance",
    images: [
      {
        url: "https://www.alsafragrance.com/alsa-fragrance-traditional-attar-bottles-ornate-go.jpg",
        width: 1200,
        height: 630,
        alt: "Alsa Fragrance Traditional Attars",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Traditional Attars | Alsa Fragrance",
    description: "Discover authentic traditional attars. Pure, alcohol-free fragrances made from essential oils.",
    images: ["https://www.alsafragrance.com/alsa-fragrance-traditional-attar-bottles-ornate-go.jpg"],
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

export default function AttarsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
