export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="h-[40vh] md:h-[50vh] bg-muted animate-pulse" />
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 w-64 bg-muted rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

