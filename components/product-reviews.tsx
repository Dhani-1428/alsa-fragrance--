"use client"

import { Star, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/contexts/language-provider"

interface Review {
  id: number
  author: string
  rating: number
  date: string
  title: string
  content: string
  helpful: number
  verified: boolean
}

interface ProductReviewsProps {
  rating: number
  totalReviews: number
  reviews: Review[]
}

const mockReviews: Review[] = [
  {
    id: 1,
    author: "Sarah M.",
    rating: 5,
    date: "2024-01-15",
    title: "Absolutely stunning fragrance!",
    content:
      "This perfume exceeded my expectations. The scent is sophisticated and long-lasting. I get compliments every time I wear it.",
    helpful: 12,
    verified: true,
  },
  {
    id: 2,
    author: "Michael R.",
    rating: 4,
    date: "2024-01-10",
    title: "Great quality, worth the price",
    content: "Beautiful packaging and the fragrance is exactly as described. Lasts all day without being overpowering.",
    helpful: 8,
    verified: true,
  },
  {
    id: 3,
    author: "Emma L.",
    rating: 5,
    date: "2024-01-05",
    title: "My new signature scent",
    content:
      "I've been searching for the perfect fragrance for months, and this is it! Elegant, unique, and perfect for both day and evening wear.",
    helpful: 15,
    verified: true,
  },
]

export function ProductReviews({ rating, totalReviews }: ProductReviewsProps) {
  const { t } = useLanguage()
  const ratingDistribution = [
    { stars: 5, count: 45, percentage: 75 },
    { stars: 4, count: 12, percentage: 20 },
    { stars: 3, count: 2, percentage: 3 },
    { stars: 2, count: 1, percentage: 2 },
    { stars: 1, count: 0, percentage: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t.pages.customerReviews}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{rating}</div>
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-primary text-primary" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">
                {t.pages.basedOnReviews.replace(/\{count\}/g, totalReviews.toString())}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{item.stars}★</span>
                  <Progress value={item.percentage} className="flex-1" />
                  <span className="w-8 text-muted-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{review.author}</span>
                    {review.verified && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{t.pages.verifiedPurchase}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? "fill-primary text-primary" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                </div>
              </div>

              <h4 className="font-medium mb-2">{review.title}</h4>
              <p className="text-muted-foreground mb-3">{review.content}</p>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  {t.pages.helpful} ({review.helpful})
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline">{t.pages.loadMoreReviews}</Button>
      </div>
    </div>
  )
}
