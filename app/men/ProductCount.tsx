"use client"

import { useState, useEffect } from "react"
import { getProductsByCategory } from "@/lib/products-api"

export function ProductCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    async function fetchCount() {
      try {
        const products = await getProductsByCategory("men")
        setCount(products.length)
      } catch (error) {
        console.error("Error fetching product count:", error)
        setCount(0)
      }
    }
    fetchCount()
  }, [])

  if (count === null) {
    return <span className="text-sm text-primary font-medium">Loading...</span>
  }

  return (
    <p className="text-sm text-primary font-medium">
      {count} Products Available
    </p>
  )
}
