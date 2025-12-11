"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 font-[family-name:var(--font-playfair)]">Something went wrong!</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" asChild>
            <a href="/">Go Home</a>
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  )
}

