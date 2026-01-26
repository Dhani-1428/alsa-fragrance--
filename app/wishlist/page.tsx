"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Heart, ShoppingCart } from "lucide-react"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/contexts/auth-provider"
import { useLanguage } from "@/contexts/language-provider"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { AddToCartAlert } from "@/components/add-to-cart-alert"

export default function WishlistPage() {
  const [showAlert, setShowAlert] = useState(false)
  const { state, removeItem, clearWishlist, getTotalItems } = useWishlist()
  const { addItem } = useCart()
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const formatPrice = (price: number) => `€${price.toFixed(2)}`

  const handleAddToCart = (product: any) => {
    // Check if user is authenticated
    if (!user) {
      toast.error(t.common.loginRequired || "Please login to add items to cart")
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    // Use first available size or empty string
    const size = product.size && product.size.length > 0 ? product.size[0] : ""
    addItem(product, size, 1)
    setShowAlert(true)
    // Don't redirect to cart automatically, just show the alert
  }

  if (state.items.length === 0) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4 font-[family-name:var(--font-playfair)]">{t.wishlist.empty}</h1>
            <p className="text-muted-foreground mb-8">{t.wishlist.emptyDescription}</p>
            <Button size="lg" asChild>
              <Link href="/shop">{t.pages.startShopping}</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <AddToCartAlert open={showAlert} onClose={() => setShowAlert(false)} />
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8 px-2">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)]">
            {t.wishlist.title} ({getTotalItems()} {getTotalItems() === 1 ? t.wishlist.item : t.wishlist.items})
          </h1>
          <Button variant="outline" onClick={clearWishlist}>
            {t.wishlist.clearWishlist}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {state.items.map((product) => {
            const productId = typeof product.id === 'string' ? product.id : String(product.id)
            return (
              <Card key={productId} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0 overflow-hidden">
                  <div className="relative">
                    <Link href={`/product/${productId}`}>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                      />
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-500 hover:text-red-600"
                      onClick={() => removeItem(product.id)}
                      title={t.wishlist.removeFromWishlist}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4 sm:p-5">
                    <Link href={`/product/${productId}`}>
                      <h3 className="font-semibold text-base sm:text-lg mb-1 hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-xs sm:text-sm capitalize mb-2">{product.category}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-base sm:text-lg text-primary">{formatPrice(product.price)}</p>
                    </div>

                    <Button
                      className="w-full text-sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {t.common.addToCart}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Footer />
    </main>
  )
}
