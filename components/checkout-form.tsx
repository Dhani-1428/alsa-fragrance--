"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/contexts/language-provider"
// import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Smartphone, Building2 } from "lucide-react"

interface BillingFormData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  additionalNotes?: string
}

type PaymentMethod = "mbway" | "iban"

function InnerCheckoutForm({ onClose }: { onClose?: () => void }) {
  const { state, clearCart } = useCart()
  const { toast } = useToast()
  const { t } = useLanguage()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [openPaymentMethod, setOpenPaymentMethod] = useState<PaymentMethod | null>(null)
  const [formData, setFormData] = useState<BillingFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    additionalNotes: "",
  })


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("Form submitted", { paymentMethod, formData, itemsCount: state.items.length })
    
    // Check if cart is empty
    if (!state.items || state.items.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      })
      return
    }
    
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      })
      return
    }

    // Validate billing information
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.postalCode || !formData.country) {
      toast({
        title: "Billing Information Required",
        description: "Please fill in all required billing fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const subtotal = state.items.reduce(
        (total: number, item: typeof state.items[number]) => total + item.product.price * item.quantity,
        0,
      )
      const shipping = 0
      const tax = 0
      const grandTotal = subtotal

      if (paymentMethod === "mbway") {
        // MBWay payment - just confirm payment was sent
        // In production, you would integrate with MBWay API here
        // For now, we'll proceed assuming user will send payment
        toast({
          title: "MBWay Payment Instructions",
          description: "Please send payment to +351 920062535. Your order will be confirmed once payment is received.",
        })
      }

      // 3) Send order emails (for both payment methods)
      console.log("Sending order to API...")
      
      const orderData = {
        billingInfo: formData,
        cartItems: state.items,
        subtotal,
        shipping,
        tax,
        grandTotal,
        paymentMethod: paymentMethod === "mbway" ? "MBWay" : paymentMethod === "iban" ? "IBAN" : "MBWay",
      }
      
      console.log("Order data:", orderData)
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      console.log("API response status:", response.status)

      if (!response.ok) {
        let errorMessage = `Failed to process order: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
          if (errorData.details) {
            console.error("Error details:", errorData.details)
          }
        } catch {
          const errorText = await response.text()
          console.error("API error:", errorText)
          try {
            const errorData = JSON.parse(errorText)
            errorMessage = errorData.error || errorData.message || errorMessage
          } catch {
            // If it's not JSON, use the text as error message
            if (errorText) {
              errorMessage = errorText
            }
          }
        }
        throw new Error(errorMessage)
      }
      
      const responseData = await response.json()
      console.log("API response:", responseData)

      if (responseData.isMBWayPending) {
        toast({
          title: "Order Received - Payment Pending 📱",
          description: `Please send payment of €${grandTotal.toFixed(2)} to +351 920062535 via MBWay. You will receive a confirmation email once payment is verified. Order Number: ${responseData.orderNumber || ""}`,
          duration: 10000,
        })
        // Keep cart for MBWay until payment is confirmed
        setTimeout(() => {
          if (onClose) {
            onClose()
          } else {
            router.push("/cart")
          }
        }, 5000)
      } else {
      toast({
          title: "Order Placed! 🎉",
          description: "Your order has been placed. Check your email for confirmation.",
      })
      clearCart()
        if (onClose) {
      onClose()
        } else {
          router.push("/cart")
        }
      }
    } catch (error: any) {
      console.error("Checkout error:", error)
      
      let errorMessage = "There was an error processing your order. Please try again."
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message
        } else {
          errorMessage = JSON.stringify(error)
        }
      }
      
      toast({
        title: "Order Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const subtotal = state.items.reduce(
    (total: number, item: typeof state.items[number]) => total + item.product.price * item.quantity,
    0,
  )
  const shipping = 0
  const tax = 0
  const grandTotal = subtotal

  // Render as overlay if onClose is provided (modal), otherwise render inline (page)
  const isModal = onClose !== undefined

  return (
    <div className={isModal ? "fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto pt-8" : "container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]"}>
      <Card className={`w-full max-w-2xl ${isModal ? "my-8 mt-12" : ""}`}>
        <CardHeader>
          <CardTitle>{t.checkout.title}</CardTitle>
          <CardDescription>{t.pages.selectPaymentMethod}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Payment Method Selection - First */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t.checkout.paymentMethod}</h3>
              
              {/* MBWay Option */}
              <Collapsible
                open={openPaymentMethod === "mbway"}
                onOpenChange={(open) => {
                  if (open) {
                    // Close IBAN if open
                    if (openPaymentMethod === "iban") {
                      setOpenPaymentMethod("mbway")
                      setPaymentMethod("mbway")
                    } else {
                      setOpenPaymentMethod("mbway")
                      // Don't set payment method yet - wait for confirmation
                    }
                  } else {
                    setOpenPaymentMethod(null)
                    // Only clear payment method if it was MBWay
                    if (paymentMethod === "mbway") {
                      setPaymentMethod(null)
                    }
                  }
                }}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant={paymentMethod === "mbway" ? "default" : "outline"}
                    className={`w-full justify-between h-auto py-4 px-6 transition-all cursor-pointer ${
                      paymentMethod === "mbway" 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (openPaymentMethod === "mbway") {
                        setOpenPaymentMethod(null)
                        if (paymentMethod === "mbway") {
                          setPaymentMethod(null)
                        }
                  } else {
                    // Close IBAN if open
                    if (openPaymentMethod === "iban") {
                      setOpenPaymentMethod("mbway")
                      setPaymentMethod(null) // Clear IBAN selection
                    } else {
                      setOpenPaymentMethod("mbway")
                    }
                  }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className={`h-5 w-5 ${paymentMethod === "mbway" ? "text-primary-foreground" : ""}`} />
                      <span className="font-semibold text-base">{t.checkout.mbway}</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${openPaymentMethod === "mbway" ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-6 rounded-xl border-2 bg-gradient-to-br from-black/95 to-gray-900/95 text-yellow-400 shadow-lg">
                    <h4 className="font-bold text-lg mb-3 text-yellow-400">{t.pages.mbwayInstructions}</h4>
                    <p className="text-sm mb-4 text-yellow-300 leading-relaxed">{t.pages.mbwayDescription}</p>
                    <div className="bg-gray-900/80 p-5 rounded-lg border-2 border-yellow-400/40 mb-5 backdrop-blur-sm">
                      <p className="text-2xl font-mono font-bold text-yellow-400 text-center tracking-wider">{t.pages.mbwayNumber}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-yellow-400/20 mb-4">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setOpenPaymentMethod(null)
                            setPaymentMethod(null)
                          }}
                          className="bg-transparent border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 h-9 px-4"
                        >
                          {t.common.cancel}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setPaymentMethod("mbway")
                            setOpenPaymentMethod("mbway")
                            toast({
                              title: "Payment Method Selected",
                              description: "MBWay payment method confirmed. You can now proceed to place your order.",
                            })
                          }}
                          className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold h-9 px-4"
                        >
                          {t.pages.confirmPaymentMethod}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-yellow-300/80 leading-relaxed">
                      {t.pages.mbwayPaymentNote}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* IBAN Transfer Option */}
              <Collapsible
                open={openPaymentMethod === "iban"}
                onOpenChange={(open) => {
                  if (open) {
                    // Close MBWay if open
                    if (openPaymentMethod === "mbway") {
                      setOpenPaymentMethod("iban")
                      setPaymentMethod("iban")
                    } else {
                      setOpenPaymentMethod("iban")
                      // Don't set payment method yet - wait for confirmation
                    }
                  } else {
                    setOpenPaymentMethod(null)
                    // Only clear payment method if it was IBAN
                    if (paymentMethod === "iban") {
                      setPaymentMethod(null)
                    }
                  }
                }}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant={paymentMethod === "iban" ? "default" : "outline"}
                    className={`w-full justify-between h-auto py-4 px-6 transition-all cursor-pointer ${
                      paymentMethod === "iban" 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (openPaymentMethod === "iban") {
                        setOpenPaymentMethod(null)
                        if (paymentMethod === "iban") {
                          setPaymentMethod(null)
                        }
                      } else {
                        // Close MBWay if open
                        if (openPaymentMethod === "mbway") {
                          setOpenPaymentMethod("iban")
                          setPaymentMethod(null) // Clear MBWay selection
                        } else {
                          setOpenPaymentMethod("iban")
                        }
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className={`h-5 w-5 ${paymentMethod === "iban" ? "text-primary-foreground" : ""}`} />
                      <span className="font-semibold text-base">{t.checkout.ibanTransfer || "IBAN Transfer"}</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${openPaymentMethod === "iban" ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-6 rounded-xl border-2 bg-gradient-to-br from-blue-50/95 to-indigo-50/95 dark:from-blue-950/95 dark:to-indigo-950/95 text-foreground shadow-lg">
                    <h4 className="font-bold text-lg mb-3">{t.pages.ibanInstructions}</h4>
                    <p className="text-sm mb-4 leading-relaxed">{t.pages.ibanDescription}</p>
                    <div className="bg-background p-5 rounded-lg border-2 mb-5 backdrop-blur-sm">
                      <p className="text-xl font-mono font-bold text-center tracking-wider">PT50002300004559842600394</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t mb-4">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setOpenPaymentMethod(null)
                            setPaymentMethod(null)
                          }}
                          className="h-9 px-4"
                        >
                          {t.common.cancel}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setPaymentMethod("iban")
                            setOpenPaymentMethod("iban")
                            toast({
                              title: "Payment Method Selected",
                              description: "IBAN transfer method confirmed. You can now proceed to place your order.",
                            })
                          }}
                          className="h-9 px-4"
                        >
                          {t.pages.confirmPaymentMethod}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t.pages.ibanPaymentNote}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Order Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">{t.checkout.orderSummary}</h3>
              {state.items.map((item: typeof state.items[number], index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.product.name} ({item.size}) x {item.quantity}
                  </span>
                  <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}:</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.cart.shipping}:</span>
                  <span>€{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.cart.tax}:</span>
                  <span>€{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1">
                  <span>{t.cart.total}:</span>
                  <span>€{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t.checkout.billingInfo}</h3>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t.checkout.fullName} *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.checkout.email} *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t.checkout.phone} *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t.checkout.address} *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="123 Main Street, Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t.checkout.city} *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="New York"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">{t.checkout.postalCode} *</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      placeholder="10001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">{t.checkout.country} *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      placeholder="USA"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">{t.checkout.additionalNotes} (Optional)</Label>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Any special delivery instructions..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (onClose) {
                    onClose()
                  } else {
                    router.push("/cart")
                  }
                }} 
                disabled={isSubmitting}
              >
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2 animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full align-[-0.125em]" />
                    {t.checkout.processing}
                  </>
                ) : (
                  t.checkout.placeOrder
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function CheckoutForm({ onClose }: { onClose?: () => void }) {
  return <InnerCheckoutForm onClose={onClose} />
}
