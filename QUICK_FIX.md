# Quick Fix Guide

## If Pages Are Not Opening

### Step 1: Check Server Status
Look at your terminal - it should show:
```
✓ Ready in X seconds
- Local:        http://localhost:3000
```

### Step 2: Clear Everything and Restart

```powershell
# Stop all Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Remove cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Regenerate Prisma
npm run db:generate

# Restart server
npm run dev
```

### Step 3: Access Pages

**Main Website:**
- Homepage: http://localhost:3000
- Shop: http://localhost:3000/shop
- Login: http://localhost:3000/auth/login

**Admin Panel:**
- Admin Login: http://localhost:3000/admin/login
- Admin Dashboard: http://localhost:3000/admin/dashboard (after login)

### Step 4: Check Browser Console

1. Open browser (F12)
2. Go to Console tab
3. Look for red errors
4. Share any error messages you see

### Common Issues:

1. **404 Error** → Wrong URL or server not running
2. **Blank Page** → Check browser console for JavaScript errors
3. **Internal Server Error** → Check terminal for API errors
4. **Module Not Found** → Run `npm install` and `npm run db:generate`

### If Still Not Working:

Share:
1. What URL you're trying to access
2. What you see (blank page, error message, etc.)
3. Any errors from browser console (F12)
4. Any errors from terminal

