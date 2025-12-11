import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB()
    
    // Handle both async and sync params (Next.js 15+ uses Promise)
    const resolvedParams = params instanceof Promise ? await params : params
    const product = await Product.findById(resolvedParams.id)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Transform product to match frontend format
    const transformedProduct = {
      id: product._id.toString(),
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      salePrice: product.salePrice || undefined,
      salePercent: product.salePercent || undefined,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      images: product.images || [],
      description: product.description,
      notes: {
        top: product.notesTop || [],
        middle: product.notesMiddle || [],
        base: product.notesBase || [],
      },
      size: product.size || [],
      inStock: product.inStock,
      isNew: product.isNew,
      isSale: product.isSale,
      badge: product.badge,
    }

    return NextResponse.json(transformedProduct)
  } catch (error: any) {
    console.error('Error fetching product:', error)
    
    // Handle MongoDB connection errors
    if (error.message && error.message.includes('IP')) {
      return NextResponse.json(
        { 
          error: 'MongoDB connection failed: Your IP address is not whitelisted. Please add your IP to MongoDB Atlas IP whitelist.',
          details: 'Visit https://www.mongodb.com/docs/atlas/security-whitelist/ for instructions.'
        },
        { status: 503 }
      )
    }
    
    if (error.name === 'MongoServerError' || error.message?.includes('MongoDB') || error.message?.includes('Atlas')) {
      return NextResponse.json(
        { 
          error: 'Database connection error. Please check your MongoDB Atlas configuration and IP whitelist settings.',
          details: error.message
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json({ error: error.message || 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB()
    
    // Handle both async and sync params (Next.js 15+ uses Promise)
    const resolvedParams = params instanceof Promise ? await params : params
    const body = await request.json()
    const {
      name,
      category,
      price,
      originalPrice,
      salePrice,
      salePercent,
      rating,
      reviews,
      image,
      images,
      description,
      notes,
      size,
      inStock,
      isNew,
      isSale,
      badge,
    } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (category !== undefined) updateData.category = category
    if (price !== undefined) updateData.price = parseFloat(price)
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null
    if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(salePrice) : null
    if (salePercent !== undefined) updateData.salePercent = salePercent ? parseFloat(salePercent) : null
    if (rating !== undefined) updateData.rating = parseFloat(rating)
    if (reviews !== undefined) updateData.reviews = reviews
    if (image !== undefined) updateData.image = image
    if (images !== undefined) updateData.images = images || []
    if (description !== undefined) updateData.description = description
    if (notes?.top !== undefined) updateData.notesTop = notes.top || []
    if (notes?.middle !== undefined) updateData.notesMiddle = notes.middle || []
    if (notes?.base !== undefined) updateData.notesBase = notes.base || []
    if (size !== undefined) updateData.size = size || []
    if (inStock !== undefined) updateData.inStock = inStock
    if (isNew !== undefined) updateData.isNew = isNew
    if (isSale !== undefined) updateData.isSale = isSale
    if (badge !== undefined) updateData.badge = badge || null

    const product = await Product.findByIdAndUpdate(
      resolvedParams.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: product._id.toString(),
      ...product.toObject(),
    })
  } catch (error: any) {
    console.error('Error updating product:', error)
    
    // Handle MongoDB connection errors
    if (error.message && error.message.includes('IP')) {
      return NextResponse.json(
        { 
          error: 'MongoDB connection failed: Your IP address is not whitelisted. Please add your IP to MongoDB Atlas IP whitelist.',
          details: 'Visit https://www.mongodb.com/docs/atlas/security-whitelist/ for instructions.'
        },
        { status: 503 }
      )
    }
    
    if (error.name === 'MongoServerError' || error.message?.includes('MongoDB') || error.message?.includes('Atlas')) {
      return NextResponse.json(
        { 
          error: 'Database connection error. Please check your MongoDB Atlas configuration and IP whitelist settings.',
          details: error.message
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB()
    
    // Handle both async and sync params (Next.js 15+ uses Promise)
    const resolvedParams = params instanceof Promise ? await params : params

    const deletedProduct = await Product.findByIdAndDelete(resolvedParams.id)

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Product deleted successfully', 
      id: deletedProduct._id.toString() 
    })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    
    // Handle MongoDB connection errors
    if (error.message && error.message.includes('IP')) {
      return NextResponse.json(
        { 
          error: 'MongoDB connection failed: Your IP address is not whitelisted. Please add your IP to MongoDB Atlas IP whitelist.',
          details: 'Visit https://www.mongodb.com/docs/atlas/security-whitelist/ for instructions.'
        },
        { status: 503 }
      )
    }
    
    if (error.name === 'MongoServerError' || error.message?.includes('MongoDB') || error.message?.includes('Atlas')) {
      return NextResponse.json(
        { 
          error: 'Database connection error. Please check your MongoDB Atlas configuration and IP whitelist settings.',
          details: error.message
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}

