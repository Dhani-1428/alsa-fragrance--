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
import { Plus, Edit, Trash2, LogOut, Package, CheckCircle, Clock, Filter } from "lucide-react"
import { getAuthToken, removeAuthToken } from "@/lib/auth"
import { toast } from "sonner"

interface Product {
  id: string
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

interface Order {
  id: string
  orderNumber: string
  billingInfo: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  cartItems: Array<{
    product: {
      id: number
      name: string
      price: number
      image?: string
    }
    size: string
    quantity: number
  }>
  subtotal: number
  shipping: number
  tax: number
  grandTotal: number
  paymentMethod: "Card" | "MBWay"
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
  confirmedAt?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "confirmed" | "mbway">("all")
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
    fetchOrders()
  }, [router])

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const response = await fetch("/api/orders")
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      const data = await response.json()
      setOrders(data)
    } catch (error: any) {
      console.error("Error fetching orders:", error)
      toast.error(error.message || "Failed to fetch orders")
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleConfirmPayment = async (orderId: string, paymentMethod: string) => {
    if (!window.confirm(`Are you sure you want to confirm this ${paymentMethod} payment? This will mark the order as confirmed and send a confirmation email to the customer.`)) {
      return
    }

    try {
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to confirm payment")
      }

      toast.success(`${paymentMethod} payment confirmed! Order is now confirmed.`)
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        setIsOrderDialogOpen(false)
        setSelectedOrder(null)
      }
    } catch (error: any) {
      console.error("Error confirming payment:", error)
      toast.error(error.message || "Failed to confirm payment")
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Add cache-busting query parameter to ensure fresh data
      const cacheBuster = Date.now()
      const response = await fetch(`/api/products?t=${cacheBuster}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        const errorMessage = errorData.error || `Failed to fetch products: ${response.status} ${response.statusText}`
        const errorDetails = errorData.details ? ` ${errorData.details}` : ''
        throw new Error(errorMessage + errorDetails)
      }
      const data = await response.json()
      console.log(`✅ Admin: Fetched ${data.length} products from database`)
      setProducts(data)
    } catch (error: any) {
      console.error("Error fetching products:", error)
      toast.error(error.message || "Failed to fetch products", {
        duration: error.message?.includes('whitelist') ? 10000 : 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      // Always try Cloudinary upload first (works in serverless environments)
      const response = await fetch('/api/upload-cloudinary', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        // If Cloudinary is not configured, provide helpful error
        if (data.error?.includes('Cloudinary is not configured')) {
          throw new Error('Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.')
        }
        const errorMessage = data.error || data.details || 'Failed to upload image to Cloudinary'
        console.error('Upload error:', errorMessage, data)
        throw new Error(errorMessage)
      }

      if (!data.url) {
        throw new Error('Upload succeeded but no URL returned')
      }

      // Return Cloudinary URL
      console.log('Image uploaded to Cloudinary:', data.url)
      return data.url
    } catch (error: any) {
      console.error('Upload image error:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    try {
      // Validate required fields
      if (!formData.name || !formData.name.trim()) {
        throw new Error("Product name is required")
      }
      if (!formData.price || isNaN(parseFloat(formData.price))) {
        throw new Error("Valid product price is required")
      }
      if (!formData.description || !formData.description.trim()) {
        throw new Error("Product description is required")
      }

      let mainImageUrl = formData.image
      let additionalImageUrls: string[] = []

      // Upload main image to Cloudinary if a new file is selected
      if (mainImageFile) {
        try {
          // Upload to Cloudinary first
          mainImageUrl = await uploadImage(mainImageFile)
          // Update the form data with the Cloudinary URL
          setFormData({ ...formData, image: mainImageUrl })
          toast.success("Image uploaded to Cloudinary successfully!")
        } catch (uploadError: any) {
          // If upload fails, use the URL from the text input if provided
          if (formData.image && formData.image.trim()) {
            mainImageUrl = formData.image.trim()
            console.warn('Cloudinary upload failed, using provided URL:', mainImageUrl)
            toast.warning("Cloudinary upload failed, using provided URL")
          } else {
            throw new Error(uploadError.message || "Failed to upload image to Cloudinary. Please configure Cloudinary or provide an image URL.")
          }
        }
      } else if (formData.image && formData.image.trim()) {
        // Use URL from text input if no file selected
        mainImageUrl = formData.image.trim()
      } else if (!editingProduct && !mainImageUrl) {
        throw new Error("Main image is required. Please upload an image or provide an image URL.")
      }

      // Upload additional images to Cloudinary if new files are selected
      if (additionalImageFiles.length > 0) {
        try {
          // Upload all additional images to Cloudinary
          const uploadPromises = additionalImageFiles.map(file => uploadImage(file))
          additionalImageUrls = await Promise.all(uploadPromises)
          // Update the form data with Cloudinary URLs
          setFormData({ ...formData, images: additionalImageUrls.join(', ') })
          toast.success(`${additionalImageUrls.length} additional image(s) uploaded to Cloudinary successfully!`)
        } catch (uploadError: any) {
          // If upload fails, use URLs from text input if provided
          if (formData.images && formData.images.trim()) {
            additionalImageUrls = formData.images.split(",").map((img) => img.trim()).filter(Boolean)
            console.warn('Cloudinary upload failed, using provided URLs:', additionalImageUrls)
            toast.warning("Cloudinary upload failed, using provided URLs")
          } else {
            console.warn('Additional image upload failed, but continuing without them')
            additionalImageUrls = []
          }
        }
      } else if (formData.images && formData.images.trim()) {
        // Use existing URLs if no new files
        additionalImageUrls = formData.images.split(",").map((img) => img.trim()).filter(Boolean)
      }

      // Always include all fields when updating so they can be properly saved
      const productData: any = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        description: formData.description.trim(),
        image: mainImageUrl || "",
        images: additionalImageUrls || [],
        rating: formData.rating && formData.rating.trim() ? parseFloat(formData.rating) : 0,
        reviews: formData.reviews && formData.reviews.trim() ? parseInt(formData.reviews, 10) : 0,
        inStock: Boolean(formData.inStock),
        isNew: Boolean(formData.isNew),
        isSale: Boolean(formData.isSale),
      }
      
      // Include optional fields - explicitly set to null if empty to allow clearing
      productData.originalPrice = formData.originalPrice && formData.originalPrice.trim() ? parseFloat(formData.originalPrice) : null
      productData.salePrice = formData.salePrice && formData.salePrice.trim() ? parseFloat(formData.salePrice) : null
      productData.salePercent = formData.salePercent && formData.salePercent.trim() ? parseFloat(formData.salePercent) : null
      productData.badge = formData.badge && formData.badge.trim() ? formData.badge.trim() : null
      
      // Always include notes and size, even if empty arrays
      productData.notes = {
        top: formData.notesTop && formData.notesTop.trim() ? formData.notesTop.split(",").map((n) => n.trim()).filter(Boolean) : [],
        middle: formData.notesMiddle && formData.notesMiddle.trim() ? formData.notesMiddle.split(",").map((n) => n.trim()).filter(Boolean) : [],
        base: formData.notesBase && formData.notesBase.trim() ? formData.notesBase.split(",").map((n) => n.trim()).filter(Boolean) : [],
      }
      productData.size = formData.size && formData.size.trim() ? formData.size.split(",").map((s) => s.trim()).filter(Boolean) : []

      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      console.log(`📤 Sending ${method} request to: ${url}`)
      console.log(`📤 Product data:`, JSON.stringify(productData, null, 2))

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      console.log(`📥 Response status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('❌ Error response:', errorData)
        throw new Error(errorData.error || `Failed to save product: ${response.status} ${response.statusText}`)
      }

      const responseData = await response.json()
      console.log(`✅ Product ${editingProduct ? 'updated' : 'created'} successfully:`, responseData)

      // Clear editing state and reset form first
      const wasEditing = editingProduct !== null
      setEditingProduct(null)
      setIsDialogOpen(false)
      resetForm()
      
      // Force refresh products to get updated data from database
      setLoading(true)
      await fetchProducts()
      
      // Show success message after refresh
      toast.success(wasEditing ? "Product updated successfully in database, website, and admin panel!" : "Product created successfully!")
    } catch (error: any) {
      const errorMessage = error.message || "Failed to save product"
      const errorDetails = error.details ? ` ${error.details}` : ''
      toast.error(errorMessage + errorDetails, {
        duration: error.details ? 10000 : 5000, // Show longer if there are details
      })
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

  const handleDelete = async (id: string) => {
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

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImageFile(file)
      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      // Upload to Cloudinary immediately and update the form field
      try {
        const cloudinaryUrl = await uploadImage(file)
        setFormData({ ...formData, image: cloudinaryUrl })
        setMainImagePreview(cloudinaryUrl)
        toast.success("Image uploaded to Cloudinary!")
      } catch (error: any) {
        console.error('Auto-upload failed:', error)
        toast.error(error.message || "Failed to upload. You can still provide a URL manually.")
        // Keep the local preview, user can still submit with manual URL
      }
    }
  }

  const handleAdditionalImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setAdditionalImageFiles(files)
      // Show previews immediately
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
      
      // Upload to Cloudinary immediately and update the form field
      try {
        const uploadPromises = files.map(file => uploadImage(file))
        const cloudinaryUrls = await Promise.all(uploadPromises)
        setFormData({ ...formData, images: cloudinaryUrls.join(', ') })
        setAdditionalImagePreviews(cloudinaryUrls)
        toast.success(`${cloudinaryUrls.length} image(s) uploaded to Cloudinary!`)
      } catch (error: any) {
        console.error('Auto-upload failed:', error)
        toast.error(error.message || "Failed to upload. You can still provide URLs manually.")
        // Keep the local previews, user can still submit with manual URLs
      }
    }
  }

  const handleLogout = () => {
    removeAuthToken()
    toast.success("Logged out successfully")
    // Redirect to home page instead of admin login
    router.push("/")
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
            <div className="flex gap-2 border border-gray-700 rounded-md p-1">
              <Button
                variant={activeTab === "products" ? "default" : "ghost"}
                onClick={() => setActiveTab("products")}
                className={activeTab === "products" ? "bg-white text-black hover:bg-gray-200" : "text-white hover:bg-gray-800"}
              >
                <Package className="mr-2 h-4 w-4" />
                Products
              </Button>
              <Button
                variant={activeTab === "orders" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("orders")
                  fetchOrders()
                }}
                className={activeTab === "orders" ? "bg-white text-black hover:bg-gray-200" : "text-white hover:bg-gray-800"}
              >
                <Package className="mr-2 h-4 w-4" />
                Orders
                {orders.filter(o => o.status === "pending").length > 0 && (
                  <span className="ml-2 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full">
                    {orders.filter(o => o.status === "pending").length}
                  </span>
                )}
              </Button>
            </div>
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
                    <div className="space-y-2">
                      <div className="text-xs text-green-400 bg-green-900/20 border border-green-500/50 p-2 rounded space-y-1">
                        <p><strong>📸 Upload Image:</strong></p>
                        <p>• Click "Choose File" below to upload directly</p>
                        <p>• Images will be uploaded to Cloudinary (if configured) or saved locally</p>
                        <p className="text-yellow-400 mt-1">💡 Tip: You can also paste an image URL in the text field below</p>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="bg-gray-800 border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200"
                      />
                      <div className="text-xs text-gray-400 mt-2">
                        Or enter image URL/path manually:
                      </div>
                      <Input
                        type="text"
                        placeholder="Enter image path (e.g., /products/alsa-for-men.jpg) or external URL"
                        value={formData.image}
                        onChange={(e) => {
                          setFormData({ ...formData, image: e.target.value })
                          setMainImagePreview(e.target.value)
                        }}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    {(mainImagePreview || formData.image) && (
                      <div className="mt-2">
                        <img
                          src={mainImagePreview || formData.image}
                          alt="Main product preview"
                          className="w-32 h-32 object-cover rounded border border-gray-600"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg'
                          }}
                        />
                      </div>
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
                    <div className="text-xs text-gray-400 mt-2">
                      Or enter image URLs/paths separated by commas:
                    </div>
                    <Input
                      type="text"
                      placeholder="Enter image paths separated by commas (e.g., /products/img1.jpg, /products/img2.jpg)"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
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

        {activeTab === "products" ? (
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
                              <span className="line-through text-gray-500">€{product.originalPrice}</span>{" "}
                              <span className="text-red-400 font-bold">€{product.salePrice}</span>
                            </span>
                          ) : (
                            `€${product.price}`
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
        ) : (
          <div className="space-y-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Orders ({orders.length})</CardTitle>
                    <CardDescription className="text-gray-400">Manage customer orders and verify payments</CardDescription>
                  </div>
                  <Select value={orderFilter} onValueChange={(value: any) => setOrderFilter(value)}>
                    <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="all" className="text-white">All Orders</SelectItem>
                      <SelectItem value="pending" className="text-white">Pending</SelectItem>
                      <SelectItem value="mbway" className="text-white">MBWay Pending</SelectItem>
                      <SelectItem value="card" className="text-white">Card Pending</SelectItem>
                      <SelectItem value="confirmed" className="text-white">Confirmed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No orders found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700 hover:bg-gray-800">
                          <TableHead className="text-white">Order #</TableHead>
                          <TableHead className="text-white">Customer</TableHead>
                          <TableHead className="text-white">Amount</TableHead>
                          <TableHead className="text-white">Payment</TableHead>
                          <TableHead className="text-white">Status</TableHead>
                          <TableHead className="text-white">Date</TableHead>
                          <TableHead className="text-white">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders
                          .filter(order => {
                            if (orderFilter === "all") return true
                            if (orderFilter === "pending") return order.status === "pending"
                            if (orderFilter === "mbway") return order.paymentMethod === "MBWay" && order.status === "pending"
                            if (orderFilter === "card") return order.paymentMethod === "Card" && order.status === "pending"
                            if (orderFilter === "confirmed") return order.status === "confirmed"
                            return true
                          })
                          .map((order) => (
                            <TableRow key={order.id} className="border-gray-700 hover:bg-gray-800">
                              <TableCell className="text-white font-mono">{order.orderNumber}</TableCell>
                              <TableCell className="text-white">
                                <div>
                                  <div className="font-medium">{order.billingInfo.fullName}</div>
                                  <div className="text-sm text-gray-400">{order.billingInfo.email}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-white">€{order.grandTotal.toFixed(2)}</TableCell>
                              <TableCell className="text-white">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  order.paymentMethod === "MBWay" 
                                    ? "bg-yellow-500/20 text-yellow-400" 
                                    : "bg-green-500/20 text-green-400"
                                }`}>
                                  {order.paymentMethod}
                                </span>
                              </TableCell>
                              <TableCell className="text-white">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  order.status === "confirmed" 
                                    ? "bg-green-500/20 text-green-400" 
                                    : order.status === "pending"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}>
                                  {order.status === "confirmed" && <CheckCircle className="inline h-3 w-3 mr-1" />}
                                  {order.status === "pending" && <Clock className="inline h-3 w-3 mr-1" />}
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </TableCell>
                              <TableCell className="text-gray-300 text-sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedOrder(order)
                                      setIsOrderDialogOpen(true)
                                    }}
                                    className="border-gray-600 text-white hover:bg-gray-700"
                                  >
                                    View
                                  </Button>
                                  {order.status === "pending" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleConfirmPayment(order.id, order.paymentMethod)}
                                      className="border-green-600 text-green-400 hover:bg-green-900"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Confirm
                                    </Button>
                                  )}
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
        )}

        {/* Order Details Dialog */}
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white">Order Details - {selectedOrder.orderNumber}</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {selectedOrder.status === "pending" 
                      ? `${selectedOrder.paymentMethod} payment pending verification`
                      : `Order ${selectedOrder.status}`}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-white mb-2">Customer Information</h3>
                      <div className="bg-gray-800 p-4 rounded-lg space-y-1 text-sm">
                        <p className="text-white"><strong>Name:</strong> {selectedOrder.billingInfo.fullName}</p>
                        <p className="text-gray-300"><strong>Email:</strong> {selectedOrder.billingInfo.email}</p>
                        <p className="text-gray-300"><strong>Phone:</strong> {selectedOrder.billingInfo.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">Order Information</h3>
                      <div className="bg-gray-800 p-4 rounded-lg space-y-1 text-sm">
                        <p className="text-white"><strong>Status:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            selectedOrder.status === "confirmed" 
                              ? "bg-green-500/20 text-green-400" 
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {selectedOrder.status}
                          </span>
                        </p>
                        <p className="text-gray-300"><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                        <p className="text-gray-300"><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        {selectedOrder.confirmedAt && (
                          <p className="text-gray-300"><strong>Confirmed:</strong> {new Date(selectedOrder.confirmedAt).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-2">Delivery Address</h3>
                    <div className="bg-gray-800 p-4 rounded-lg text-sm">
                      <p className="text-white">{selectedOrder.billingInfo.address}</p>
                      <p className="text-gray-300">{selectedOrder.billingInfo.city}, {selectedOrder.billingInfo.postalCode}</p>
                      <p className="text-gray-300">{selectedOrder.billingInfo.country}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-2">Order Items</h3>
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-700">
                            <TableHead className="text-white">Product</TableHead>
                            <TableHead className="text-white">Size</TableHead>
                            <TableHead className="text-white">Qty</TableHead>
                            <TableHead className="text-white">Price</TableHead>
                            <TableHead className="text-white">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.cartItems.map((item, idx) => (
                            <TableRow key={idx} className="border-gray-700">
                              <TableCell className="text-white">{item.product.name}</TableCell>
                              <TableCell className="text-gray-300">{item.size}</TableCell>
                              <TableCell className="text-gray-300">{item.quantity}</TableCell>
                              <TableCell className="text-gray-300">€{item.product.price.toFixed(2)}</TableCell>
                              <TableCell className="text-white">€{(item.product.price * item.quantity).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="text-white">€{selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Shipping:</span>
                      <span className="text-white">€{selectedOrder.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Tax:</span>
                      <span className="text-white">€{selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
                      <span className="text-white">Total:</span>
                      <span className="text-white">€{selectedOrder.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {selectedOrder.status === "pending" && (
                    <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg">
                      <p className="text-yellow-400 mb-3">
                        <strong>Action Required:</strong> This order is waiting for {selectedOrder.paymentMethod} payment verification. 
                        Once you receive the payment, click the button below to confirm.
                      </p>
                      <Button
                        onClick={() => handleConfirmPayment(selectedOrder.id, selectedOrder.paymentMethod)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm {selectedOrder.paymentMethod} Payment
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsOrderDialogOpen(false)} 
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

