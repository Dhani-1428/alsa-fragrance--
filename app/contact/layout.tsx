import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact Us | Alsa Fragrance - Perfume Store in Queluz, Portugal",
  description: "Contact Alsa Fragrance - Luxury perfume store in Queluz, Portugal. Visit us at Avenida doutor Miguel bombarda Loja n'47 or reach us via phone +351 920062535. Email: fragrancealsa@gmail.com",
  keywords: [
    "Alsa Fragrance contact",
    "Alsa Fragrance address",
    "perfume store Portugal",
    "Queluz perfume shop",
    "Alsa Fragrance phone",
    "Alsa Fragrance email",
    "visit Alsa Fragrance",
    "contact perfume store"
  ],
  alternates: {
    canonical: "https://www.alsafragrance.com/contact",
  },
  openGraph: {
    title: "Contact Us | Alsa Fragrance",
    description: "Contact Alsa Fragrance - Luxury perfume store in Queluz, Portugal. Visit us or reach us via phone, email, or online form.",
    url: "https://www.alsafragrance.com/contact",
    siteName: "Alsa Fragrance",
    images: [
      {
        url: "https://www.alsafragrance.com/contact hero img.png",
        width: 1200,
        height: 630,
        alt: "Alsa Fragrance Contact",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Alsa Fragrance",
    description: "Contact Alsa Fragrance - Luxury perfume store in Queluz, Portugal. Visit us or reach us via phone, email, or online form.",
    images: ["https://www.alsafragrance.com/contact hero img.png"],
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

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
