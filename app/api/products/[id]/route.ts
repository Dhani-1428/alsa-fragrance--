import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both async and sync params (Next.js 15+ uses Promise)
    const resolvedParams = params instanceof Promise ? await params : params
    const product = await prisma.product.findUnique({
      where: { id: parseInt(resolvedParams.id) },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Transform product to match frontend format
    let images: string[] = []
    let notesTop: string[] = []
    let notesMiddle: string[] = []
    let notesBase: string[] = []
    let size: string[] = []

    try {
      if (product.images) images = JSON.parse(product.images)
    } catch (e) {
      console.error('Error parsing images:', e)
    }

    try {
      if (product.notesTop) notesTop = JSON.parse(product.notesTop)
    } catch (e) {
      console.error('Error parsing notesTop:', e)
    }

    try {
      if (product.notesMiddle) notesMiddle = JSON.parse(product.notesMiddle)
    } catch (e) {
      console.error('Error parsing notesMiddle:', e)
    }

    try {
      if (product.notesBase) notesBase = JSON.parse(product.notesBase)
    } catch (e) {
      console.error('Error parsing notesBase:', e)
    }

    try {
      if (product.size) size = JSON.parse(product.size)
    } catch (e) {
      console.error('Error parsing size:', e)
    }

    const transformedProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.isSale && product.salePrice ? product.salePrice : product.price,
      originalPrice: product.originalPrice || product.price,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      images,
      description: product.description,
      notes: {
        top: notesTop,
        middle: notesMiddle,
        base: notesBase,
      },
      size,
      inStock: product.inStock,
      isNew: product.isNew,
      isSale: product.isSale,
      badge: product.badge,
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
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

    const product = await prisma.product.update({
      where: { id: parseInt(resolvedParams.id) },
      data: {
        name,
        category,
        price: price ? parseFloat(price) : undefined,
        originalPrice: originalPrice !== undefined ? (originalPrice ? parseFloat(originalPrice) : null) : undefined,
        salePrice: salePrice !== undefined ? (salePrice ? parseFloat(salePrice) : null) : undefined,
        salePercent: salePercent !== undefined ? (salePercent ? parseFloat(salePercent) : null) : undefined,
        rating: rating !== undefined ? parseFloat(rating) : undefined,
        reviews: reviews !== undefined ? reviews : undefined,
        image,
        images: images !== undefined ? (images ? JSON.stringify(images) : null) : undefined,
        description,
        notesTop: notes?.top !== undefined ? JSON.stringify(notes.top) : undefined,
        notesMiddle: notes?.middle !== undefined ? JSON.stringify(notes.middle) : undefined,
        notesBase: notes?.base !== undefined ? JSON.stringify(notes.base) : undefined,
        size: size !== undefined ? (size ? JSON.stringify(size) : null) : undefined,
        inStock: inStock !== undefined ? inStock : undefined,
        isNew: isNew !== undefined ? isNew : undefined,
        isSale: isSale !== undefined ? isSale : undefined,
        badge: badge !== undefined ? badge : undefined,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both async and sync params (Next.js 15+ uses Promise)
    const resolvedParams = params instanceof Promise ? await params : params
    const productId = parseInt(resolvedParams.id)

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ message: 'Product deleted successfully', id: deletedProduct.id })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    
    // Handle Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}

