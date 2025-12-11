"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CheckoutForm } from "@/components/checkout-form"
import { useAuth } from "@/contexts/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !loading && !user) {
      router.push("/auth/login?redirect=/checkout")
    }
  }, [isMounted, user, loading, router])

  // Prevent hydration mismatch by showing consistent initial render
  if (!isMounted || loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <p>Loading...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Login Required</CardTitle>
              <CardDescription>Please login to proceed with checkout</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/auth/login?redirect=/checkout")} className="w-full">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Render the actual checkout form overlay */}
      <CheckoutForm />

      <Footer />
    </main>
  )
}
