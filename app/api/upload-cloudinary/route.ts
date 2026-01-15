import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.',
          instructions: 'Sign up at https://cloudinary.com and add your credentials to .env file or Vercel environment variables.'
        },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ 
        success: false,
        error: 'No file provided' 
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' 
        },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB for Cloudinary free tier)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false,
          error: 'File size too large. Maximum size is 10MB.' 
        },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert buffer to base64 data URI
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const publicId = `alsa-fragrance/products/${timestamp}-${originalName}`

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          public_id: publicId,
          folder: 'alsa-fragrance/products',
          resource_type: 'auto',
          overwrite: false,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    }) as any

    // Return the secure URL
    const imageUrl = uploadResult.secure_url || uploadResult.url

    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
    })
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error)
    
    let errorMessage = 'Failed to upload image to Cloudinary'
    if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
