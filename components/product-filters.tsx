"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface FilterState {
  categories: string[]
  priceRange: [number, number]
  inStock: boolean
  onSale: boolean
  isNew: boolean
}

interface ProductFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
}

export function ProductFilters({ filters, onFiltersChange, onClearFilters }: ProductFiltersProps) {
  const categories = [
    { id: "women", label: "Women" },
    { id: "men", label: "Men" },
    { id: "attars", label: "Attars" },
    { id: "testers", label: "Testers" },
  ]

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((c) => c !== categoryId)

    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handlePriceChange = (value: [number, number]) => {
    onFiltersChange({ ...filters, priceRange: value })
  }

  const activeFiltersCount =
    filters.categories.length +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.isNew ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 200 ? 1 : 0)

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                />
                <Label htmlFor={category.id} className="text-sm">
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              max={200}
              min={0}
              step={5}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>€{filters.priceRange[0]}</span>
              <span>€{filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Availability & Status */}
        <div>
          <h3 className="font-medium mb-3">Availability</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={filters.inStock}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, inStock: checked as boolean })}
              />
              <Label htmlFor="inStock" className="text-sm">
                In Stock
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="onSale"
                checked={filters.onSale}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, onSale: checked as boolean })}
              />
              <Label htmlFor="onSale" className="text-sm">
                On Sale
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNew"
                checked={filters.isNew}
                onCheckedChange={(checked) => onFiltersChange({ ...filters, isNew: checked as boolean })}
              />
              <Label htmlFor="isNew" className="text-sm">
                New Arrivals
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
