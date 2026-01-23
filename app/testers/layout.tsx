import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Perfume Testers | Alsa Fragrance - Try Before You Buy",
  description: "Try before you buy with Alsa Fragrance perfume testers. Sample our luxury fragrances at affordable prices. Test premium perfumes before committing to full-size bottles. Free shipping on testers.",
  keywords: [
    "Alsa Fragrance",
    "Alsa Fragrance testers",
    "Alsa Fragrance samples",
    "perfume testers",
    "fragrance samples",
    "try before you buy",
    "perfume samples",
    "test perfumes",
    "sample fragrances",
    "affordable perfume testers",
    "perfume tester bottles",
    "fragrance tester collection",
    "perfume sample sizes",
    "try perfumes before buying",
    "perfume testers online",
    "fragrance testers Portugal",
    "buy perfume testers",
    "perfume sample pack",
    "fragrance sample collection",
    "test luxury perfumes",
    "sample premium fragrances",
    "perfume tester set",
    "fragrance discovery set",
    "try new perfumes",
    "perfume sample bottles",
    "www.alsafragrance.com testers",
    "alsafragrance.com testers",
    "AlsaFragrance testers",
    "perfume testers shop",
    "affordable fragrance samples",
    "luxury perfume testers",
    "premium fragrance samples",
    "perfume tester collection",
    "sample perfume collection",
    "test before buy perfumes",
    "perfume sample store"
  ],
  alternates: {
    canonical: "https://www.alsafragrance.com/testers",
  },
  openGraph: {
    title: "Perfume Testers | Alsa Fragrance",
    description: "Try before you buy with Alsa Fragrance perfume testers. Sample our luxury fragrances at affordable prices.",
    url: "https://www.alsafragrance.com/testers",
    siteName: "Alsa Fragrance",
    images: [
      {
        url: "https://www.alsafragrance.com/alsa-fragrance-perfume-tester-bottles-sample-displ.jpg",
        width: 1200,
        height: 630,
        alt: "Alsa Fragrance Perfume Testers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfume Testers | Alsa Fragrance",
    description: "Try before you buy with Alsa Fragrance perfume testers. Sample our luxury fragrances at affordable prices.",
    images: ["https://www.alsafragrance.com/alsa-fragrance-perfume-tester-bottles-sample-displ.jpg"],
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

export default function TestersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
