"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Minus, Plus, X, ShoppingBag, Truck, Shield } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/contexts/language-provider"
import { useAuth } from "@/contexts/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart()
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  const handleCheckout = () => {
    if (!user || user.role !== "client") {
      router.push("/auth/login?redirect=/checkout")
      return
    }
    router.push("/checkout")
  }

  const formatPrice = (price: number) => `€${price.toFixed(2)}`
  const shipping = 0
  const tax = 0
  const total = getTotalPrice()

  if (state.items.length === 0) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4 font-[family-name:var(--font-playfair)]">{t.cart.empty}</h1>
            <p className="text-muted-foreground mb-8">{t.pages.cartEmpty}</p>
            <Button size="lg" asChild>
              <Link href="/shop">{t.pages.startShopping}</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)]">
            {t.cart.title} ({getTotalItems()} {t.cart.items})
          </h1>
          <Button variant="outline" onClick={clearCart}>
            {t.cart.clearCart}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={`${item.product.id}-${item.size}`}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.product.name}</h3>
                          <p className="text-muted-foreground capitalize">{item.product.category}</p>
                          <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeItem(item.product.id, item.size)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-lg text-primary">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          <p className="text-sm text-muted-foreground">{formatPrice(item.product.price)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.checkout.orderSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal} ({getTotalItems()} {t.cart.items})</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t.cart.shipping}</span>
                  <span>{formatPrice(shipping)}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t.cart.tax}</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>{t.cart.total}</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>

                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleCheckout}
                >
                  {t.cart.proceedToCheckout}
                </Button>
                {(!user || user.role !== "client") && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Please login as a client to proceed with checkout
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Promo Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input placeholder="Enter promo code" />
                  <Button variant="outline">Apply</Button>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Free Shipping</p>
                      <p className="text-xs text-muted-foreground">On orders over €100</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Secure Checkout</p>
                      <p className="text-xs text-muted-foreground">Your data is protected</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
