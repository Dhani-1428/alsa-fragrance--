"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, LogOut } from "lucide-react"
import { getAuthToken, removeAuthToken } from "@/lib/auth"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  salePrice?: number
  salePercent?: number
  rating: number
  reviews: number
  image: string
  images?: string[]
  description: string
  notes: {
    top: string[]
    middle: string[]
    base: string[]
  }
  size: string[]
  inStock: boolean
  isNew?: boolean
  isSale?: boolean
  badge?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "women",
    price: "",
    originalPrice: "",
    salePrice: "",
    salePercent: "",
    rating: "",
    reviews: "",
    image: "",
    images: "",
    description: "",
    notesTop: "",
    notesMiddle: "",
    notesBase: "",
    size: "",
    inStock: true,
    isNew: false,
    isSale: false,
    badge: "",
  })
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string>("")
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([])
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!getAuthToken()) {
      router.push("/admin/login")
      return
    }
    fetchProducts()
  }, [router])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to upload image')
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    try {
      let mainImageUrl = formData.image
      let additionalImageUrls: string[] = []

      // Upload main image if a new file is selected
      if (mainImageFile) {
        mainImageUrl = await uploadImage(mainImageFile)
      } else if (!editingProduct && !mainImageUrl) {
        throw new Error("Main image is required")
      }

      // Upload additional images if new files are selected
      if (additionalImageFiles.length > 0) {
        const uploadPromises = additionalImageFiles.map(file => uploadImage(file))
        additionalImageUrls = await Promise.all(uploadPromises)
      } else if (formData.images) {
        // Use existing URLs if no new files
        additionalImageUrls = formData.images.split(",").map((img) => img.trim()).filter(Boolean)
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        salePercent: formData.salePercent ? parseFloat(formData.salePercent) : null,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        reviews: formData.reviews ? parseInt(formData.reviews) : 0,
        image: mainImageUrl,
        images: additionalImageUrls,
        description: formData.description,
        notes: {
          top: formData.notesTop ? formData.notesTop.split(",").map((n) => n.trim()) : [],
          middle: formData.notesMiddle ? formData.notesMiddle.split(",").map((n) => n.trim()) : [],
          base: formData.notesBase ? formData.notesBase.split(",").map((n) => n.trim()) : [],
        },
        size: formData.size ? formData.size.split(",").map((s) => s.trim()) : [],
        inStock: formData.inStock,
        isNew: formData.isNew,
        isSale: formData.isSale,
        badge: formData.badge || null,
      }

      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error("Failed to save product")
      }

      toast.success(editingProduct ? "Product updated!" : "Product created!")
      setIsDialogOpen(false)
      resetForm()
      fetchProducts()
    } catch (error: any) {
      toast.error(error.message || "Failed to save product")
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      salePrice: product.salePrice?.toString() || "",
      salePercent: product.salePercent?.toString() || "",
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      image: product.image,
      images: product.images?.join(", ") || "",
      description: product.description,
      notesTop: product.notes.top.join(", "),
      notesMiddle: product.notes.middle.join(", "),
      notesBase: product.notes.base.join(", "),
      size: product.size.join(", "),
      inStock: product.inStock,
      isNew: product.isNew || false,
      isSale: product.isSale || false,
      badge: product.badge || "",
    })
    // Set previews for existing images
    setMainImagePreview(product.image)
    setMainImageFile(null)
    setAdditionalImagePreviews(product.images || [])
    setAdditionalImageFiles([])
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product")
      }

      toast.success("Product deleted successfully!")
      // Refresh the product list
      await fetchProducts()
    } catch (error: any) {
      console.error("Delete error:", error)
      toast.error(error.message || "Failed to delete product. Please try again.")
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      category: "women",
      price: "",
      originalPrice: "",
      salePrice: "",
      salePercent: "",
      rating: "",
      reviews: "",
      image: "",
      images: "",
      description: "",
      notesTop: "",
      notesMiddle: "",
      notesBase: "",
      size: "",
      inStock: true,
      isNew: false,
      isSale: false,
      badge: "",
    })
    setMainImageFile(null)
    setMainImagePreview("")
    setAdditionalImageFiles([])
    setAdditionalImagePreviews([])
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setAdditionalImageFiles(files)
      const previews: string[] = []
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          previews.push(reader.result as string)
          if (previews.length === files.length) {
            setAdditionalImagePreviews(previews)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleLogout = () => {
    removeAuthToken()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-white text-black hover:bg-gray-200">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {editingProduct ? "Update product details" : "Create a new product"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 text-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Name</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="women" className="text-white">Women</SelectItem>
                          <SelectItem value="men" className="text-white">Men</SelectItem>
                          <SelectItem value="attars" className="text-white">Attars</SelectItem>
                          <SelectItem value="testers" className="text-white">Testers</SelectItem>
                          <SelectItem value="accessories" className="text-white">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Price</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Original Price</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        type="number"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Sale Price</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        type="number"
                        step="0.01"
                        value={formData.salePrice}
                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Sale Percent (%)</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        type="number"
                        step="0.01"
                        value={formData.salePercent}
                        onChange={(e) => setFormData({ ...formData, salePercent: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Rating</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Reviews</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        type="number"
                        value={formData.reviews}
                        onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Main Image {!editingProduct && <span className="text-red-400">*</span>}</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="bg-gray-800 border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200"
                      required={!editingProduct}
                    />
                    {(mainImagePreview || formData.image) && (
                      <div className="mt-2">
                        <img
                          src={mainImagePreview || formData.image}
                          alt="Main product preview"
                          className="w-32 h-32 object-cover rounded border border-gray-600"
                        />
                      </div>
                    )}
                    {!mainImageFile && formData.image && (
                      <p className="text-xs text-gray-400 mt-1">Current: {formData.image}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Additional Images</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      className="bg-gray-800 border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200"
                    />
                    {(additionalImagePreviews.length > 0 || (formData.images && formData.images.trim())) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {additionalImagePreviews.map((preview, idx) => (
                          <img
                            key={idx}
                            src={preview}
                            alt={`Additional ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded border border-gray-600"
                          />
                        ))}
                        {!additionalImageFiles.length && formData.images && formData.images.split(",").map((img, idx) => (
                          img.trim() && (
                            <img
                              key={`existing-${idx}`}
                              src={img.trim()}
                              alt={`Existing ${idx + 1}`}
                              className="w-24 h-24 object-cover rounded border border-gray-600"
                            />
                          )
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Description</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-600 text-white"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Top Notes (comma-separated)</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        value={formData.notesTop}
                        onChange={(e) => setFormData({ ...formData, notesTop: e.target.value })}
                        placeholder="Bergamot, Lemon, Mint"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Middle Notes (comma-separated)</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        value={formData.notesMiddle}
                        onChange={(e) => setFormData({ ...formData, notesMiddle: e.target.value })}
                        placeholder="Rose, Jasmine, Lavender"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Base Notes (comma-separated)</Label>
                      <Input
                        className="bg-gray-800 border-gray-600 text-white"
                        value={formData.notesBase}
                        onChange={(e) => setFormData({ ...formData, notesBase: e.target.value })}
                        placeholder="Vanilla, Musk, Sandalwood"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Sizes (comma-separated)</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      placeholder="30ml, 50ml, 100ml"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Badge</Label>
                    <Input
                      className="bg-gray-800 border-gray-600 text-white"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="Sale, New, Limited Edition"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.inStock}
                        onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                      />
                      <Label className="text-white">In Stock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isNew}
                        onCheckedChange={(checked) => setFormData({ ...formData, isNew: checked })}
                      />
                      <Label className="text-white">New Arrival</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isSale}
                        onCheckedChange={(checked) => setFormData({ ...formData, isSale: checked })}
                      />
                      <Label className="text-white">On Sale</Label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-white hover:bg-gray-700" disabled={uploading}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-white text-black hover:bg-gray-200" disabled={uploading}>
                      {uploading ? "Uploading..." : editingProduct ? "Update Product" : "Create Product"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleLogout} className="border-gray-600 text-white hover:bg-gray-700">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Products ({products.length})</CardTitle>
            <CardDescription className="text-gray-400">Manage your product catalog</CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No products found. Click "Add Product" to create your first product.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-800">
                      <TableHead className="text-white">ID</TableHead>
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white">Category</TableHead>
                      <TableHead className="text-white">Price</TableHead>
                      <TableHead className="text-white">Sale</TableHead>
                      <TableHead className="text-white">Stock</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="border-gray-700 hover:bg-gray-800">
                        <TableCell className="text-white">{product.id}</TableCell>
                        <TableCell className="font-medium text-white">{product.name}</TableCell>
                        <TableCell className="text-gray-300 capitalize">{product.category}</TableCell>
                        <TableCell className="text-white">
                          {product.isSale && product.salePrice ? (
                            <span>
                              <span className="line-through text-gray-500">${product.originalPrice}</span>{" "}
                              <span className="text-red-400 font-bold">${product.salePrice}</span>
                            </span>
                          ) : (
                            `$${product.price}`
                          )}
                        </TableCell>
                        <TableCell className="text-white">
                          {product.isSale ? (
                            <span className="text-green-400">Yes</span>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </TableCell>
                        <TableCell className="text-white">
                          {product.inStock ? (
                            <span className="text-green-400">In Stock</span>
                          ) : (
                            <span className="text-red-400">Out of Stock</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="border-gray-600 text-white hover:bg-gray-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              className="border-red-600 text-red-400 hover:bg-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

