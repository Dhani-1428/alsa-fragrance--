"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { X, Heart } from "lucide-react"
import { useWishlist } from "@/lib/wishlist-context"
import { useLanguage } from "@/contexts/language-provider"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import Image from "next/image"

export function WishlistDrawer() {
  const { state, removeItem, closeWishlist, getTotalItems } = useWishlist()
  const { addItem, openCart } = useCart()
  const { t } = useLanguage()

  const formatPrice = (price: number) => `€${price.toFixed(2)}`

  const handleAddToCart = (product: any) => {
    // Use first available size or empty string
    const size = product.size && product.size.length > 0 ? product.size[0] : ""
    addItem(product, size, 1)
    openCart()
  }

  if (state.items.length === 0) {
    return (
      <Sheet open={state.isOpen} onOpenChange={closeWishlist}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Wishlist
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">Start adding your favorite products to your wishlist</p>
            <Button asChild onClick={closeWishlist}>
              <Link href="/shop">{t.pages.startShopping}</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={state.isOpen} onOpenChange={closeWishlist}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Wishlist
            </div>
            <Badge variant="secondary">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}</Badge>
          </SheetTitle>
        </SheetHeader>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4">
            {state.items.map((product) => {
              const productId = typeof product.id === 'string' ? product.id : String(product.id)
              return (
                <div key={productId} className="flex gap-4 p-4 border rounded-lg group hover:shadow-md transition-shadow">
                  <Link href={`/product/${productId}`} onClick={closeWishlist} className="flex-shrink-0">
                    <img
                      src={product.image || "/premium-perfume-bottle-cart-item.jpg"}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${productId}`} onClick={closeWishlist}>
                      <h4 className="font-medium text-sm truncate hover:text-primary transition-colors">{product.name}</h4>
                    </Link>
                    <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                    <p className="font-medium text-sm text-primary mt-1">{formatPrice(product.price)}</p>
                    
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleAddToCart(product)}
                      >
                        {t.common.addToCart}
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => removeItem(product.id)}
                    title="Remove from wishlist"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Wishlist Footer */}
        <div className="border-t pt-4 space-y-2">
          <Button variant="outline" className="w-full bg-transparent" asChild onClick={closeWishlist}>
            <Link href="/shop">{t.pages.startShopping}</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
