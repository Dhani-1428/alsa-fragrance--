import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Montserrat, Great_Vibes, Sacramento, Parisienne, Marck_Script } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { LanguageProvider } from "@/contexts/language-provider"
import { AuthProvider } from "@/contexts/auth-provider"
import { CartDrawer } from "@/components/cart-drawer"
import { WishlistDrawer } from "@/components/wishlist-drawer"
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
  title: "AlsaFragrance - Luxury Perfumes & Attars",
  description:
    "Discover premium perfumes, attars, and fragrances for men and women. Experience luxury scents that define elegance.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Suppress hydration warnings on <html> to tolerate extra attributes injected by browser extensions
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${playfair.variable} ${montserrat.variable} ${greatVibes.variable} ${sacramento.variable} ${parisienne.variable} ${marckScript.variable}`}
      >
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ScrollToTop />
                <Suspense fallback={null}>{children}</Suspense>
                <CartDrawer />
                <WishlistDrawer />
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
