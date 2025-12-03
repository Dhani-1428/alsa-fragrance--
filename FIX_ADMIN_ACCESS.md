# Fix: Admin Panel "Page Not Found" Error

## The Problem

Your server is running on **port 3002** instead of port 3000 because port 3000 is already in use.

## Solution: Use the Correct Port

### Option 1: Use Port 3002 (Quick Fix)

Since your server is already running on port 3002, just use that:

**👉 Open this URL in your browser:**
```
http://localhost:3002/admin/login
```

**Login Credentials:**
- Email: `admin@alsafragrance.com`
- Password: `admin123`

---

### Option 2: Free Port 3000 and Restart (Recommended)

If you want to use port 3000, follow these steps:

#### Step 1: Stop the Current Server
In the terminal where `npm run dev` is running, press:
```
Ctrl + C
```

#### Step 2: Kill the Process Using Port 3000

Open a **new** PowerShell terminal and run:

```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F
```

Or use this one-liner:
```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

#### Step 3: Remove Lock File

```powershell
cd "c:\Users\sheet\Downloads\alsafragrance11 (2)"
Remove-Item -Path ".next\dev\lock" -Force -ErrorAction SilentlyContinue
```

#### Step 4: Restart Server

```bash
npm run dev
```

Now it should start on port 3000, and you can use:
```
http://localhost:3000/admin/login
```

---

## Quick Test

Try accessing the admin login page with the port your server is using:

- **If server shows port 3002**: http://localhost:3002/admin/login
- **If server shows port 3000**: http://localhost:3000/admin/login

Check your terminal output to see which port is being used.

---

## Still Getting "Page Not Found"?

If you still get "This page could not be found" even with the correct port:

1. **Verify the files exist:**
   - `app/admin/login/page.tsx` should exist
   - `app/admin/dashboard/page.tsx` should exist

2. **Restart the server:**
   ```bash
   # Stop server (Ctrl+C)
   # Then restart
   npm run dev
   ```

3. **Clear Next.js cache:**
   ```powershell
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

4. **Check browser console:**
   - Press F12
   - Go to Console tab
   - Look for any errors

---

## Summary

**Right now, your admin panel is at:**
```
http://localhost:3002/admin/login
```

Use this URL and it should work! 🎉

