# Image Upload Guide for Serverless Environments

Since file uploads don't work in serverless environments (Vercel), you need to use a cloud image hosting service. Here are the best options:

## Option 1: Cloudinary (Recommended - Free Tier Available)

### Steps:
1. **Sign up for Cloudinary** (free account): https://cloudinary.com/users/register/free
2. **Upload your images**:
   - Go to your Cloudinary dashboard
   - Click "Media Library" → "Upload"
   - Upload your product images
3. **Get the image URL**:
   - Click on the uploaded image
   - Copy the "URL" (it will look like: `https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/image-name.jpg`)
4. **Use in Admin Panel**:
   - Paste the URL in the "Main Image" field
   - For additional images, paste URLs separated by commas

### Benefits:
- Free tier: 25GB storage, 25GB bandwidth/month
- Automatic image optimization
- CDN delivery (fast loading)
- Image transformations (resize, crop, etc.)

---

## Option 2: Imgur (Simple & Free)

### Steps:
1. **Go to Imgur**: https://imgur.com/upload
2. **Upload your image** (drag & drop or click to browse)
3. **Right-click the uploaded image** → "Copy image address"
4. **Paste the URL** in the admin panel

### Benefits:
- Completely free
- No account required
- Very simple to use

### Note:
- URLs look like: `https://i.imgur.com/xxxxx.jpg`
- Make sure to get the direct image URL (ends with .jpg, .png, etc.)

---

## Option 3: AWS S3 + CloudFront (For Production)

If you need more control and have AWS account:

1. **Create S3 bucket** for images
2. **Upload images** to S3
3. **Set bucket to public** or use CloudFront CDN
4. **Use S3 URLs** in admin panel

### Benefits:
- Scalable
- Professional solution
- Full control

---

## Option 4: GitHub (Free Hosting)

### Steps:
1. **Create a GitHub repository** (e.g., `my-product-images`)
2. **Upload images** to the repository
3. **Get raw image URLs**:
   - Go to the image file in GitHub
   - Click "Raw" button
   - Copy the URL (looks like: `https://raw.githubusercontent.com/username/repo/main/image.jpg`)
4. **Use in Admin Panel**

### Benefits:
- Free
- Version control for images
- Easy to manage

---

## Quick Start (Recommended: Cloudinary)

1. **Sign up**: https://cloudinary.com/users/register/free
2. **Upload image** in Cloudinary dashboard
3. **Copy the URL** from the image details
4. **Paste in admin panel** → Save product

That's it! The image will be stored in Cloudinary and served via their CDN.

---

## Tips:

- **Image URLs must be publicly accessible** (anyone can view them)
- **Use HTTPS URLs** for security
- **Optimize images** before uploading (keep file sizes reasonable)
- **For multiple images**: Paste URLs separated by commas: `url1.jpg, url2.jpg, url3.jpg`

---

## Need Help?

If you need help setting up any of these services, let me know which one you'd like to use!
