import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 font-[family-name:var(--font-playfair)]">Product Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/shop">Browse All Products</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
