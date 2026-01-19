import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Montserrat, Great_Vibes, Sacramento, Parisienne, Marck_Script } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { LanguageProvider } from "@/contexts/language-provider"
import { AuthProvider } from "@/contexts/auth-provider"
import { WhatsAppWidget } from "@/components/whatsapp-widget"
import { ScrollToTop } from "@/components/scroll-to-top"
import { BackToTop } from "@/components/back-to-top"
import { Toaster } from "@/components/ui/sonner"
import { StructuredData } from "@/components/structured-data"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
})

const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sacramento",
  display: "swap",
})

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-parisienne",
  display: "swap",
})

const marckScript = Marck_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marck-script",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.alsafragrance.com'),
  title: {
    default: "Alsa Fragrance - Luxury Perfumes & Attars | Premium Fragrances Online",
    template: "%s | Alsa Fragrance"
  },
  description:
    "Alsa Fragrance - Discover premium perfumes, attars, and fragrances for men and women. Experience luxury scents that define elegance. Shop Alsa Fragrance online for exclusive fragrances. Portugal's premier fragrance destination since 2018.",
  keywords: [
    "Alsa Fragrance",
    "Alsa Fragrance perfumes",
    "Alsa Fragrance attars",
    "Alsa Fragrance online",
    "Alsa Fragrance Portugal",
    "AlsaFragrance",
    "www.alsafragrance.com",
    "alsafragrance.com",
    "perfumes",
    "attars",
    "fragrances",
    "luxury perfumes",
    "men's fragrances",
    "women's perfumes",
    "eau de parfum",
    "luxury scents",
    "premium fragrances",
    "online perfume store",
    "perfumes Portugal",
    "perfume shop Queluz",
    "traditional attars",
    "buy perfumes online",
    "luxury perfumes Portugal",
    "attar perfumes",
    "premium fragrances online",
    "designer perfumes",
    "niche perfumes",
    "exclusive fragrances",
    "perfume collection",
    "scented attars",
    "alcohol-free perfumes"
  ],
  authors: [{ name: "Alsa Fragrance" }],
  creator: "Alsa Fragrance",
  publisher: "Alsa Fragrance",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["pt_PT", "hi_IN", "ar_SA", "ur_PK", "fr_FR", "es_ES"],
    url: "/",
    siteName: "Alsa Fragrance",
    title: "Alsa Fragrance - Luxury Perfumes & Attars | Premium Fragrances Online",
    description:
      "Alsa Fragrance - Discover premium perfumes, attars, and fragrances for men and women. Experience luxury scents that define elegance. Shop Alsa Fragrance online at www.alsafragrance.com - Portugal's premier fragrance destination since 2018.",
    images: [
      {
        url: "/luxury-alsa-fragrance-branded-perfume-bottles-eleg.jpg",
        width: 1200,
        height: 630,
        alt: "AlsaFragrance Luxury Perfumes Collection",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alsa Fragrance - Luxury Perfumes & Attars | Premium Fragrances Online",
    description:
      "Alsa Fragrance - Discover premium perfumes, attars, and fragrances for men and women. Experience luxury scents that define elegance. Shop Alsa Fragrance online at www.alsafragrance.com.",
    images: ["/luxury-alsa-fragrance-branded-perfume-bottles-eleg.jpg"],
    creator: "@alsafragrance",
    site: "@alsafragrance",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "geo.region": "PT",
    "geo.placename": "Queluz",
    "geo.position": "38.7592;-9.2545",
    "ICBM": "38.7592, -9.2545",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  icons: {
    icon: [
      { url: "/alsa-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/alsa-logo.png", sizes: "16x16", type: "image/png" },
      { url: "/alsa-logo.png", sizes: "192x192", type: "image/png" },
      { url: "/alsa-logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/alsa-logo.png", sizes: "180x180", type: "image/png" },
      { url: "/alsa-logo.png", sizes: "152x152", type: "image/png" },
      { url: "/alsa-logo.png", sizes: "144x144", type: "image/png" },
      { url: "/alsa-logo.png", sizes: "120x120", type: "image/png" },
      { url: "/alsa-logo.png", sizes: "114x114", type: "image/png" },
      { url: "/alsa-logo.png", sizes: "76x76", type: "image/png" },
      { url: "/alsa-logo.png", sizes: "72x72", type: "image/png" },
      { url: "/alsa-logo.png", sizes: "60x60", type: "image/png" },
      { url: "/alsa-logo.png", sizes: "57x57", type: "image/png" },
    ],
    shortcut: "/alsa-logo.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Alsa Fragrance",
    startupImage: "/alsa-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Suppress hydration warnings on <html> to tolerate extra attributes injected by browser extensions
      <html lang="en" suppressHydrationWarning itemScope itemType="https://schema.org/WebSite">
      <body
        className={`font-sans ${playfair.variable} ${montserrat.variable} ${greatVibes.variable} ${sacramento.variable} ${parisienne.variable} ${marckScript.variable}`}
      >
        <StructuredData />
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ScrollToTop />
                <Suspense fallback={null}>{children}</Suspense>
                <BackToTop />
                <WhatsAppWidget />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
