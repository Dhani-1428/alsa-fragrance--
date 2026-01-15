# Cloudinary Setup Guide

To enable image uploads from the admin panel, you need to set up Cloudinary.

## Step 1: Sign Up for Cloudinary (Free)

1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account
3. You'll get:
   - 25GB storage
   - 25GB bandwidth/month
   - Free forever

## Step 2: Get Your Cloudinary Credentials

1. After signing up, go to your **Dashboard**
2. You'll see your credentials:
   - **Cloud Name** (e.g., `dxyz1234`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

## Step 3: Add Environment Variables

### For Local Development (.env file):

Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### For Vercel (Production):

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these three variables:
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret
4. Select **Production**, **Preview**, and **Development** environments
5. Click **Save**
6. **Redeploy** your application

## Step 4: Test Image Upload

1. Go to your admin panel
2. Click "Add Product"
3. Click "Choose File" under "Main Image"
4. Select an image
5. The image will be uploaded to Cloudinary automatically
6. The URL will be filled in automatically

## How It Works

- Images are uploaded to Cloudinary's cloud storage
- Images are automatically optimized and served via CDN
- URLs are stored in your database
- Images work on both local development and production (Vercel)

## Benefits

✅ Works in serverless environments (Vercel)  
✅ Automatic image optimization  
✅ Fast CDN delivery  
✅ Free tier with generous limits  
✅ No file system needed  

## Troubleshooting

**Error: "Cloudinary is not configured"**
- Make sure you've added all 3 environment variables
- Restart your development server after adding to .env
- Redeploy on Vercel after adding environment variables

**Upload fails:**
- Check your Cloudinary credentials are correct
- Verify your account is active
- Check file size (max 10MB for free tier)
