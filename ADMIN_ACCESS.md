# Admin Panel Access Guide

## Quick Setup

### Step 1: Create Admin User

Run this command to create the default admin user:

```bash
npm run db:create-admin
```

This will create an admin user with:
- **Email**: `admin@alsafragrance.com`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change the password after your first login!

### Step 2: Start the Development Server

```bash
npm run dev
```

### Step 3: Access Admin Panel

Open your browser and go to:

**http://localhost:3000/admin/login**

## Login Credentials

**Default Credentials:**
- Email: `admin@alsafragrance.com`
- Password: `admin123`

## Admin Panel Features

Once logged in, you'll have access to:

1. **Product Management Dashboard** (`/admin/dashboard`)
   - View all products in a table
   - Add new products
   - Edit existing products
   - Delete products
   - Manage sale prices and discounts

2. **Product Form Features:**
   - Product name, category, description
   - Pricing (regular price, original price, sale price, sale percentage)
   - Images (main image + additional images)
   - Fragrance notes (top, middle, base)
   - Product sizes
   - Stock status
   - Badges (Sale, New, Limited Edition, etc.)

## Changing the Admin Password

To change the password, you can:

1. **Option 1**: Update directly in the database
2. **Option 2**: Create a new script to update the password
3. **Option 3**: Delete and recreate the admin user

## Creating Additional Admin Users

You can create additional admin users by:

1. Using the registration API endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"newadmin@example.com","password":"securepassword","name":"New Admin"}'
   ```

2. Or modify the `scripts/create-admin.ts` file with different credentials and run it again

## Troubleshooting

### Can't Login?

1. Make sure the admin user was created:
   ```bash
   npm run db:create-admin
   ```

2. Check that the database is running and accessible

3. Clear browser localStorage and try again

4. Make sure the development server is running:
   ```bash
   npm run dev
   ```

### Database Not Found?

Run the migration to create the database:
```bash
npm run db:migrate
```

### Forgot Password?

You can reset by:
1. Deleting the user from the database
2. Running `npm run db:create-admin` again
3. Or manually updating the password hash in the database

## Security Notes

- The default password is for development only
- **ALWAYS change the default password in production**
- Use strong, unique passwords
- Consider implementing password reset functionality
- Add rate limiting to login endpoints
- Use HTTPS in production

## Admin Panel URLs

- **Login**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard

After logging in, you'll be automatically redirected to the dashboard.

