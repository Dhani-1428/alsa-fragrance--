"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/contexts/language-provider"
import Link from "next/link"

export function CartDrawer() {
  const { state, removeItem, updateQuantity, closeCart, getTotalItems, getTotalPrice } = useCart()
  const { t } = useLanguage()

  const formatPrice = (price: number) => `€${price.toFixed(2)}`

  if (state.items.length === 0) {
    return (
      <Sheet open={state.isOpen} onOpenChange={closeCart}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              {t.cart.title}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t.cart.empty}</h3>
            <p className="text-muted-foreground mb-6">{t.pages.cartEmpty}</p>
            <Button asChild onClick={closeCart}>
              <Link href="/shop">{t.pages.startShopping}</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={state.isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              {t.cart.title}
            </div>
            <Badge variant="secondary">{getTotalItems()} {t.cart.items}</Badge>
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex gap-4 p-4 border rounded-lg">
                <img
                  src={item.product.image || "/premium-perfume-bottle-cart-item.jpg"}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                  <p className="text-xs text-muted-foreground capitalize">{item.product.category}</p>
                  <p className="text-xs text-muted-foreground">{t.product.size}: {item.size}</p>
                  <p className="font-medium text-sm text-primary mt-1">{formatPrice(item.product.price)}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeItem(item.product.id, item.size)}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 bg-transparent"
                      onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 bg-transparent"
                      onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Footer */}
        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t.cart.subtotal}:</span>
            <span className="font-bold text-lg text-primary">{formatPrice(getTotalPrice())}</span>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout" onClick={closeCart}>
                {t.cart.proceedToCheckout}
              </Link>
            </Button>
            <Button variant="outline" className="w-full bg-transparent" asChild onClick={closeCart}>
              <Link href="/cart">{t.cart.title}</Link>
            </Button>
          </div>

          <Button variant="ghost" className="w-full" asChild onClick={closeCart}>
            <Link href="/shop">{t.pages.startShopping}</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
