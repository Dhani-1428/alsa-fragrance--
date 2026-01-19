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
    default: "AlsaFragrance - Luxury Perfumes & Attars",
    template: "%s | AlsaFragrance"
  },
  description:
    "Discover premium perfumes, attars, and fragrances for men and women. Experience luxury scents that define elegance. Shop online for exclusive fragrances.",
  keywords: [
    "perfumes",
    "attars",
    "fragrances",
    "luxury perfumes",
    "men's fragrances",
    "women's perfumes",
    "AlsaFragrance",
    "eau de parfum",
    "luxury scents",
    "premium fragrances",
    "online perfume store"
  ],
  authors: [{ name: "AlsaFragrance" }],
  creator: "AlsaFragrance",
  publisher: "AlsaFragrance",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "AlsaFragrance",
    title: "AlsaFragrance - Luxury Perfumes & Attars",
    description:
      "Discover premium perfumes, attars, and fragrances for men and women. Experience luxury scents that define elegance.",
    images: [
      {
        url: "/luxury-alsa-fragrance-branded-perfume-bottles-eleg.jpg",
        width: 1200,
        height: 630,
        alt: "AlsaFragrance Luxury Perfumes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AlsaFragrance - Luxury Perfumes & Attars",
    description:
      "Discover premium perfumes, attars, and fragrances for men and women. Experience luxury scents that define elegance.",
    images: ["/luxury-alsa-fragrance-branded-perfume-bottles-eleg.jpg"],
    creator: "@alsafragrance",
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
    icon: "/alsa-logo.png",
    apple: "/alsa-logo.png",
  },
  manifest: "/manifest.json",
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
