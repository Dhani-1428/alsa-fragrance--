# 🚀 Quick Start Guide - Admin Panel

## ✅ Admin User Created!

Your admin account has been set up successfully:

### Login Credentials:
- **Email**: `admin@alsafragrance.com`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change this password after your first login!

---

## 📍 How to Access Admin Panel

### Step 1: Start the Development Server

Open your terminal and run:

```bash
npm run dev
```

Wait for the server to start (you'll see "Ready" message).

### Step 2: Open Admin Login Page

Open your web browser and go to:

**👉 http://localhost:3000/admin/login**

### Step 3: Login

Enter your credentials:
- Email: `admin@alsafragrance.com`
- Password: `admin123`

Click "Login" and you'll be redirected to the dashboard!

---

## 🎯 Admin Panel Features

Once logged in, you can:

1. **View All Products** - See all products in a table
2. **Add New Products** - Click "Add Product" button
3. **Edit Products** - Click the edit icon (✏️) on any product
4. **Delete Products** - Click the delete icon (🗑️) on any product
5. **Manage Sales** - Toggle "On Sale" and set sale prices/percentages

---

## 📦 Import Existing Products (Optional)

If you want to import your existing products from `lib/products-main.ts`:

```bash
npm run db:import
```

This will add all your existing products to the database.

---

## 🔐 Changing Your Password

Currently, you can change the password by:

1. **Option 1**: Delete and recreate the admin user
   ```bash
   npm run db:create-admin
   ```

2. **Option 2**: Update it directly in the database using Prisma Studio:
   ```bash
   npx prisma studio
   ```
   Then navigate to the User table and update the password hash.

---

## 🆘 Troubleshooting

### Can't Login?
- Make sure the server is running: `npm run dev`
- Check that you're using the correct URL: `http://localhost:3000/admin/login`
- Verify credentials: Email: `admin@alsafragrance.com`, Password: `admin123`

### Server Won't Start?
- Make sure port 3000 is not in use
- Check that all dependencies are installed: `npm install`

### Database Issues?
- Generate Prisma client: `npm run db:generate`
- Run migrations: `npm run db:migrate`

---

## 📝 Quick Reference

| Action | Command |
|--------|---------|
| Start server | `npm run dev` |
| Create admin | `npm run db:create-admin` |
| Import products | `npm run db:import` |
| Generate Prisma client | `npm run db:generate` |

---

## 🌐 Admin Panel URLs

- **Login**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard

---

**Happy managing! 🎉**

