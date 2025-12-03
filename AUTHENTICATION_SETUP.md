# Authentication System Setup

## ✅ What's Been Implemented

### 1. **Client Authentication**
- Login/Signup page at `/auth/login`
- Clients can create accounts and login
- Default role for new users is "client"

### 2. **Admin Authentication**
- Separate admin login at `/admin/login`
- Only users with `role: "admin"` can access admin dashboard
- Admin credentials: `admin@alsafragrance.com` / `admin123`

### 3. **Navigation Integration**
- "Login" button appears in navigation when user is not logged in
- User menu appears when logged in (shows name/email)
- Admin users see "Admin Dashboard" option in menu

### 4. **Checkout Protection**
- Checkout page requires client authentication
- Unauthenticated users are redirected to login
- After login, users are redirected back to checkout

### 5. **Role-Based Access**
- **Clients**: Can shop, add to cart, checkout (after login)
- **Admins**: Can access admin dashboard, manage products

---

## How It Works

### For Clients:

1. **Sign Up**: Click "Login" → "Sign Up" tab → Create account
2. **Login**: Click "Login" → Enter credentials
3. **Shop**: Browse products, add to cart
4. **Checkout**: Must be logged in to checkout

### For Admins:

1. **Login**: Go to `/admin/login` or click "Admin Login" link
2. **Credentials**: 
   - Email: `admin@alsafragrance.com`
   - Password: `admin123`
3. **Dashboard**: Access product management at `/admin/dashboard`

---

## User Flow

### Client Flow:
```
Homepage → Browse → Add to Cart → Checkout → (Redirected to Login if not logged in) → Login/Signup → Checkout
```

### Admin Flow:
```
/admin/login → Enter admin credentials → /admin/dashboard
```

---

## Database Schema

Users have a `role` field:
- `"client"` - Regular customers (default)
- `"admin"` - Administrators

---

## API Endpoints

### Client Authentication:
- `POST /api/auth/login` - Login (blocks admin users)
- `POST /api/auth/register` - Sign up (creates client by default)

### Admin Authentication:
- `POST /api/auth/login` - Login (checked at `/admin/login` page for admin role)

---

## Security Features

1. **Role Separation**: Clients cannot login through admin page, admins cannot login through client page
2. **Password Hashing**: All passwords are hashed with bcrypt
3. **Protected Routes**: Checkout requires authentication
4. **Role Verification**: Admin dashboard checks for admin role

---

## Testing

### Test Client Signup/Login:
1. Go to homepage
2. Click "Login" button
3. Sign up with new email
4. Try to checkout - should work

### Test Admin Login:
1. Go to `/admin/login`
2. Login with admin credentials
3. Should redirect to `/admin/dashboard`
4. Try logging in as admin through `/auth/login` - should be blocked

---

## Notes

- The existing admin user (`admin@alsafragrance.com`) has role "admin"
- New signups default to "client" role
- Admin users can still access the website normally, but should use `/admin/login` for dashboard access

