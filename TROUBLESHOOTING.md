# Troubleshooting Admin Panel Issues

## Issue: Admin Panel Not Opening

If the admin panel is not opening, follow these steps:

### Step 1: Check if Server is Running

Make sure your development server is running:

```bash
npm run dev
```

You should see output like:
```
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
```

### Step 2: Verify the URL

Make sure you're accessing the correct URL:
- **Login Page**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard (requires login)

### Step 3: Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Look for any red error messages
4. Share the error message if you see any

### Step 4: Check Network Tab

1. Open Developer Tools (F12)
2. Go to the Network tab
3. Try accessing http://localhost:3000/admin/login
4. Check if the request returns a 404 or other error

### Step 5: Verify Database is Set Up

Make sure the database exists and has the admin user:

```bash
# Check if admin user exists
npm run db:create-admin
```

### Step 6: Common Issues and Solutions

#### Issue: "404 - Page Not Found"
**Solution**: Make sure the files exist:
- `app/admin/login/page.tsx` should exist
- `app/admin/dashboard/page.tsx` should exist

#### Issue: "Cannot find module" errors
**Solution**: Reinstall dependencies:
```bash
npm install
npm run db:generate
```

#### Issue: "Database error" or "Prisma error"
**Solution**: Reset and regenerate:
```bash
npm run db:generate
npm run db:migrate
```

#### Issue: Login page loads but login doesn't work
**Solution**: 
1. Verify admin user exists: `npm run db:create-admin`
2. Check browser console for API errors
3. Verify `/api/auth/login` endpoint is accessible

#### Issue: Blank page or white screen
**Solution**:
1. Check browser console for JavaScript errors
2. Make sure all dependencies are installed: `npm install`
3. Clear browser cache and try again

### Step 7: Test the API Endpoints

Test if the login API works:

```bash
# Using curl (if available)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alsafragrance.com","password":"admin123"}'
```

Or use a tool like Postman or your browser's fetch console.

### Step 8: Check File Structure

Make sure your file structure looks like this:

```
app/
  admin/
    login/
      page.tsx
    dashboard/
      page.tsx
  api/
    auth/
      login/
        route.ts
      register/
        route.ts
    products/
      route.ts
      [id]/
        route.ts
```

### Step 9: Restart Everything

Sometimes a full restart helps:

1. Stop the server (Ctrl+C)
2. Clear Next.js cache:
   ```bash
   rm -rf .next
   ```
   (On Windows: `rmdir /s /q .next`)
3. Restart:
   ```bash
   npm run dev
   ```

### Step 10: Check Port Conflicts

Make sure port 3000 is not being used by another application:

```bash
# On Windows PowerShell
netstat -ano | findstr :3000
```

If something is using port 3000, either:
- Stop that application
- Or use a different port: `npm run dev -- -p 3001`

## Still Not Working?

If none of the above solutions work:

1. **Check the terminal output** when running `npm run dev` - look for error messages
2. **Check browser console** for JavaScript errors
3. **Share the specific error message** you're seeing
4. **Verify Next.js version** - make sure you're using Next.js 16.0.0 or compatible version

## Quick Diagnostic Commands

Run these commands to verify everything is set up:

```bash
# 1. Check if dependencies are installed
npm list prisma @prisma/client next-auth bcryptjs

# 2. Generate Prisma client
npm run db:generate

# 3. Create admin user
npm run db:create-admin

# 4. Start server
npm run dev
```

## Expected Behavior

When everything works correctly:

1. **Server starts** without errors
2. **http://localhost:3000/admin/login** shows a login form
3. **Entering credentials** and clicking "Login" redirects to dashboard
4. **Dashboard shows** a table of products (even if empty)

If any of these steps fail, check the corresponding section above.

