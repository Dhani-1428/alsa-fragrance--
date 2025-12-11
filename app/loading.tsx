import { Navigation } from "@/components/navigation"

export default function Loading() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    </main>
  )
}

