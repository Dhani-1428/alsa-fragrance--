# Admin Panel Setup Guide

This guide will help you set up the admin panel with database integration for your fragrance website.

## Prerequisites

- Node.js installed
- npm or pnpm package manager

## Setup Steps

### 1. Install Dependencies

The required packages are already installed. If you need to reinstall:

```bash
npm install
```

### 2. Database Setup

The database is already configured with Prisma and SQLite. The database file will be created at `prisma/dev.db`.

To generate the Prisma client (if needed):

```bash
npx prisma generate
```

### 3. Create Admin User

First, you need to create an admin user. You can do this by:

1. Starting the development server:
```bash
npm run dev
```

2. Registering a new admin user by making a POST request to `/api/auth/register` with:
```json
{
  "email": "admin@example.com",
  "password": "your-secure-password",
  "name": "Admin Name"
}
```

Or you can create a script to do this. Create a file `scripts/create-admin.ts`:

```typescript
import { PrismaClient } from '../lib/prisma-client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  const password = 'admin123' // Change this!
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  })

  console.log('Admin user created:', user.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### 4. Import Existing Products

To import your existing products from `lib/products-main.ts` into the database, you can use the import script:

```bash
npx tsx scripts/import-products.ts
```

Note: You may need to install `tsx` first:
```bash
npm install -D tsx
```

### 5. Access Admin Panel

1. Navigate to `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. You'll be redirected to the admin dashboard at `/admin/dashboard`

## Admin Panel Features

### Product Management

- **View All Products**: See all products in a table format
- **Add New Product**: Click "Add Product" to create a new product
- **Edit Product**: Click the edit icon on any product row
- **Delete Product**: Click the delete icon (with confirmation)
- **Sale Management**: 
  - Toggle "On Sale" switch
  - Set sale price
  - Set sale percentage
  - Original price is automatically calculated

### Product Fields

- **Basic Info**: Name, Category, Description
- **Pricing**: Price, Original Price, Sale Price, Sale Percent
- **Media**: Main Image URL, Additional Images (comma-separated)
- **Details**: Rating, Reviews, Sizes (comma-separated)
- **Fragrance Notes**: Top, Middle, Base notes (comma-separated)
- **Status**: In Stock, New Arrival, On Sale, Badge

## API Endpoints

### Products

- `GET /api/products` - Get all products (supports query params: `category`, `onSale`, `isNew`)
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Authentication

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new admin

## Website Integration

All website pages now fetch products from the database API:

- `/women` - Women's fragrances
- `/men` - Men's fragrances
- `/attars` - Attar collection
- `/testers` - Tester products
- `/shop` - All products with filters
- `/product/[id]` - Individual product page

Changes made in the admin panel are immediately reflected on the website.

## Sale Functionality

To set a product on sale:

1. Edit the product in the admin panel
2. Toggle "On Sale" switch
3. Set the "Sale Price" (the discounted price)
4. Optionally set "Sale Percent" (percentage discount)
5. The website will automatically show:
   - The sale price as the main price
   - The original price crossed out
   - A "Sale" badge if configured

## Environment Variables

Make sure your `.env` file contains:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

## Production Considerations

For production:

1. **Database**: Switch from SQLite to PostgreSQL or MySQL
2. **Authentication**: Implement proper JWT tokens or use NextAuth.js
3. **Security**: Add rate limiting, CSRF protection
4. **Environment Variables**: Use secure secrets management
5. **Backup**: Set up regular database backups

## Troubleshooting

### Database Issues

If you encounter database errors:

```bash
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

### Import Script Issues

If the import script doesn't work:

1. Make sure `lib/products-main.ts` exists and has products
2. Check that the database is initialized
3. Verify Prisma client is generated

### Authentication Issues

If you can't login:

1. Verify the user exists in the database
2. Check password hashing is working
3. Clear browser localStorage and try again

## Support

For issues or questions, check the Prisma and Next.js documentation.

