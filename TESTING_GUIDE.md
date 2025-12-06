# Complete Backend Testing Guide

## ✅ Test Suites Created

I've created **three different test suites** for you to use:

### 1. **Full Test Suite** (`scripts/test-backend.ts`)
   - **25+ comprehensive tests**
   - Tests all API endpoints
   - Tests MongoDB models
   - Tests authentication
   - Tests product CRUD
   - Tests checkout and payments

### 2. **Simple Test Suite** (`scripts/test-backend-simple.ts`)
   - **10+ essential tests**
   - Faster execution
   - Better output formatting
   - Core functionality only

### 3. **MongoDB Connection Test** (`scripts/test-mongodb-only.ts`)
   - **Quick MongoDB verification**
   - Tests only the database connection
   - Useful for troubleshooting

## 🚀 How to Run Tests

### Method 1: Using Batch Files (Easiest - Windows)

**Double-click these files:**
- `run-tests.bat` - Full test suite
- `run-tests-simple.bat` - Simple test suite

### Method 2: Using Command Prompt (Not PowerShell)

Open **Command Prompt** (cmd.exe) and run:

```cmd
# Full test suite
node --import tsx scripts/test-backend.ts

# Simple test suite (recommended)
node --import tsx scripts/test-backend-simple.ts

# MongoDB connection only
node --import tsx scripts/test-mongodb-only.ts
```

### Method 3: Using npm scripts (if execution policy allows)

```bash
npm run test:backend      # Full suite
npm run test:simple       # Simple suite
npm run test:mongodb      # MongoDB only
```

## 📋 Prerequisites

### 1. Start Development Server

**IMPORTANT:** The dev server must be running before tests!

```bash
npm run dev
```

The server should be running on `http://localhost:3000`

### 2. MongoDB Atlas Connection

Make sure:
- MongoDB Atlas is accessible
- Connection string is correct in `lib/mongodb.ts`
- Network access is configured in MongoDB Atlas dashboard

## 🧪 What Gets Tested

### MongoDB Tests ✅
- ✅ Connection to MongoDB Atlas
- ✅ User model CRUD operations
- ✅ Product model CRUD operations
- ✅ Password hashing and verification

### Authentication Tests ✅
- ✅ User registration (`POST /api/auth/register`)
- ✅ User login (`POST /api/auth/login`)
- ✅ Invalid credentials handling

### Product API Tests ✅
- ✅ Get all products (`GET /api/products`)
- ✅ Filter by category (`GET /api/products?category=women`)
- ✅ Filter by sale (`GET /api/products?onSale=true`)
- ✅ Get single product (`GET /api/products/[id]`)
- ✅ Create product (`POST /api/products`)
- ✅ Update product (`PUT /api/products/[id]`)
- ✅ Delete product (`DELETE /api/products/[id]`)

### Other API Tests ✅
- ✅ Contact form (`POST /api/contact`)
- ✅ Checkout with card (`POST /api/checkout`)
- ✅ Checkout with MBWay (`POST /api/checkout`)
- ✅ File upload (`POST /api/upload`)
- ✅ Payment intent (`POST /api/create-payment-intent`)

## 📊 Expected Output

When tests run successfully, you should see:

```
🚀 Backend Test Suite
📍 Base URL: http://localhost:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 MongoDB Connection... ✅ PASSED
🧪 User Model - Create... ✅ PASSED
🧪 User Model - Find... ✅ PASSED
🧪 API - GET /api/products... ✅ PASSED
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Tests: 10+
✅ Passed: 10+
❌ Failed: 0
Success Rate: 100%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🔧 Troubleshooting

### Issue: Tests Hang or No Output

**Solution:** 
1. Make sure dev server is running: `npm run dev`
2. Try running in Command Prompt instead of PowerShell
3. Use the batch files (`run-tests-simple.bat`)
4. Check MongoDB connection first: `npm run test:mongodb`

### Issue: MongoDB Connection Failed

**Solution:**
1. Verify connection string in `lib/mongodb.ts`
2. Check MongoDB Atlas dashboard for network access
3. Verify IP whitelist includes your IP
4. Test connection manually:
   ```bash
   npm run test:mongodb
   ```

### Issue: API Tests Fail (404)

**Solution:**
1. Verify dev server is running on port 3000
2. Check server logs for errors
3. Test endpoint manually:
   ```bash
   curl http://localhost:3000/api/products
   ```

### Issue: PowerShell Execution Policy

**Solution:**
Run this in PowerShell (as Administrator):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use Command Prompt instead.

## 📝 Manual Testing

If automated tests don't work, you can manually test:

### Test Products API
```bash
curl http://localhost:3000/api/products
```

### Test Auth Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\",\"name\":\"Test\"}"
```

### Test Auth Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

## 🎯 Quick Start Checklist

- [ ] Start dev server: `npm run dev`
- [ ] Verify MongoDB connection: `npm run test:mongodb`
- [ ] Run simple tests: `npm run test:simple`
- [ ] Review test results
- [ ] Fix any failures
- [ ] Run full test suite: `npm run test:backend`

## 📚 Files Created

- `scripts/test-backend.ts` - Full comprehensive test suite
- `scripts/test-backend-simple.ts` - Simplified test suite (recommended)
- `scripts/test-mongodb-only.ts` - MongoDB connection test
- `run-tests.bat` - Windows batch file for full tests
- `run-tests-simple.bat` - Windows batch file for simple tests
- `BACKEND_TESTING.md` - Detailed testing documentation
- `TEST_RESULTS_SUMMARY.md` - Test implementation summary

## 💡 Tips

1. **Start with simple tests** - Use `test-backend-simple.ts` first
2. **Test MongoDB first** - Run `test-mongodb-only.ts` to verify connection
3. **Use Command Prompt** - More reliable than PowerShell for output
4. **Check server logs** - Dev server logs show API requests
5. **Test incrementally** - Fix one test at a time

---

**All test suites are ready to use!** Start with the simple test suite to verify everything works, then move to the full suite for comprehensive testing.

